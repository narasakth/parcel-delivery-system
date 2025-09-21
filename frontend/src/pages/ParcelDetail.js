import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { MapPin, Phone, User, Home } from 'lucide-react';

export default function ParcelDetail() {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.getParcel(id).then(setParcel).catch(console.error);
    api.getTrackingDetail(id).then(d => setEvents(d.events || [])).catch(console.error);
  }, [id]);

  if (!parcel) return <div className="text-gray-300">Loading...</div>;

  const card = "rounded-2xl border border-yellow-500/30 bg-black/60 shadow p-5";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-yellow-400">Parcel Detail</h1>

      <section className={card}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-gray-400">Tracking</div>
            <div className="font-semibold text-gray-100">{parcel.tracking_no}</div>
          </div>
          <div>
            <div className="text-gray-400">สถานะ</div>
            <StatusBadge status={parcel.status} />
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="text-gray-400">ผู้ส่ง</div>
              <div className="text-gray-100">{parcel.sender_name} <span className="text-gray-400">({parcel.sender_phone})</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="text-gray-400">ผู้รับ</div>
              <div className="text-gray-100">{parcel.receiver_name} <span className="text-gray-400">({parcel.receiver_phone})</span></div>
            </div>
          </div>
          <div className="md:col-span-2 flex items-start gap-2">
            <Home className="w-4 h-4 text-yellow-400 mt-1" />
            <div>
              <div className="text-gray-400">ที่อยู่ผู้รับ</div>
              <div className="text-gray-100">{parcel.receiver_address}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={card}>
        <h3 className="text-lg font-semibold text-yellow-400 mb-4">Timeline</h3>
        <ul className="relative pl-6 border-l-2 border-yellow-500/20">
          {events.map((e, idx) => (
            <li key={e.id} className="mb-4 pl-4 relative">
              <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-yellow-500 ring-4 ring-black/60"></span>
              <div className="font-medium text-gray-100">{e.event_code} <span className="text-gray-400">— {e.location || '-'}</span></div>
              <div className="text-gray-400 text-sm">{new Date(e.event_time).toLocaleString()}</div>
              {e.note && <div className="text-sm mt-1 text-gray-200">{e.note}</div>}
              {idx !== events.length - 1 && <div className="absolute -left-px top-3 h-full w-px bg-yellow-500/20" />}
            </li>
          ))}
          {!events.length && <div className="text-gray-400">ยังไม่มีเหตุการณ์</div>}
        </ul>
      </section>
    </div>
  );
}
