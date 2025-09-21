// in-memory store (ข้อมูลจะหายเมื่อรีสตาร์ท)
const db = {
    parcels: [],
    parcelEvents: [],
    payments: []
};

let _id = 1;
function nextId() { return _id++; }
function genTrackingNo() {
    const n = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `TRK-${Date.now().toString().slice(-6)}-${n}`;
}

module.exports = { db, nextId, genTrackingNo };
