import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getThoughtsByMonth } from '../api/thoughts';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const MONTH_MAP = {
  january: 1, february: 2, march: 3, april: 4,
  may: 5, june: 6, july: 7, august: 8,
  september: 9, october: 10, november: 11, december: 12,
};

const MONTH_DISPLAY = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April',
  5: 'May', 6: 'June', 7: 'July', 8: 'August',
  9: 'September', 10: 'October', 11: 'November', 12: 'December',
};

export function parseArchiveSlug(slug) {
  const match = slug.match(
    /^(january|february|march|april|may|june|july|august|september|october|november|december)-(\d{4})$/
  );
  if (!match) return null;
  const monthNum = MONTH_MAP[match[1]];
  const year = parseInt(match[2], 10);
  const label = `${MONTH_DISPLAY[monthNum]}, ${year}`;
  return { monthNum, year, label };
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function makeShortExcerpt(content, maxLen = 80) {
  const plain = content.replace(/\n+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s\S*$/, '') + '...';
}

export default function ArchivePage() {
  const { slug } = useParams();
  const parsed = parseArchiveSlug(slug);

  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!parsed) {
      setError('Invalid archive URL.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getThoughtsByMonth(parsed.year, parsed.monthNum)
      .then(setThoughts)
      .catch(() => setError('Could not load this month\'s thoughts.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (parsed) document.title = `${parsed.label} | Bunny Thoughts`;
    return () => { document.title = 'Bunny Thoughts'; };
  }, [parsed]);

  return (
    <Layout>
      <h2 className="archive-header">
        {parsed ? parsed.label : 'Archive'}
      </h2>

      {loading && <LoadingSpinner />}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        thoughts.length === 0 ? (
          <div className="empty-state">No thoughts for this month.</div>
        ) : (
          <div className="archive-grid">
            {thoughts.map((t) => (
              <article key={t.id} className="archive-card">
                <Link to={`/${t.slug}`} className="archive-card-date">
                  {formatDate(t.published_at)}
                </Link>
                <p className="archive-card-excerpt">
                  {makeShortExcerpt(t.content)}
                </p>
              </article>
            ))}
          </div>
        )
      )}
    </Layout>
  );
}
