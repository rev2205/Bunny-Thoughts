import { useParams } from 'react-router-dom';
import { parseArchiveSlug } from './ArchivePage';
import ArchivePage from './ArchivePage';
import ThoughtPage from './ThoughtPage';
import NotFoundPage from './NotFoundPage';

/**
 * SlugRouter — the catch-all route handler for /:slug.
 *
 * It distinguishes between two URL patterns:
 *
 *   Archive  →  /august-2025/
 *              Regex: /^month-year$/  (two parts)
 *
 *   Thought  →  /august-28-2025/
 *              Regex: /^month-day-year(-N)?$/  (three+ parts)
 *
 * Because React Router doesn't allow two routes to both match /:slug,
 * this component acts as a runtime dispatcher.
 */

const THOUGHT_SLUG_RE =
  /^(january|february|march|april|may|june|july|august|september|october|november|december)-\d+-\d{4}(-\d+)?$/;

export default function SlugRouter() {
  const { slug } = useParams();

  // Thought slugs: month-day-year or month-day-year-N (collision suffix)
  if (THOUGHT_SLUG_RE.test(slug)) {
    return <ThoughtPage />;
  }

  // Archive slugs: month-year
  if (parseArchiveSlug(slug)) {
    return <ArchivePage />;
  }

  // Unknown slug format
  return <NotFoundPage />;
}
