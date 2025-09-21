function calcShippingFee({ base = 20, perKg = 10, perKm = 2, weight_kg = 0, distance_km = 0 }) {
    const fee = base + (perKg * Math.max(0, weight_kg)) + (perKm * Math.max(0, distance_km));
    return Math.max(0, Math.round(fee));
}
module.exports = { calcShippingFee };
