import { Link } from 'react-router-dom';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function makeExcerpt(content, maxLen = 180) {
  const plain = content.replace(/\n+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s\S*$/, '') + '...';
}

export default function ThoughtCard({ thought }) {
  const { slug, content, published_at } = thought;

  return (
    <article className="thought-card">
      <Link to={`/${slug}`} className="thought-date">
        {formatDate(published_at)}
      </Link>
      <p className="thought-excerpt">{makeExcerpt(content)}</p>
      <Link to={`/${slug}`} className="read-more">
        Read more
      </Link>
    </article>
  );
}
