import { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';

export default function TrackingList() {
  const [data, setData] = useState({ items: [] });

  useEffect(() => { api.getTrackingList().then(setData).catch(console.error); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-yellow-400 mb-2">Tracking List</h1>
      <div className="overflow-x-auto rounded-2xl border border-yellow-500/30 bg-black/60 shadow">
        <table className="min-w-full text-sm text-gray-100">
          <thead className="bg-black/50 border-b border-yellow-500/20">
            <tr>
              <th className="px-4 py-3 text-left text-yellow-400">Tracking</th>
              <th className="px-4 py-3 text-left text-yellow-400">สถานะ</th>
              <th className="px-4 py-3 text-left text-yellow-400">อัปเดตล่าสุด</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(x => (
              <tr key={x.parcel_id} className="border-t border-yellow-500/10 hover:bg-yellow-500/5">
                <td className="px-4 py-3">{x.tracking_no}</td>
                <td className="px-4 py-3"><StatusBadge status={x.status} /></td>
                <td className="px-4 py-3 text-gray-300">{new Date(x.updated_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link className="text-yellow-400 hover:underline" to={`/tracking/${x.parcel_id}`}>Detail</Link>
                </td>
              </tr>
            ))}
            {!data.items.length && (
              <tr><td className="px-4 py-6 text-center text-gray-400" colSpan="4">ไม่มีข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
