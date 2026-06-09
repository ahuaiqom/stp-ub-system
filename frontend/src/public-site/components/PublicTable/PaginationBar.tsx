interface Props {
  page: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationBar = ({ page, hasNext, onPrev, onNext }: Props) => (
  <div className="public-table-pagination">
    <button
      type="button"
      className="public-table-arrow"
      onClick={onPrev}
      disabled={page <= 1}
      aria-label="Halaman sebelumnya"
    >
      &#8249;
    </button>
    <button type="button" className="public-table-page" disabled>
      {page}
    </button>
    <button
      type="button"
      className="public-table-arrow"
      onClick={onNext}
      disabled={!hasNext}
      aria-label="Halaman berikutnya"
    >
      &#8250;
    </button>
  </div>
);

export default PaginationBar;
