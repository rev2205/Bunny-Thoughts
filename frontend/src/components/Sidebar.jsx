import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArchive } from '../api/thoughts';

export default function Sidebar() {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArchive()
      .then(setMonths)
      .catch(() => setMonths([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <aside className="sidebar" aria-label="Categories sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Categories</h3>
        {loading ? (
          <p style={{ fontSize: '12px', color: '#999' }}>Loading…</p>
        ) : months.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#999' }}>No categories yet.</p>
        ) : (
          <ul className="category-list">
            {months.map((m) => (
              <li key={m.slug} className="category-item">
                <Link to={`/${m.slug}`} className="category-link">
                  <span className="prefix">&gt;</span>
                  {m.month_name}, {m.year}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
