// src/App.js
import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import ParcelsList from './pages/ParcelsList';
import ParcelDetail from './pages/ParcelDetail';
import SearchFilter from './pages/SearchFilter';
import CreateParcel from './pages/CreateParcel';
import TrackingList from './pages/TrackingList';
import TrackingDetail from './pages/TrackingDetail';
import ManageParcel from './pages/ManageParcel';
import Login from './pages/Login';
import Register from './pages/Register';

import { api } from './services/api';

/* ---------- Route Guards ---------- */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
function UnauthRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  if (token) return <Navigate to="/" replace />;
  return children;
}
/* ---------------------------------- */

export default function App() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // โหลดโปรไฟล์ถ้ามี token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setAuthReady(true);
      return;
    }
    api.me()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      })
      .finally(() => setAuthReady(true));
  }, []);

  // sync token ระหว่างแท็บ
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'accessToken') {
        const t = localStorage.getItem('accessToken');
        if (!t) setUser(null);
        else api.me().then((res) => setUser(res.user)).catch(() => setUser(null));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${isActive
        ? 'bg-yellow-500 text-black shadow'
        : 'text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-300'}`;

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    nav('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-3 justify-between bg-black/70 border-b border-yellow-500/20 px-6 py-4 backdrop-blur">
        <h1 className="text-xl font-extrabold tracking-tight text-yellow-400">Parcel Delivery</h1>

        <nav className="flex flex-wrap gap-2">
          <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
          <NavLink to="/parcels" className={navLinkClass}>Parcels</NavLink>
          <NavLink to="/search" className={navLinkClass}>Search</NavLink>
          <NavLink to="/create" className={navLinkClass}>Create</NavLink>
          <NavLink to="/tracking" className={navLinkClass}>Tracking</NavLink>
          <NavLink to="/manage" className={navLinkClass}>Manage</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {!authReady ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-200">
                สวัสดี, <span className="font-semibold text-yellow-300">{user.full_name || user.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white border border-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black shadow"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-black/40 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-8">
        <Routes>
          {/* Protected pages */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/parcels" element={<ProtectedRoute><ParcelsList /></ProtectedRoute>} />
          <Route path="/parcels/:id" element={<ProtectedRoute><ParcelDetail /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchFilter /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateParcel /></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute><TrackingList /></ProtectedRoute>} />
          <Route path="/tracking/:id" element={<ProtectedRoute><TrackingDetail /></ProtectedRoute>} />
          <Route path="/manage" element={<ProtectedRoute><ManageParcel /></ProtectedRoute>} />

          {/* Auth pages */}
          <Route path="/login" element={<UnauthRoute><Login onLogin={setUser} /></UnauthRoute>} />
          <Route path="/register" element={<UnauthRoute><Register onRegister={setUser} /></UnauthRoute>} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
