import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getThoughtBySlug } from '../api/thoughts';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function renderContent(content) {
  return content
    .split(/\n\n+/)
    .map((para, i) => <p key={i}>{para.replace(/\n/g, ' ')}</p>);
}

export default function ThoughtPage() {
  const { slug } = useParams();
  const [thought, setThought] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getThoughtBySlug(slug)
      .then(setThought)
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('This thought was not found.');
        } else {
          setError('Could not load this thought. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (thought) {
      document.title = `${formatDate(thought.published_at)} | Bunny Thoughts`;
    }
    return () => {
      document.title = 'Bunny Thoughts';
    };
  }, [thought]);

  return (
    <Layout>
      {loading && <LoadingSpinner />}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
          <br />
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      )}

      {!loading && !error && thought && (
        <article className="single-thought">
          <h2 className="single-thought-title">{formatDate(thought.published_at)}</h2>
          <div className="single-thought-content">
            {renderContent(thought.content)}
          </div>
        </article>
      )}
    </Layout>
  );
}
