import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function TrackingDetail() {
  const { id } = useParams();
  const [data, setData] = useState({ parcel: null, events: [] });
  const [posting, setPosting] = useState(false);
  const [event, setEvent] = useState({ event_code: 'IN_HUB', location: '', note: '' });

  const load = () => api.getTrackingDetail(id).then(setData).catch(console.error);
  useEffect(() => { load(); }, [id]);

  const addEvent = async () => {
    setPosting(true);
    try {
      await api.addTrackingEvent(id, event);
      await load();
      setEvent({ event_code: 'IN_HUB', location: '', note: '' });
    } finally { setPosting(false); }
  };

  if (!data.parcel) return <div className="text-gray-300">Loading...</div>;

  const input = "rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-400 focus:border-yellow-400";
  const card  = "rounded-2xl border border-yellow-500/30 bg-black/60 shadow p-5";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-yellow-400">Tracking Detail</h1>

      <section className={card}>
        <div className="grid md:grid-cols-2 gap-4">
          <div><div className="text-gray-400">Tracking</div><div className="font-semibold text-gray-100">{data.parcel.tracking_no}</div></div>
          <div><div className="text-gray-400">สถานะ</div><div className="font-medium text-gray-100">{data.parcel.status}</div></div>
        </div>
      </section>

      <section className={card}>
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">เพิ่มเหตุการณ์</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <select className={input} value={event.event_code} onChange={e => setEvent({ ...event, event_code: e.target.value })}>
            <option>PICKED_UP</option><option>IN_HUB</option>
            <option>OUT_FOR_DELIVERY</option><option>DELIVERED</option>
            <option>DELAYED</option><option>CANCELED</option>
          </select>
          <input className={input} placeholder="สถานที่" value={event.location} onChange={e => setEvent({ ...event, location: e.target.value })} />
          <input className={input} placeholder="หมายเหตุ" value={event.note} onChange={e => setEvent({ ...event, note: e.target.value })} />
          <button disabled={posting} onClick={addEvent} className="rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black px-4">
            {posting ? 'Saving...' : 'บันทึก'}
          </button>
        </div>
      </section>

      <section className={card}>
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">Timeline</h3>
        <ul className="relative pl-6">
          {data.events.map(e => (
            <li key={e.id} className="mb-4">
              <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-yellow-500"></span>
              <div className="font-medium text-gray-100">{e.event_code} <span className="text-gray-400">— {e.location || '-'}</span></div>
              <div className="text-gray-400 text-sm">{new Date(e.event_time).toLocaleString()}</div>
              {e.note && <div className="text-sm mt-1 text-gray-200">{e.note}</div>}
            </li>
          ))}
          {!data.events.length && <div className="text-gray-400">ยังไม่มีเหตุการณ์</div>}
        </ul>
      </section>
    </div>
  );
}
