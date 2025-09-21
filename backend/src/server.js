// src/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql2/promise');

const app = express();

/* ========= Config ========= */
const PORT = process.env.PORT || 4000;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'parcel_delivery';

/* ========= Middlewares ========= */
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* ========= MySQL Pool ========= */
let pool;
(async () => {
    try {
        pool = mysql.createPool({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0
        });

        // test connection
        const [rows] = await pool.query('SELECT 1 AS ok');
        if (rows?.[0]?.ok !== 1) throw new Error('DB ping failed');

        console.log('✅ MySQL connected:', DB_HOST, DB_NAME);
    } catch (err) {
        console.error('❌ MySQL connect error:', err.message);
        process.exit(1);
    }
})();

/* ========= Make pool available to routes ========= */
app.use((req, _res, next) => {
    req.db = pool; // ใช้ใน route: const { db } = req; หรือ req.db.query(...)
    next();
});

/* ========= Health ========= */
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

/* ========= Routes =========
   หมายเหตุ: ไฟล์ routes ควรใช้ req.db (mysql2 pool) แทน in-memory
   ตัวอย่าง: const router = require('express').Router();
             router.get('/', async (req,res)=>{ const [rows]=await req.db.query('SELECT * FROM parcels'); res.json(rows); });
*/
app.use('/api/parcels', require('./routes/parcels'));   // ต้องปรับภายในไฟล์นี้มาใช้ req.db
app.use('/api/tracking', require('./routes/tracking')); // ต้องปรับภายในไฟล์นี้มาใช้ req.db
app.use('/api/payments', require('./routes/payments')); // ต้องปรับภายในไฟล์นี้มาใช้ req.db

/* ========= 404 & Error ========= */
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

app.use((err, _req, res, _next) => {
    console.error('🔥 Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

/* ========= Start ========= */
const server = app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

/* ========= Graceful Shutdown ========= */
function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down...`);
    server.close(async () => {
        try {
            if (pool) await pool.end();
            console.log('🧹 MySQL pool closed.');
        } catch (e) {
            console.error('Error closing MySQL pool:', e.message);
        } finally {
            process.exit(0);
        }
    });
}
['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));
