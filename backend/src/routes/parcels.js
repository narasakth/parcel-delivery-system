// แก้ import ส่วนบน:
const express = require('express');
const router = express.Router();
const { pool } = require('../data/db');              // ใช้ DB แทน store
const { calcShippingFee } = require('../utils/feeCalculator'); // ยังใช้สูตรเดิมได้ (JS) :contentReference[oaicite:3]{index=3}

function genTrackingNo() {
    const n = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `TRK-${Date.now().toString().slice(-6)}-${n}`;
}

// GET /api/parcels (ค้นหา/กรอง/แบ่งหน้า)
router.get('/', async (req, res, next) => {
    try {
        const { q = '', status, phone, date_from, date_to, page = '1', page_size = '10' } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const sizeNum = Math.max(1, Math.min(100, parseInt(page_size, 10) || 10));
        const offset = (pageNum - 1) * sizeNum;

        const where = [];
        const params = [];

        if (q) { where.push(`(tracking_no LIKE ? OR sender_name LIKE ? OR receiver_name LIKE ?)`); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
        if (status) { where.push(`status = ?`); params.push(status); }
        if (phone) { where.push(`receiver_phone = ?`); params.push(phone); }
        if (date_from) { where.push(`created_at >= ?`); params.push(date_from); }
        if (date_to) { where.push(`created_at <= ?`); params.push(date_to); }

        const W = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const [rows] = await pool.query(
            `SELECT * FROM parcels ${W} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, sizeNum, offset]
        );
        const [cnt] = await pool.query(`SELECT COUNT(*) AS total FROM parcels ${W}`, params);

        res.json({ items: rows, page: pageNum, page_size: sizeNum, total: cnt[0].total });
    } catch (e) { next(e); }
});

// GET /api/parcels/:id
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM parcels WHERE id = ?`, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Parcel not found' });
        res.json(rows[0]);
    } catch (e) { next(e); }
});

// POST /api/parcels
router.post('/', async (req, res, next) => {
    try {
        const { sender_name, sender_phone, receiver_name, receiver_phone, receiver_address,
            weight_kg = 0, size_lwh_cm = null, distance_km = 0 } = req.body || {};
        if (!sender_name || !sender_phone || !receiver_name || !receiver_phone || !receiver_address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const shipping_fee = calcShippingFee({ weight_kg: +weight_kg || 0, distance_km: +distance_km || 0 });

        const tracking_no = genTrackingNo();
        const now = new Date();

        const [rs] = await pool.query(
            `INSERT INTO parcels
       (tracking_no, sender_name, sender_phone, receiver_name, receiver_phone, receiver_address,
        weight_kg, size_lwh_cm, distance_km, shipping_fee, status, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?, 'CREATED', ?, ?)`,
            [tracking_no, sender_name, sender_phone, receiver_name, receiver_phone, receiver_address,
                weight_kg, size_lwh_cm, distance_km, shipping_fee, now, now]
        );

        // (ออปชัน) ถ้าต้องการบันทึกการชำระเงินทันที
        await pool.query(
            `INSERT INTO payments (parcel_id, amount, method, ref_no, paid_at)
       VALUES (?,?,?,?,?)`,
            [rs.insertId, shipping_fee, 'CASH', `PAY-${tracking_no}`, now]
        );

        const [created] = await pool.query(`SELECT * FROM parcels WHERE id = ?`, [rs.insertId]);
        res.status(201).json(created[0]);
    } catch (e) { next(e); }
});

// PATCH /api/parcels/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const id = +req.params.id;

        // ดึงของเดิม
        const [cur] = await pool.query(`SELECT * FROM parcels WHERE id = ?`, [id]);
        if (cur.length === 0) return res.status(404).json({ error: 'Parcel not found' });
        const p = cur[0];

        // ค่าที่อนุญาตให้แก้
        const fields = ['sender_name', 'sender_phone', 'receiver_name', 'receiver_phone', 'receiver_address', 'weight_kg', 'size_lwh_cm', 'distance_km', 'status'];
        const data = { ...p };
        for (const k of fields) if (k in req.body) data[k] = req.body[k];

        // ถ้าน้ำหนัก/ระยะทางเปลี่ยน → คิดค่าขนส่งใหม่
        if ('weight_kg' in req.body || 'distance_km' in req.body) {
            data.shipping_fee = calcShippingFee({ weight_kg: +data.weight_kg || 0, distance_km: +data.distance_km || 0 });
        }

        await pool.query(
            `UPDATE parcels
       SET sender_name=?, sender_phone=?, receiver_name=?, receiver_phone=?, receiver_address=?,
           weight_kg=?, size_lwh_cm=?, distance_km=?, shipping_fee=?, status=?, updated_at=NOW()
       WHERE id = ?`,
            [data.sender_name, data.sender_phone, data.receiver_name, data.receiver_phone, data.receiver_address,
            data.weight_kg, data.size_lwh_cm, data.distance_km, data.shipping_fee, data.status, id]
        );

        const [updated] = await pool.query(`SELECT * FROM parcels WHERE id = ?`, [id]);
        res.json(updated[0]);
    } catch (e) { next(e); }
});

// DELETE /api/parcels/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const id = +req.params.id;
        const [cur] = await pool.query(`SELECT * FROM parcels WHERE id = ?`, [id]);
        if (cur.length === 0) return res.status(404).json({ error: 'Parcel not found' });

        await pool.query(`DELETE FROM parcels WHERE id = ?`, [id]); // FK จะลบ events/payments ให้ถ้าตั้ง ON DELETE CASCADE
        res.json({ message: 'Deleted', parcel: cur[0] });
    } catch (e) { next(e); }
});

module.exports = router;
