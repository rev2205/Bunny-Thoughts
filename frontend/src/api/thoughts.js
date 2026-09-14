/**
 * Axios instance + all API helper functions.
 *
 * Because Vite proxies /api/* to http://localhost:8000, we use a relative
 * baseURL — no hardcoded port in the frontend code.
 */

import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// ── Thoughts ────────────────────────────────────────────────────────────────

/** Returns { thoughts, total, page, limit, total_pages } */
export const getThoughts = (page = 1, limit = 4) =>
  api.get(`/thoughts?page=${page}&limit=${limit}`).then((r) => r.data);

export const getThoughtById = (id) =>
  api.get(`/thoughts/${id}`).then((r) => r.data);

export const getThoughtBySlug = (slug) =>
  api.get(`/thoughts/slug/${slug}`).then((r) => r.data);

/**
 * @param {{ title?: string, content: string, published_at: string }} data
 */
export const createThought = (data) =>
  api.post('/thoughts', data).then((r) => r.data);

export const updateThought = (id, data) =>
  api.put(`/thoughts/${id}`, data).then((r) => r.data);

export const deleteThought = (id) => api.delete(`/thoughts/${id}`);

// ── Archive ─────────────────────────────────────────────────────────────────

/** Returns [{ year, month, month_name, count, slug }, …] newest first */
export const getArchive = () => api.get('/archive').then((r) => r.data);

/** Returns [ thought, … ] for the given year and month number */
export const getThoughtsByMonth = (year, month) =>
  api.get(`/archive/${year}/${month}`).then((r) => r.data);

// ── Health ───────────────────────────────────────────────────────────────────

export const healthCheck = () => api.get('/health').then((r) => r.data);
