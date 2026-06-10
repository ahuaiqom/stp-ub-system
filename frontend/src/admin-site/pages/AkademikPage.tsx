import { useState } from "react";
import DashboardCard from "../components/DashboardCard";
import DataTable, { type ColumnDef } from "../components/DataTable";
import RowFormModal, { type FormFieldDef, type FormValues } from "../components/RowFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { useAdminTable, getCol } from "../hooks/useAdminTable";
import { useAuth } from "../context/AuthContext";
import {
  insertRow,
  updateRow,
  deleteRow,
  type TableRow,
} from "../../services/admin.api";

const PATH = "/akademik/items";

const FIELDS: FormFieldDef[] = [
  { colIdx: 0, key: "nama",             label: "Nama Mahasiswa",   type: "text", required: true, full: true },
  { colIdx: 1, key: "dosen_pembimbing", label: "Dosen Pembimbing", type: "text" },
  { colIdx: 2, key: "program_studi",    label: "Program Studi",    type: "text" },
  { colIdx: 3, key: "tanggal_mulai",    label: "Tanggal Mulai",    type: "date" },
  { colIdx: 4, key: "tanggal_selesai",  label: "Tanggal Selesai",  type: "date" },
  { colIdx: 5, key: "luasan",           label: "Luasan (m2)",      type: "number" },
  { colIdx: 6, key: "judul",            label: "Judul Penelitian", type: "textarea", full: true },
];

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const formatMonth = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : MONTHS[d.getMonth()];
};

const isoDate = (s: unknown): string => {
  if (typeof s !== "string" || !s) return "";
  return s.slice(0, 10);
};

const buildPayload = (v: FormValues) =>
  FIELDS.map((f) => {
    let value: unknown = v[f.key];
    if (f.type === "number") value = Number(value) || 0;
    if (f.type === "date") {
      value = value ? new Date(String(value)).toISOString() : null;
    }
    if (!value && f.type === "textarea") value = "";
    return { colIdx: f.colIdx, value };
  });

const formFromRow = (row: TableRow): FormValues => {
  const out: FormValues = {};
  for (const f of FIELDS) {
    const v = getCol(row, f.colIdx);
    if (f.type === "date") out[f.key] = isoDate(v);
    else out[f.key] = (v as string | number | null) ?? "";
  }
  return out;
};

const AkademikPage = () => {
  const { token } = useAuth();
  const t = useAdminTable(PATH);

  const [editRow, setEditRow] = useState<TableRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirm, setConfirm] = useState<TableRow | null>(null);
  const [busy, setBusy] = useState(false);

  const columns: ColumnDef<TableRow>[] = [
    { key: "no", label: "No.", align: "center", render: (_, ) => "" /* renders below */ },
    { key: "nama", label: "Nama", render: (r) => String(getCol(r, 0) ?? "") },
    { key: "dosen", label: "Dosen Pembimbing", render: (r) => String(getCol(r, 1) ?? "") },
    { key: "prodi", label: "Program Studi", render: (r) => String(getCol(r, 2) ?? "") },
    { key: "mulai", label: "Mulai", align: "center", render: (r) => formatMonth(getCol(r, 3) as string) },
    { key: "selesai", label: "Selesai", align: "center", render: (r) => formatMonth(getCol(r, 4) as string) },
    { key: "luasan", label: "Luasan", align: "center", render: (r) => `${getCol(r, 5) ?? 0} m2` },
    { key: "judul", label: "Judul Penelitian", render: (r) => String(getCol(r, 6) ?? "") },
  ];

  // Override "No." column with row index
  columns[0].render = (_r) => {
    const idx = t.rows.indexOf(_r);
    return String((t.page - 1) * t.pageSize + idx + 1);
  };

  const handleAdd = async (v: FormValues) => {
    if (!token) return;
    await insertRow(PATH, buildPayload(v), token);
    t.reload();
  };

  const handleEdit = async (v: FormValues) => {
    if (!token || !editRow) return;
    await updateRow(PATH, editRow.rowId, buildPayload(v), token);
    t.reload();
  };

  const handleDelete = async () => {
    if (!token || !confirm) return;
    setBusy(true);
    try {
      await deleteRow(PATH, confirm.rowId, token);
      setConfirm(null);
      t.reload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DashboardCard
        title="Dashboard Pelayanan Akademik"
        description="Kegiatan Riset Mahasiswa Universitas Brawijaya di KST Jatikerto"
        onAdd={() => setShowAdd(true)}
      />

      <DataTable
        title="Tabel Riset"
        columns={columns}
        rows={t.rows}
        loading={t.loading}
        error={t.error}
        search={t.search}
        onSearchChange={t.setSearch}
        searchPlaceholder="Cari"
        page={t.page}
        hasNext={t.hasNext}
        onPrev={t.prev}
        onNext={t.next}
        onEdit={(r) => setEditRow(r)}
        onDelete={(r) => setConfirm(r)}
      />

      <RowFormModal
        open={showAdd}
        title="Tambah Riset"
        fields={FIELDS}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAdd}
      />

      <RowFormModal
        open={!!editRow}
        title="Edit Riset"
        fields={FIELDS}
        initialValues={editRow ? formFromRow(editRow) : undefined}
        onClose={() => setEditRow(null)}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        open={!!confirm}
        title="Hapus Data"
        message={`Hapus data "${confirm ? String(getCol(confirm, 0) ?? "") : ""}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        busy={busy}
      />
    </>
  );
};

export default AkademikPage;
