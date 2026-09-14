import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createThought } from '../../api/thoughts';

export default function NewThoughtPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    published_at: new Date().toISOString().slice(0, 16), // "YYYY-MM-DDThh:mm"
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

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
      const created = await createThought(payload);
      navigate('/admin', { state: { success: `Thought created: /${created.slug}` } });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create thought.';
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-title">New Thought</h1>
        <Link to="/admin" className="btn btn-secondary btn-sm">← Back to Admin</Link>
      </div>

      {apiError && (
        <div className="alert alert-error" role="alert">{apiError}</div>
      )}

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="input-title">
            Title <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            id="input-title"
            name="title"
            type="text"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            placeholder="Leave blank for a date-only post"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-published-at">
            Publication date &amp; time <span style={{ color: '#c33' }}>*</span>
          </label>
          <input
            id="input-published-at"
            name="published_at"
            type="datetime-local"
            className="form-input"
            value={form.published_at}
            onChange={handleChange}
          />
          <p className="form-hint">The URL slug is generated from this date (e.g. august-28-2025).</p>
          {errors.published_at && <p className="form-error">{errors.published_at}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-content">
            Content <span style={{ color: '#c33' }}>*</span>
          </label>
          <textarea
            id="input-content"
            name="content"
            className="form-textarea"
            value={form.content}
            onChange={handleChange}
            placeholder="What's on your mind today?"
          />
          <p className="form-hint">Separate paragraphs with a blank line.</p>
          {errors.content && <p className="form-error">{errors.content}</p>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            id="submit-new-thought"
            className="btn btn-success"
            disabled={submitting}
          >
            {submitting ? 'Publishing…' : 'Publish Thought'}
          </button>
          <Link to="/admin" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
