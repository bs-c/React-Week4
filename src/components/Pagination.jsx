const Pagination = ({ pagination, getProducts }) => {
  const { total_pages, current_page, has_pre, has_next } = pagination;

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li
          className="page-item"
          style={{
            opacity: has_pre ? 1 : 0.5,
            pointerEvents: has_pre ? "auto" : "none",
          }}
        >
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              if (has_pre) {
                getProducts(current_page - 1);
              }
            }}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {[...Array(total_pages)].map((_, i) => (
          <li
            className={`page-item ${i + 1 === current_page ? "active" : ""}`}
            key={i}
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                getProducts(i + 1);
              }}
            >
              {i + 1}
            </a>
          </li>
        ))}
        <li
          className="page-item"
          style={{
            opacity: has_next ? 1 : 0.5,
            pointerEvents: has_next ? "auto" : "none",
          }}
        >
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (has_next) {
                getProducts(current_page + 1);
              }
            }}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
