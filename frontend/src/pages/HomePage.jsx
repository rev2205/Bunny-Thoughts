import { useState, useEffect } from 'react';
import { getThoughts } from '../api/thoughts';
import Layout from '../components/Layout';
import ThoughtCard from '../components/ThoughtCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const LIMIT = 4;

export default function HomePage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getThoughts(page, LIMIT)
      .then(setData)
      .catch(() => setError('Could not load thoughts. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [page]);

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <Layout>
      {/* Welcome intro box */}
      <div className="intro-box">
        Welcome to Bunny Thoughts. This is a little corner of the internet where I write
        about things I think, feel, notice, and learn. It started as a personal journal
        and gradually turned into a real blog.
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {data.thoughts.length === 0 ? (
            <div className="empty-state">
              <p>No thoughts yet. Check back soon! 🐰</p>
            </div>
          ) : (
            <>
              {data.thoughts.map((t) => (
                <ThoughtCard key={t.id} thought={t} />
              ))}
              <Pagination
                currentPage={data.page}
                totalPages={data.total_pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </Layout>
  );
}
