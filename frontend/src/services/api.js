const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core fetch wrapper that handles auth headers and JSON parsing.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('antigravite_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getProfile: () => request('/auth/profile'),
};

// ─── Habits ──────────────────────────────────────────────
export const habitsAPI = {
  getAll: () => request('/habits'),

  create: (habitData) =>
    request('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    }),

  update: (id, habitData) =>
    request(`/habits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(habitData),
    }),

  delete: (id) =>
    request(`/habits/${id}`, { method: 'DELETE' }),
};

// ─── Logs ────────────────────────────────────────────────
export const logsAPI = {
  getByDate: (date) =>
    request(`/logs?date=${date}`),

  create: (habitId, date, completed = true, durationS = null) =>
    request('/logs', {
      method: 'POST',
      body: JSON.stringify({ habitId, date, completed, durationS }),
    }),
};

// ─── Analytics ───────────────────────────────────────────
export const analyticsAPI = {
  getWeekly: () => request('/analytics/weekly'),
  getMonthly: () => request('/analytics/monthly'),
  getHeatmap: () => request('/analytics/heatmap'),
};
