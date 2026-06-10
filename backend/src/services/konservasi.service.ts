import { pool } from "../config/db";
import type { TableQueryParams, TableRow } from "../types/table.types";
import type { PageContainer } from "../types/api.types";
import { HttpError } from "../utils/response";

/**
 * Konservasi Hewan columns:
 *   0: jenis_satwa (text)
 *   1: foto (resource - image URI)
 *   2: jumlah (number)
 *   3: satuan (text)
 *   4: keterangan (text)
 */

const SORTABLE_COLS: Record<number, string> = {
  0: "jenis_satwa",
  1: "foto",
  2: "jumlah",
  3: "satuan",
  4: "keterangan",
};

const TEXT_SEARCH = new Set([0, 3, 4]);
const NUM_SEARCH = new Set([2]);

interface RowDb {
  konservasi_id: number;
  row_uuid: string;
  jenis_satwa: string;
  jumlah: number;
  satuan: string;
  foto: string | null;
  keterangan: string | null;
  created_at: Date;
  updated_at: Date | null;
}

const toTableRow = (r: RowDb): TableRow => ({
  rowId: r.row_uuid,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
  colValues: [
    { colIdx: 0, value: r.jenis_satwa },
    { colIdx: 1, value: r.foto ?? "" },
    { colIdx: 2, value: r.jumlah },
    { colIdx: 3, value: r.satuan },
    { colIdx: 4, value: r.keterangan ?? "" },
  ],
});

interface PublicRow {
  jenisSatwa: string;
  foto: string;
  jumlah: number;
  satuan: string;
  keterangan: string;
}

const toPublicRow = (r: RowDb): PublicRow => ({
  jenisSatwa: r.jenis_satwa,
  foto: r.foto ?? "",
  jumlah: r.jumlah,
  satuan: r.satuan,
  keterangan: r.keterangan ?? "",
});

const buildWhere = (search: string, searchCols: number[]) => {
  if (!search) return { clause: "", params: [] as unknown[] };
  const cols = searchCols.length > 0 ? searchCols : [...TEXT_SEARCH, ...NUM_SEARCH];
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
    `SELECT * FROM konservasi ${clause} ${order}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    dataParams
  );
  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM konservasi ${clause}`,
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
    where = `WHERE jenis_satwa ILIKE $${params.length}
             OR satuan ILIKE $${params.length}
             OR COALESCE(keterangan, '') ILIKE $${params.length}`;
  }
  params.push(opts.limit, opts.offset);
  const rows = await pool.query<RowDb>(
    `SELECT * FROM konservasi ${where}
     ORDER BY konservasi_id ASC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM konservasi ${where}`,
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
    const m = new Map<number, unknown>();
    for (const cv of row.colValues) m.set(cv.colIdx, cv.value);
    const jenis = String(m.get(0) ?? "").trim();
    if (!jenis) throw new HttpError(400, "Jenis satwa wajib diisi");
    const result = await pool.query<{ row_uuid: string }>(
      `INSERT INTO konservasi
        (jenis_satwa, foto, jumlah, satuan, keterangan, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING row_uuid`,
      [
        jenis,
        m.get(1) ? String(m.get(1)) : null,
        Number(m.get(2) ?? 0),
        String(m.get(3) ?? "Ekor"),
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
      await pool.query(`DELETE FROM konservasi WHERE row_uuid = $1`, [row.rowId]);
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
      `UPDATE konservasi SET ${sets.join(", ")} WHERE row_uuid = $${params.length}`,
      params
    );
    if (res.rowCount === 0) {
      throw new HttpError(404, `Row ${row.rowId} tidak ditemukan`);
    }
  }
};
