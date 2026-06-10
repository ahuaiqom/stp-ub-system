import { pool } from "../config/db";
import type { TableQueryParams, TableRow } from "../types/table.types";
import type { PageContainer } from "../types/api.types";
import { HttpError } from "../utils/response";

/**
 * Peternakan columns:
 *   0: komoditas (text)
 *   1: luas_usaha (number m2)
 *   2: siklus_bulan (number)         -> "Ketersediaan (Satuan Bulan)"
 *   3: siklus_per_tahun (number)     -> "Ketersediaan (Per-Tahun (kali))"
 *   4: jumlah (number)
 *   5: satuan (text)
 *   6: keterangan (text)
 */

const SORTABLE_COLS: Record<number, string> = {
  0: "komoditas",
  1: "luas_usaha",
  2: "siklus_bulan",
  3: "siklus_per_tahun",
  4: "jumlah",
  5: "satuan",
  6: "keterangan",
};

const TEXT_SEARCH = new Set([0, 5, 6]);
const NUM_SEARCH = new Set([1, 2, 3, 4]);

interface RowDb {
  peternakan_id: number;
  row_uuid: string;
  komoditas: string;
  siklus_bulan: number;
  siklus_per_tahun: number;
  satuan: string;
  keterangan: string | null;
  luas_usaha: string;
  jumlah: number;
  created_at: Date;
  updated_at: Date | null;
}

const toTableRow = (r: RowDb): TableRow => ({
  rowId: r.row_uuid,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
  colValues: [
    { colIdx: 0, value: r.komoditas },
    { colIdx: 1, value: Number(r.luas_usaha) },
    { colIdx: 2, value: r.siklus_bulan },
    { colIdx: 3, value: r.siklus_per_tahun },
    { colIdx: 4, value: r.jumlah },
    { colIdx: 5, value: r.satuan },
    { colIdx: 6, value: r.keterangan ?? "" },
  ],
});

interface PublicRow {
  komoditas: string;
  luasUsaha: number;
  siklusBulan: number;
  siklusPerTahun: number;
  jumlah: number;
  satuan: string;
  keterangan: string;
}

const toPublicRow = (r: RowDb): PublicRow => ({
  komoditas: r.komoditas,
  luasUsaha: Number(r.luas_usaha),
  siklusBulan: r.siklus_bulan,
  siklusPerTahun: r.siklus_per_tahun,
  jumlah: r.jumlah,
  satuan: r.satuan,
  keterangan: r.keterangan ?? "",
});

const buildWhere = (search: string, searchCols: number[]) => {
  if (!search) return { clause: "", params: [] as unknown[] };
  const cols = searchCols.length > 0
    ? searchCols
    : [...TEXT_SEARCH, ...NUM_SEARCH];
  const conds: string[] = [];
  const params: unknown[] = [];
  for (const c of cols) {
    if (TEXT_SEARCH.has(c)) {
      params.push(`%${search}%`);
      conds.push(`${SORTABLE_COLS[c]} ILIKE $${params.length}`);
    } else if (NUM_SEARCH.has(c)) {
      const n = Number(search);
      if (Number.isFinite(n)) {
        params.push(n);
        conds.push(`${SORTABLE_COLS[c]}::text = $${params.length}::text`);
      }
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
    `SELECT * FROM peternakan ${clause} ${order}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    dataParams
  );

  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM peternakan ${clause}`,
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

export interface PublicListOpts {
  offset: number;
  limit: number;
  search?: string;
}

export const listPublic = async (
  opts: PublicListOpts
): Promise<PageContainer<PublicRow>> => {
  const params: unknown[] = [];
  let where = "";
  if (opts.search) {
    params.push(`%${opts.search}%`);
    where = `WHERE komoditas ILIKE $${params.length}
             OR satuan ILIKE $${params.length}
             OR COALESCE(keterangan, '') ILIKE $${params.length}`;
  }
  params.push(opts.limit, opts.offset);
  const rows = await pool.query<RowDb>(
    `SELECT * FROM peternakan ${where}
     ORDER BY peternakan_id ASC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM peternakan ${where}`,
    opts.search ? [params[0]] : []
  );
  const total = parseInt(countRes.rows[0].c, 10);

  return {
    offset: opts.offset,
    limit: opts.limit,
    hasNext: opts.offset + rows.rowCount! < total,
    items: rows.rows.map(toPublicRow),
  };
};

export const insert = async (
  rows: Array<{ colValues: { colIdx: number; value: unknown }[] }>,
  userId: number | null
): Promise<string[]> => {
  const ids: string[] = [];
  for (const row of rows) {
    const map = new Map<number, unknown>();
    for (const cv of row.colValues) map.set(cv.colIdx, cv.value);
    const komoditas = String(map.get(0) ?? "").trim();
    if (!komoditas) throw new HttpError(400, "Kolom komoditas wajib diisi");
    const result = await pool.query<{ row_uuid: string }>(
      `INSERT INTO peternakan
        (komoditas, luas_usaha, siklus_bulan, siklus_per_tahun, jumlah,
         satuan, keterangan, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING row_uuid`,
      [
        komoditas,
        Number(map.get(1) ?? 0),
        Number(map.get(2) ?? 0),
        Number(map.get(3) ?? 0),
        Number(map.get(4) ?? 0),
        String(map.get(5) ?? "Ekor"),
        map.get(6) === null ? null : String(map.get(6) ?? "") || null,
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
      await pool.query(`DELETE FROM peternakan WHERE row_uuid = $1`, [row.rowId]);
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
      `UPDATE peternakan SET ${sets.join(", ")} WHERE row_uuid = $${params.length}`,
      params
    );
    if (res.rowCount === 0) {
      throw new HttpError(404, `Row ${row.rowId} tidak ditemukan`);
    }
  }
};
