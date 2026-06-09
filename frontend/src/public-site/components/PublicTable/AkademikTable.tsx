import "./PublicTable.css";
import { fetchAkademik, type AkademikRow } from "../../../services/public.api";
import { usePagedData } from "../../../hooks/usePagedData";
import { formatMonth, formatLuas, padRows } from "./formatters";
import PaginationBar from "./PaginationBar";

const MIN_ROWS = 5;

const AkademikTable = () => {
  const { items, page, hasNext, loading, error, next, prev } = usePagedData<AkademikRow>(
    fetchAkademik
  );

  const padded = padRows(items, MIN_ROWS);

  return (
    <section className="public-table-section">
      <div className="public-table-container">
        <h2 className="public-table-title">Tabel Pelayanan Riset</h2>

        <div className="public-table-wrapper">
          <table className="public-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Dosen Pembimbing</th>
                <th>Program Studi</th>
                <th>Mulai</th>
                <th>Selesai</th>
                <th>Luasan</th>
                <th>Judul Penelitian</th>
              </tr>
            </thead>

            <tbody>
              {error && (
                <tr><td colSpan={8} className="public-table-state error">{error}</td></tr>
              )}
              {!error && loading && items.length === 0 && (
                <tr><td colSpan={8} className="public-table-state">Memuat data…</td></tr>
              )}
              {!error && !loading && padded.map((row, idx) =>
                row ? (
                  <tr key={`r-${idx}`}>
                    <td className="center">{row.no}</td>
                    <td>{row.nama}</td>
                    <td>{row.dosenPembimbing}</td>
                    <td>{row.programStudi}</td>
                    <td className="center">{formatMonth(row.tanggalMulai)}</td>
                    <td className="center">{formatMonth(row.tanggalSelesai)}</td>
                    <td className="center">{formatLuas(row.luasan)}</td>
                    <td>{row.judulPenelitian}</td>
                  </tr>
                ) : (
                  <tr key={`e-${idx}`} className="is-empty">
                    <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
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

export default AkademikTable;
