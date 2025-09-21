import { useState } from 'react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';

export default function SearchFilter() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const onSearch = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = Object.fromEntries([...form.entries()].filter(([, v]) => v));
    setLoading(true);
    try {
      const res = await api.getParcels(params);
      setData(res);
    } finally { setLoading(false); }
  };

  const input = "rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400";
  const card  = "rounded-2xl border border-yellow-500/30 bg-black/60 shadow";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-yellow-400">Search / Filter</h1>

      <form onSubmit={onSearch} className={`${card} p-4 grid gap-3 md:grid-cols-5`}>
        <div className="col-span-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-yellow-400" />
          <input name="q" className={`${input} flex-1`} placeholder="ค้นหา (tracking / ชื่อ)" />
        </div>
        <select name="status" className={input}>
          <option value="">All Status</option>
          <option>CREATED</option><option>IN_HUB</option>
          <option>OUT_FOR_DELIVERY</option><option>DELIVERED</option>
          <option>DELAYED</option><option>CANCELED</option>
        </select>
        <input name="phone" className={input} placeholder="เบอร์ผู้รับ" />
        <div className="grid grid-cols-2 gap-2">
          <input name="date_from" type="date" className={input} />
          <input name="date_to" type="date" className={input} />
        </div>
        <div className="md:col-span-5 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2 text-black font-semibold hover:bg-yellow-600">
            <Filter className="w-4 h-4" /> ค้นหา
          </button>
        </div>
      </form>

      {loading && <div className="text-gray-400">Loading...</div>}

      <div className="overflow-x-auto rounded-2xl border border-yellow-500/30 bg-black/60 shadow">
        <table className="min-w-full text-sm text-gray-100">
          <thead className="bg-black/50 border-b border-yellow-500/20">
            <tr>
              <th className="px-4 py-3 text-left text-yellow-400">Tracking</th>
              <th className="px-4 py-3 text-left text-yellow-400">Sender</th>
              <th className="px-4 py-3 text-left text-yellow-400">Receiver</th>
              <th className="px-4 py-3 text-left text-yellow-400">Status</th>
              <th className="px-4 py-3 text-right text-yellow-400">Shipping Fee</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(p => (
              <tr key={p.id} className="border-t border-yellow-500/10 hover:bg-yellow-500/5">
                <td className="px-4 py-3 font-medium">{p.tracking_no}</td>
                <td className="px-4 py-3">{p.sender_name}</td>
                <td className="px-4 py-3">{p.receiver_name}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 text-right">฿{Number(p.shipping_fee).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link className="text-yellow-400 hover:underline" to={`/parcels/${p.id}`}>View Details</Link>
                </td>
              </tr>
            ))}
            {!data.items.length && !loading && (
              <tr><td className="px-4 py-6 text-center text-gray-400" colSpan="6">No data found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
