import "./PublicTable.css";
import { fetchPeternakan, type PeternakanRow } from "../../../services/public.api";
import { usePagedData } from "../../../hooks/usePagedData";
import { formatSiklus, padRows } from "./formatters";
import PaginationBar from "./PaginationBar";

const MIN_ROWS = 5;

const PeternakanTable = () => {
  const { items, page, hasNext, loading, error, next, prev } = usePagedData<PeternakanRow>(
    fetchPeternakan
  );

  const padded = padRows(items, MIN_ROWS);

  return (
    <section className="public-table-section">
      <div className="public-table-container">
        <h2 className="public-table-title">Tabel Livestock</h2>

        <div className="public-table-wrapper">
          <table className="public-table">
            <thead>
              <tr>
                <th>Komoditas</th>
                <th>Luas Usaha (m2)</th>
                <th>Siklus / Ketersediaan</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {error && (
                <tr><td colSpan={6} className="public-table-state error">{error}</td></tr>
              )}
              {!error && loading && items.length === 0 && (
                <tr><td colSpan={6} className="public-table-state">Memuat data…</td></tr>
              )}
              {!error && !loading && padded.map((row, idx) =>
                row ? (
                  <tr key={`r-${idx}`}>
                    <td>{row.komoditas}</td>
                    <td className="center">{row.luasUsaha}</td>
                    <td className="center">{formatSiklus(row.siklusBulan, row.siklusPerTahun)}</td>
                    <td className="center">{row.jumlah}</td>
                    <td className="center">{row.satuan}</td>
                    <td>{row.keterangan}</td>
                  </tr>
                ) : (
                  <tr key={`e-${idx}`} className="is-empty">
                    <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <PaginationBar page={page} hasNext={hasNext} onPrev={prev} onNext={next} />
      </div>
    </section>
  );
};

export default PeternakanTable;
