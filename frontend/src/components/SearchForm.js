import { useState } from 'react';

export default function SearchForm({ onSearch }) {
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [phone, setPhone] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const submit = (e) => {
        e.preventDefault();
        onSearch({ q, status, phone, date_from: dateFrom, date_to: dateTo });
    };

    return (
        <form onSubmit={submit} className="card row gap">
            <input placeholder="คำค้น (เลขพัสดุ/ชื่อ)" value={q} onChange={e => setQ(e.target.value)} />
            <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="">ทุกสถานะ</option>
                <option>CREATED</option><option>IN_HUB</option>
                <option>OUT_FOR_DELIVERY</option><option>DELIVERED</option>
                <option>DELAYED</option><option>CANCELED</option>
            </select>
            <input placeholder="เบอร์ผู้รับ" value={phone} onChange={e => setPhone(e.target.value)} />
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <button type="submit">ค้นหา</button>
        </form>
    );
}
