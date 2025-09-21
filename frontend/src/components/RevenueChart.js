import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function RevenueChart() {
    const [gran, setGran] = useState('daily');
    const [series, setSeries] = useState([]);

    useEffect(() => {
        api.revenue(gran).then(d => setSeries(d.series)).catch(console.error);
    }, [gran]);

    return (
        <div className="card">
            <div className="row between">
                <h3>รายได้ ({gran})</h3>
                <select value={gran} onChange={(e) => setGran(e.target.value)}>
                    <option value="daily">รายวัน</option>
                    <option value="monthly">รายเดือน</option>
                </select>
            </div>
            <ul>
                {series.map(p => (
                    <li key={p.period} className="row between">
                        <span>{p.period}</span>
                        <b>{Number(p.amount).toLocaleString()}</b>
                    </li>
                ))}
            </ul>
        </div>
    );
}
