import { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';

export default function ParcelsList() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getParcels()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-yellow-500/20 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-yellow-500/10 rounded w-96"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-black/60 rounded-2xl p-6 shadow border border-yellow-500/30 animate-pulse">
              <div className="h-24 bg-yellow-500/10 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-yellow-400">รายการพัสดุ</h1>
        <p className="text-gray-300 text-lg">จัดการและติดตามพัสดุทั้งหมด ({data.total} รายการ)</p>
      </div>

      <div className="bg-black/60 rounded-2xl shadow border border-yellow-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 text-black flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold">รายการพัสดุทั้งหมด</h3>
            <p className="text-black/70">จัดการและติดตามพัสดุทั้งหมด</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold">{data.items.length}</div>
            <div className="text-black/70 text-sm">รายการแสดง</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-100">
            <thead className="bg-black/50 border-b border-yellow-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-yellow-400 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-4 text-left text-yellow-400 uppercase tracking-wider">ผู้ส่ง</th>
                <th className="px-6 py-4 text-left text-yellow-400 uppercase tracking-wider">ผู้รับ</th>
                <th className="px-6 py-4 text-left text-yellow-400 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-4 text-left text-yellow-400 uppercase tracking-wider">ค่าขนส่ง</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-500/10">
              {data.items.map((p) => (
                <tr key={p.id} className="hover:bg-yellow-500/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-100">{p.tracking_no}</div>
                    <div className="text-sm text-gray-400">ID: {p.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-100">{p.sender_name}</div>
                    <div className="text-sm text-gray-400">{p.sender_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-100">{p.receiver_name}</div>
                    <div className="text-sm text-gray-400">{p.receiver_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={p.status} size="small" /></td>
                  <td className="px-6 py-4 whitespace-nowrap">฿{Number(p.shipping_fee).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link to={`/parcels/${p.id}`} className="inline-flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600">ดูรายละเอียด</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
