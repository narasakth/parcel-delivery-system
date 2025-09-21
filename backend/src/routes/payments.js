const express = require('express');
const router = express.Router();
const { pool } = require('../data/db');

// GET /api/payments/summary?granularity=daily|monthly
router.get('/summary', async (req, res, next) => {
    try {
        const { granularity = 'daily' } = req.query;

        if (granularity === 'monthly') {
            const [rows] = await pool.query(
                `SELECT DATE_FORMAT(paid_at, '%Y-%m') AS period, SUM(amount) AS amount
         FROM payments GROUP BY DATE_FORMAT(paid_at, '%Y-%m') ORDER BY period`
            );
            const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
            return res.json({ granularity, series: rows, total });
        }

        // default: daily
        const [rows] = await pool.query(
            `SELECT DATE(paid_at) AS period, SUM(amount) AS amount
       FROM payments GROUP BY DATE(paid_at) ORDER BY period`
        );
        const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
        res.json({ granularity, series: rows, total });
    } catch (e) { next(e); }
});

module.exports = router;
