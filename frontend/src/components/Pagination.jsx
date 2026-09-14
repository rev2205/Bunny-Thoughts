export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  function buildPages() {
    const pages = [];
    const delta = 1;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push(null);
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push(null);
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  const pages = buildPages();

  return (
    <nav className="pagination" aria-label="Pagination">
      {pages.map((page, idx) => {
        if (page === null) {
          return (
            <span key={`ellipsis-${idx}`} className="page-btn disabled">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => !isActive && onPageChange(page)}
            className={`page-btn${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        );
      })}

      {currentPage < totalPages && (
        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      )}
    </nav>
  );
}
