const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function getAccessToken() {
  return localStorage.getItem('accessToken') || '';
}
function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}
function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function request(path, options = {}, withAuth = true) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (withAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401 && withAuth) {
    // ลอง refresh แล้วยิงใหม่
    const ok = await tryRefresh();
    if (ok) return request(path, options, withAuth);
  }
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

async function tryRefresh() {
  const rt = localStorage.getItem('refreshToken');
  if (!rt) return false;
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ refreshToken: rt })
  });
  if (!res.ok) { clearTokens(); return false; }
  const data = await res.json();
  if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
  return true;
}

export const api = {
  // auth
  register: (body) => request('/auth/register', { method:'POST', body: JSON.stringify(body) }, false),
  login: async (body) => {
    const data = await request('/auth/login', { method:'POST', body: JSON.stringify(body) }, false);
    setTokens(data);
    return data;
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await request('/auth/logout', { method:'POST', body: JSON.stringify({ refreshToken }) }, false);
    }
    clearTokens();
  },
  me: () => request('/auth/me'), // ถ้าคุณทำ endpoint นี้ไว้

  // เดิม
  getParcels: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/parcels${qs ? `?${qs}` : ''}`);
  },
  getParcel: (id) => request(`/parcels/${id}`),
  createParcel: (body) => request('/parcels', { method:'POST', body: JSON.stringify(body) }),
  updateParcel: (id, body) => request(`/parcels/${id}`, { method:'PATCH', body: JSON.stringify(body) }),
  deleteParcel: (id) => request(`/parcels/${id}`, { method:'DELETE' }),
  getTrackingList: () => request('/tracking'),
  getTrackingDetail: (id) => request(`/tracking/${id}`),
  addTrackingEvent: (id, body) => request(`/tracking/${id}/events`, { method:'POST', body: JSON.stringify(body) }),
  revenue: (granularity='daily') => request(`/payments/summary?granularity=${granularity}`)
};
