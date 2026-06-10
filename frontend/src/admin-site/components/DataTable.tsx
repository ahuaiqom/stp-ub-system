import type { ReactNode } from "react";
import "./DataTable.css";

export interface ColumnDef<T> {
  key: string;
  label: string;
  align?: "left" | "center";
  /** Renderer for the cell. If undefined, value is shown as text. */
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  title: string;
  columns: ColumnDef<T>[];
  rows: T[];
  /** Minimum visible rows — empty placeholders padded if fewer. */
  minRows?: number;

  loading?: boolean;
  error?: string | null;

  search: string;
  onSearchChange: (s: string) => void;
  searchPlaceholder?: string;

  page: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;

  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

function DataTable<T>({
  title,
  columns,
  rows,
  minRows = 5,
  loading,
  error,
  search,
  onSearchChange,
  searchPlaceholder = "Cari…",
  page,
  hasNext,
  onPrev,
  onNext,
  onEdit,
  onDelete,
}: Props<T>) {
  const showActions = !!(onEdit || onDelete);
  const totalCols = columns.length + (showActions ? 1 : 0);

  const padCount = Math.max(0, minRows - rows.length);

  return (
    <div className="admin-table-block">
      <h3 className="admin-table-block-title">{title}</h3>

      <div className="admin-search">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="button" className="admin-search-btn" aria-label="Cari">
          🔍
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.align === "center" ? "center" : ""}>
                  {c.label}
                </th>
              ))}
              {showActions && <th className="center">Aksi</th>}
            </tr>
          </thead>

          <tbody>
            {error && (
              <tr><td colSpan={totalCols} className="admin-table-state error">{error}</td></tr>
            )}

            {!error && loading && rows.length === 0 && (
              <tr><td colSpan={totalCols} className="admin-table-state">Memuat data…</td></tr>
            )}

            {!error && !loading && rows.map((row, ri) => (
              <tr key={`r-${ri}`}>
                {columns.map((c) => (
                  <td key={c.key} className={c.align === "center" ? "center" : ""}>
                    {c.render
                      ? c.render(row)
                      : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
                {showActions && (
                  <td className="center">
                    <span className="admin-row-actions">
                      {onEdit && (
                        <button type="button" className="edit" onClick={() => onEdit(row)}>
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button type="button" className="delete" onClick={() => onDelete(row)}>
                          Hapus
                        </button>
                      )}
                    </span>
                  </td>
                )}
              </tr>
            ))}

            {!error && !loading && Array.from({ length: padCount }).map((_, i) => (
              <tr key={`e-${i}`} className="empty">
                {Array.from({ length: totalCols }).map((__, j) => (
                  <td key={j}>&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        <div className="admin-pagination">
          <button
            type="button"
            className="arrow"
            onClick={onPrev}
            disabled={page <= 1}
            aria-label="Halaman sebelumnya"
          >
            &#8249;
          </button>
          <button type="button" className="num" disabled>
            {page}
          </button>
          <button
            type="button"
            className="arrow"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Halaman berikutnya"
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
