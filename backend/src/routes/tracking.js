const express = require('express');
const router = express.Router();
const { pool } = require('../data/db');

// GET /api/tracking  (สถานะรวมแบบสั้น)
router.get('/', async (_req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id AS parcel_id, tracking_no, status, updated_at
       FROM parcels
       ORDER BY updated_at DESC`
        );
        res.json({ items: rows, total: rows.length });
    } catch (e) { next(e); }
});

// GET /api/tracking/:parcelId  (รายละเอียด + ไทม์ไลน์)
router.get('/:parcelId', async (req, res, next) => {
    try {
        const id = +req.params.parcelId;
        const [p] = await pool.query(`SELECT * FROM parcels WHERE id=?`, [id]);
        if (p.length === 0) return res.status(404).json({ error: 'Parcel not found' });

        const [events] = await pool.query(
            `SELECT * FROM parcel_events WHERE parcel_id=? ORDER BY event_time ASC, id ASC`, [id]
        );
        res.json({ parcel: p[0], events });
    } catch (e) { next(e); }
});

// POST /api/tracking/:parcelId/events  (เพิ่ม event + อัปเดตสถานะรวม)
router.post('/:parcelId/events', async (req, res, next) => {
    try {
        const id = +req.params.parcelId;
        const { event_code, location = null, note = null, scanned_by = null } = req.body || {};
        if (!event_code) return res.status(400).json({ error: 'event_code is required' });

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [p] = await conn.query(`SELECT * FROM parcels WHERE id=? FOR UPDATE`, [id]);
            if (p.length === 0) {
                await conn.rollback(); conn.release();
                return res.status(404).json({ error: 'Parcel not found' });
            }

            await conn.query(
                `INSERT INTO parcel_events (parcel_id, event_code, location, note, scanned_by, event_time)
         VALUES (?,?,?,?,?,NOW())`,
                [id, event_code, location, note, scanned_by]
            );

            const mapStatus = {
                PICKED_UP: 'IN_HUB',
                IN_HUB: 'IN_HUB',
                OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
                DELIVERED: 'DELIVERED',
                DELAYED: 'DELAYED',
                CANCELED: 'CANCELED'
            };
            if (mapStatus[event_code]) {
                await conn.query(
                    `UPDATE parcels SET status=?, updated_at=NOW() WHERE id=?`,
                    [mapStatus[event_code], id]
                );
            }

            await conn.commit();
            conn.release();

            res.status(201).json({ message: 'event added', current_status: mapStatus[event_code] || p[0].status });
        } catch (txErr) {
            await conn.rollback(); conn.release(); throw txErr;
        }
    } catch (e) { next(e); }
});

module.exports = router;
