export default function Timeline({ events = [] }) {
    if (!events.length) return <div className="card">ยังไม่มีเหตุการณ์</div>;
    return (
        <ul className="timeline card">
            {events.map(e => (
                <li key={e.id}>
                    <div><b>{e.event_code}</b> — {e.location || '-'}</div>
                    <div className="muted">{new Date(e.event_time).toLocaleString()}</div>
                    {e.note && <div>{e.note}</div>}
                </li>
            ))}
        </ul>
    );
}
