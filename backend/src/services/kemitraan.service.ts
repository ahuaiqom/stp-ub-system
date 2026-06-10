import { pool } from "../config/db";
import type { TableQueryParams, TableRow } from "../types/table.types";
import { HttpError } from "../utils/response";

/**
 * Kemitraan columns:
 *   0: nama_mitra (text)
 *   1: bidang_kerjasama (text)
 *   2: tanggal_mulai (datetime)
 *   3: tanggal_selesai (datetime)
 *   4: keterangan (text)
 */

const SORTABLE_COLS: Record<number, string> = {
  0: "nama_mitra",
  1: "bidang_kerjasama",
  2: "tanggal_mulai",
  3: "tanggal_selesai",
  4: "keterangan",
};

const TEXT_SEARCH = new Set([0, 1, 4]);

interface RowDb {
  kemitraan_id: number;
  row_uuid: string;
  nama_mitra: string;
  bidang_kerjasama: string;
  tanggal_mulai: Date | null;
  tanggal_selesai: Date | null;
  keterangan: string | null;
  created_at: Date;
  updated_at: Date | null;
}

const toIso = (d: Date | null): string | null => (d ? d.toISOString() : null);

const toTableRow = (r: RowDb): TableRow => ({
  rowId: r.row_uuid,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
  colValues: [
    { colIdx: 0, value: r.nama_mitra },
    { colIdx: 1, value: r.bidang_kerjasama },
    { colIdx: 2, value: toIso(r.tanggal_mulai) },
    { colIdx: 3, value: toIso(r.tanggal_selesai) },
    { colIdx: 4, value: r.keterangan ?? "" },
  ],
});

const buildWhere = (search: string, searchCols: number[]) => {
  if (!search) return { clause: "", params: [] as unknown[] };
  const cols = searchCols.length > 0 ? searchCols : [...TEXT_SEARCH];
  const conds: string[] = [];
  const params: unknown[] = [];
  for (const c of cols) {
    if (TEXT_SEARCH.has(c)) {
      params.push(`%${search}%`);
      conds.push(`${SORTABLE_COLS[c]} ILIKE $${params.length}`);
    }
  }
  if (conds.length === 0) return { clause: "", params: [] };
  return { clause: `WHERE ${conds.join(" OR ")}`, params };
};

const buildOrder = (sortCol: number, sortOrder: "asc" | "desc") => {
  const dir = sortOrder.toUpperCase();
  if (sortCol === -1) return `ORDER BY created_at ${dir}`;
  const col = SORTABLE_COLS[sortCol];
  return col ? `ORDER BY ${col} ${dir}` : `ORDER BY created_at ${dir}`;
};

export const list = async (q: TableQueryParams) => {
  const { clause, params } = buildWhere(q.search, q.searchCols);
  const order = buildOrder(q.sortCol, q.sortOrder);
  const dataParams = [...params, q.limit, q.offset];
  const rows = await pool.query<RowDb>(
    `SELECT * FROM kemitraan ${clause} ${order}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    dataParams
  );
  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM kemitraan ${clause}`,
    params
  );
  const total = parseInt(countRes.rows[0].c, 10);
  return {
    typeName: "table" as const,
    offset: q.offset,
    limit: q.limit,
    hasNext: q.offset + rows.rowCount! < total,
    items: rows.rows.map(toTableRow),
  };
};

export const insert = async (
  rows: Array<{ colValues: { colIdx: number; value: unknown }[] }>,
  userId: number | null
): Promise<string[]> => {
  const ids: string[] = [];
  for (const row of rows) {
    const m = new Map<number, unknown>();
    for (const cv of row.colValues) m.set(cv.colIdx, cv.value);
    const nama = String(m.get(0) ?? "").trim();
    if (!nama) throw new HttpError(400, "Nama mitra wajib diisi");
    const result = await pool.query<{ row_uuid: string }>(
      `INSERT INTO kemitraan
        (nama_mitra, bidang_kerjasama, jangka_waktu_kontrak,
         tanggal_mulai, tanggal_selesai, keterangan, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING row_uuid`,
      [
        nama,
        String(m.get(1) ?? ""),
        "-",            // legacy column kept for backward compatibility
        m.get(2) ?? null,
        m.get(3) ?? null,
        m.get(4) === null ? null : String(m.get(4) ?? "") || null,
        userId,
      ]
    );
    ids.push(result.rows[0].row_uuid);
  }
  return ids;
};

const COL_TO_DB: Record<number, string> = SORTABLE_COLS;

export const patch = async (
  rows: Array<{ rowId: string; colValues: { colIdx: number; value: unknown }[] | null }>,
  userId: number | null
): Promise<void> => {
  for (const row of rows) {
    if (row.colValues === null) {
      await pool.query(`DELETE FROM kemitraan WHERE row_uuid = $1`, [row.rowId]);
      continue;
    }
    const sets: string[] = [];
    const params: unknown[] = [];
    for (const cv of row.colValues) {
      const col = COL_TO_DB[cv.colIdx];
      if (!col) continue;
      params.push(cv.value);
      sets.push(`${col} = $${params.length}`);
    }
    if (sets.length === 0) continue;
    sets.push(`updated_at = NOW()`);
    if (userId !== null) {
      params.push(userId);
      sets.push(`updated_by = $${params.length}`);
    }
    params.push(row.rowId);
    const res = await pool.query(
      `UPDATE kemitraan SET ${sets.join(", ")} WHERE row_uuid = $${params.length}`,
      params
    );
    if (res.rowCount === 0) {
      throw new HttpError(404, `Row ${row.rowId} tidak ditemukan`);
    }
  }
};

// ----------------------------------------------------------------
// Public stats
// ----------------------------------------------------------------

export interface ActiveStats {
  /** Jumlah mitra unik yang masih aktif (tanggal_selesai >= today) */
  totalMitra: number;
  /** Jumlah baris kontrak yang masih aktif */
  totalKolaborasi: number;
  /** Daftar nama mitra aktif (untuk ditampilkan jadi logo strip) */
  activeMitra: Array<{ nama: string; bidang: string; tanggalSelesai: string | null }>;
}

/**
 * Hitung statistik kemitraan yang masih berlaku.
 *
 * Aturan:
 * - Sebuah baris dianggap aktif kalau:
 *     * tanggal_selesai >= today (UTC), ATAU
 *     * tanggal_selesai IS NULL (kontrak open-ended)
 * - "totalMitra" = COUNT(DISTINCT nama_mitra) yang aktif
 * - "totalKolaborasi" = COUNT(*) baris yang aktif
 */
export const getActiveStats = async (): Promise<ActiveStats> => {
  const res = await pool.query<{
    nama_mitra: string;
    bidang_kerjasama: string;
    tanggal_selesai: Date | null;
  }>(
    `SELECT nama_mitra, bidang_kerjasama, tanggal_selesai
     FROM kemitraan
     WHERE tanggal_selesai IS NULL
        OR tanggal_selesai >= CURRENT_DATE
     ORDER BY nama_mitra ASC`
  );

  const seen = new Set<string>();
  const activeMitra: ActiveStats["activeMitra"] = [];
  for (const r of res.rows) {
    if (!seen.has(r.nama_mitra)) {
      seen.add(r.nama_mitra);
      activeMitra.push({
        nama: r.nama_mitra,
        bidang: r.bidang_kerjasama,
        tanggalSelesai: r.tanggal_selesai
          ? r.tanggal_selesai.toISOString()
          : null,
      });
    }
  }

  return {
    totalMitra: seen.size,
    totalKolaborasi: res.rowCount ?? 0,
    activeMitra,
  };
};
