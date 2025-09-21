import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock3, Timer, Wallet } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ OUT_FOR_DELIVERY: 0, DELIVERED: 0, DELAYED: 0 });
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    api.getParcels({ page_size: 200 }).then(d => {
      const c = d.items.reduce((a, p) => ((a[p.status] = (a[p.status] || 0) + 1), a), {});
      setStats({
        OUT_FOR_DELIVERY: c.OUT_FOR_DELIVERY || 0,
        DELIVERED: c.DELIVERED || 0,
        DELAYED: c.DELAYED || 0
      });
    });
    api.revenue('daily').then(d => setRevenue((d.series || []).map(x => ({ ...x, amount: Number(x.amount) })))); 
  }, []);

  const card = "relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-black/60 shadow";
  const StatCard = ({ label, value, icon, accent }) => (
    <div className={card}>
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${accent} opacity-10`} />
      <div className="p-6 flex items-center justify-between">
        <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">{icon}</div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-300 mb-1">{label}</div>
          <div className="text-3xl font-extrabold text-yellow-400">{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-yellow-400">Dashboard Overview</h1>
        <p className="text-gray-300">Monitor your parcel delivery system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Out for Delivery" value={stats.OUT_FOR_DELIVERY} accent="bg-yellow-500" icon={<Clock3 className="w-5 h-5" />} />
        <StatCard label="Delivered" value={stats.DELIVERED} accent="bg-yellow-500" icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard label="Delayed" value={stats.DELAYED} accent="bg-yellow-500" icon={<Timer className="w-5 h-5" />} />
      </div>

      <section className="rounded-2xl overflow-hidden border border-yellow-500/30 bg-black/60 shadow">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 text-black flex items-center gap-3">
          <div className="p-2 bg-black/10 rounded-lg"><Wallet className="w-5 h-5" /></div>
          <div>
            <h3 className="text-xl font-extrabold">Daily Revenue</h3>
            <p className="text-black/70">Track your daily earnings</p>
          </div>
        </div>
        <div className="p-6">
          {revenue.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#FDE68A" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" tick={{ fill: '#D1D5DB', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#374151' }} />
                  <YAxis tickFormatter={(v) => `฿${v.toLocaleString()}`} tick={{ fill: '#D1D5DB', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#374151' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #F59E0B', color: '#FDE68A' }} formatter={(v) => [`฿${Number(v).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">No Revenue Data</div>
          )}
        </div>
      </section>
    </div>
  );
}
