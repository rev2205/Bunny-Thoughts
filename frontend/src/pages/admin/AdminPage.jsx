import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getThoughts, deleteThought } from '../../api/thoughts';
import LoadingSpinner from '../../components/LoadingSpinner';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  });
}

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  function loadThoughts(p = page) {
    setLoading(true);
    getThoughts(p, 20)
      .then(setData)
      .catch(() => setError('Failed to load thoughts.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadThoughts(); }, [page]);

  async function handleDelete(id, dateLabel) {
    if (!window.confirm(`Delete thought from ${dateLabel}? This cannot be undone.`)) return;
    try {
      await deleteThought(id);
      setFeedback({ type: 'success', message: 'Thought deleted.' });
      loadThoughts();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete thought.' });
    }
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-title">🐰 Admin — Bunny Thoughts</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/" className="btn btn-secondary btn-sm">← View Site</Link>
          <Link to="/admin/new" className="btn btn-primary btn-sm" id="admin-new-thought-btn">
            + New Thought
          </Link>
        </div>
      </div>

      <div className="admin-notice">
        ⚠️ Admin area — visible only to the site owner. Authentication will be added in a future release.
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`} role="alert">
          {feedback.message}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <LoadingSpinner />
      ) : data && (
        <>
          <p style={{ fontSize: '0.82rem', color: '#888', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
            {data.total} thought{data.total !== 1 ? 's' : ''} total
          </p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Published</th>
                <th>Slug</th>
                <th>Excerpt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.thoughts.map((t) => (
                <tr key={t.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(t.published_at)}</td>
                  <td className="slug-cell">/{t.slug}</td>
                  <td style={{ maxWidth: '280px' }}>
                    {t.content.slice(0, 80).replace(/\n/g, ' ')}
                    {t.content.length > 80 ? '…' : ''}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link
                        to={`/admin/edit/${t.id}`}
                        className="btn btn-primary btn-sm"
                        id={`edit-btn-${t.id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        id={`delete-btn-${t.id}`}
                        onClick={() => handleDelete(t.id, formatDate(t.published_at))}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Simple prev/next for admin table */}
          {data.total_pages > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', fontFamily: 'Inter, sans-serif', fontSize: '0.83rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span style={{ alignSelf: 'center', color: '#666' }}>
                Page {data.page} of {data.total_pages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === data.total_pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
