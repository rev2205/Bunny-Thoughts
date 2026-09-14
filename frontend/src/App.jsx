import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SlugRouter from './pages/SlugRouter';
import FaqPage from './pages/FaqPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/admin/AdminPage';
import NewThoughtPage from './pages/admin/NewThoughtPage';
import EditThoughtPage from './pages/admin/EditThoughtPage';

/**
 * App — top-level route definitions.
 *
 * PUBLIC ROUTES (read-only):
 *   /                   → HomePage
 *   /faq                → FaqPage
 *   /:slug              → SlugRouter (dispatches to ThoughtPage or ArchivePage)
 *                          - /august-28-2025   → ThoughtPage
 *                          - /august-2025      → ArchivePage
 *
 * ADMIN ROUTES (write access, no auth yet):
 *   /admin              → AdminPage
 *   /admin/new          → NewThoughtPage
 *   /admin/edit/:id     → EditThoughtPage
 *
 * IMPORTANT: /admin/new and /admin/edit/:id are registered before /:slug
 * to prevent the slug catch-all from intercepting them.
 */
export default function App() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/faq" element={<FaqPage />} />

      {/* ── Admin (must come before /:slug catch-all) ──────── */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/new" element={<NewThoughtPage />} />
      <Route path="/admin/edit/:id" element={<EditThoughtPage />} />

      {/* ── Dynamic slug catch-all ─────────────────────────── */}
      {/* Handles /august-28-2025 (thought) and /august-2025 (archive) */}
      <Route path="/:slug" element={<SlugRouter />} />

      {/* ── 404 ────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
