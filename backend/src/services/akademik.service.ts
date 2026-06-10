import { pool } from "../config/db";
import type { TableQueryParams, TableRow } from "../types/table.types";
import type { PageContainer } from "../types/api.types";
import { HttpError } from "../utils/response";

/**
 * Akademik columns:
 *   0: nama_mahasiswa (text)
 *   1: dosen_pembimbing (text)
 *   2: program_studi (text)
 *   3: tanggal_mulai (datetime)
 *   4: tanggal_selesai (datetime)
 *   5: luasan (number m2)
 *   6: judul_penelitian (text)
 */

const SORTABLE_COLS: Record<number, string> = {
  0: "nama_mahasiswa",
  1: "dosen_pembimbing",
  2: "program_studi",
  3: "tanggal_mulai",
  4: "tanggal_selesai",
  5: "luasan",
  6: "judul_penelitian",
};

const TEXT_SEARCH = new Set([0, 1, 2, 6]);
const NUM_SEARCH = new Set([5]);

interface RowDb {
  akademik_id: number;
  row_uuid: string;
  nama_mahasiswa: string;
  dosen_pembimbing: string;
  program_studi: string;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  luasan: string;
  judul_penelitian: string;
  created_at: Date;
  updated_at: Date | null;
}

const toIso = (d: Date | null): string | null => (d ? d.toISOString() : null);

const toTableRow = (r: RowDb): TableRow => ({
  rowId: r.row_uuid,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
  colValues: [
    { colIdx: 0, value: r.nama_mahasiswa },
    { colIdx: 1, value: r.dosen_pembimbing },
    { colIdx: 2, value: r.program_studi },
    { colIdx: 3, value: toIso(r.tanggal_mulai) },
    { colIdx: 4, value: toIso(r.tanggal_selesai) },
    { colIdx: 5, value: Number(r.luasan) },
    { colIdx: 6, value: r.judul_penelitian },
  ],
});

interface PublicRow {
  no: number;
  nama: string;
  dosenPembimbing: string;
  programStudi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  luasan: number;
  judulPenelitian: string;
}

const toPublicRow = (r: RowDb, no: number): PublicRow => ({
  no,
  nama: r.nama_mahasiswa,
  dosenPembimbing: r.dosen_pembimbing,
  programStudi: r.program_studi,
  tanggalMulai: r.tanggal_mulai.toISOString(),
  tanggalSelesai: r.tanggal_selesai.toISOString(),
  luasan: Number(r.luasan),
  judulPenelitian: r.judul_penelitian,
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
    `SELECT * FROM akademik ${clause} ${order}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    dataParams
  );

  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM akademik ${clause}`,
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
    where = `WHERE nama_mahasiswa ILIKE $${params.length}
             OR dosen_pembimbing ILIKE $${params.length}
             OR program_studi ILIKE $${params.length}
             OR judul_penelitian ILIKE $${params.length}`;
  }
  params.push(opts.limit, opts.offset);
  const rows = await pool.query<RowDb>(
    `SELECT * FROM akademik ${where}
     ORDER BY akademik_id ASC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM akademik ${where}`,
    opts.search ? [params[0]] : []
  );
  const total = parseInt(countRes.rows[0].c, 10);

  return {
    offset: opts.offset,
    limit: opts.limit,
    hasNext: opts.offset + rows.rowCount! < total,
    items: rows.rows.map((r, i) => toPublicRow(r, opts.offset + i + 1)),
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
    if (!nama) throw new HttpError(400, "Nama mahasiswa wajib diisi");
    const result = await pool.query<{ row_uuid: string }>(
      `INSERT INTO akademik
        (nama_mahasiswa, dosen_pembimbing, program_studi,
         tanggal_mulai, tanggal_selesai, luasan, judul_penelitian, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING row_uuid`,
      [
        nama,
        String(m.get(1) ?? ""),
        String(m.get(2) ?? ""),
        m.get(3),
        m.get(4),
        Number(m.get(5) ?? 0),
        String(m.get(6) ?? ""),
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
      await pool.query(`DELETE FROM akademik WHERE row_uuid = $1`, [row.rowId]);
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
      `UPDATE akademik SET ${sets.join(", ")} WHERE row_uuid = $${params.length}`,
      params
    );
    if (res.rowCount === 0) {
      throw new HttpError(404, `Row ${row.rowId} tidak ditemukan`);
    }
  }
};
