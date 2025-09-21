import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trash2 } from 'lucide-react';

export default function ManageParcel() {
  const [list, setList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { api.getParcels({ page_size: 100 }).then(d => setList(d.items)); }, [refreshKey]);

  const remove = async (id) => {
    if (!window.confirm('ยืนยันการลบพัสดุนี้?')) return;
    await api.deleteParcel(id);
    setRefreshKey(k => k + 1);
  };

  const tableCls = "min-w-full text-sm";
  const th = "px-4 py-3 text-left text-yellow-400";
  const td = "px-4 py-3";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-yellow-400">Manage Parcel</h1>

      <div className="overflow-x-auto rounded-2xl border border-yellow-500/30 bg-black/60 shadow">
        <table className={tableCls}>
          <thead className="bg-black/50 border-b border-yellow-500/20">
            <tr>
              <th className={th}>Tracking</th>
              <th className={th}>ผู้รับ</th>
              <th className={th}>สถานะ</th>
              <th className="px-4 py-3 text-right text-yellow-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-t border-yellow-500/10 hover:bg-yellow-500/5">
                <td className={td}>{p.tracking_no}</td>
                <td className={td}>{p.receiver_name}</td>
                <td className={td}>{p.status}</td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-rose-600 text-white hover:bg-rose-700" onClick={() => remove(p.id)}>
                    <Trash2 className="w-4 h-4" /> ลบ
                  </button>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td className="px-4 py-6 text-center text-gray-400" colSpan="4">ไม่มีข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
