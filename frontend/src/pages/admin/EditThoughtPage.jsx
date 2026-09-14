import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getThoughtById, updateThought } from '../../api/thoughts';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function EditThoughtPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', published_at: '' });
  const [original, setOriginal] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    getThoughtById(id)
      .then((t) => {
        setOriginal(t);
        // Format published_at for datetime-local input: "YYYY-MM-DDThh:mm"
        const dt = new Date(t.published_at);
        const local = dt.toISOString().slice(0, 16);
        setForm({ title: t.title || '', content: t.content, published_at: local });
      })
      .catch(() => setLoadError('Thought not found or could not be loaded.'));
  }, [id]);

  function validate() {
    const errs = {};
    if (!form.content.trim()) errs.content = 'Content is required.';
    if (!form.published_at) errs.published_at = 'Publication date is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError(null);
    try {
      const payload = {
        title: form.title.trim() || null,
        content: form.content.trim(),
        published_at: new Date(form.published_at).toISOString(),
      };
      const updated = await updateThought(id, payload);
      navigate('/admin', { state: { success: `Thought updated: /${updated.slug}` } });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update thought.';
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  if (loadError) {
    return (
      <div className="admin-wrapper">
        <div className="alert alert-error">{loadError}</div>
        <Link to="/admin" className="btn btn-secondary">← Back to Admin</Link>
      </div>
    );
  }

  if (!original) {
    return (
      <div className="admin-wrapper">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-title">Edit Thought</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href={`/${original.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
          >
            View live ↗
          </a>
          <Link to="/admin" className="btn btn-secondary btn-sm">← Back to Admin</Link>
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: '#888', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
        Current slug: <code style={{ background: '#f5f5f5', padding: '1px 6px' }}>/{original.slug}</code>
        &nbsp;(changes if you change the date)
      </p>

      {apiError && (
        <div className="alert alert-error" role="alert">{apiError}</div>
      )}

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="edit-title">
            Title <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            id="edit-title"
            name="title"
            type="text"
            className="form-input"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-published-at">
            Publication date &amp; time <span style={{ color: '#c33' }}>*</span>
          </label>
          <input
            id="edit-published-at"
            name="published_at"
            type="datetime-local"
            className="form-input"
            value={form.published_at}
            onChange={handleChange}
          />
          {errors.published_at && <p className="form-error">{errors.published_at}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-content">
            Content <span style={{ color: '#c33' }}>*</span>
          </label>
          <textarea
            id="edit-content"
            name="content"
            className="form-textarea"
            value={form.content}
            onChange={handleChange}
          />
          {errors.content && <p className="form-error">{errors.content}</p>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            id="submit-edit-thought"
            className="btn btn-success"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to="/admin" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
