import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Login({ onLogin }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (error) setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(form);
      if (onLogin) onLogin(res.user);
      window.dispatchEvent(new StorageEvent('storage', { key: 'accessToken' }));
      nav('/');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/60 border border-yellow-500/30 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-extrabold text-yellow-400 mb-1">Sign in</h1>
        <p className="text-sm text-gray-300 mb-6">เข้าสู่ระบบเพื่อจัดการพัสดุของคุณ</p>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/50 bg-rose-900/30 text-rose-200 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-yellow-400 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={change} className={inputCls} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-400 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={change} className={inputCls} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full mt-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2.5 disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="text-yellow-400 hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}
