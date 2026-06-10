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

const PATH = "/kemitraan/items";

const FIELDS: FormFieldDef[] = [
  { colIdx: 0, key: "nama_mitra",       label: "Nama Mitra",       type: "text", required: true, full: true },
  { colIdx: 1, key: "bidang",           label: "Bidang Kerjasama", type: "text", required: true, full: true },
  { colIdx: 2, key: "tanggal_mulai",    label: "Tanggal Mulai",    type: "date" },
  { colIdx: 3, key: "tanggal_selesai",  label: "Tanggal Selesai",  type: "date" },
  { colIdx: 4, key: "keterangan",       label: "Keterangan",       type: "textarea", full: true },
];

const ID_DAY_MONTH_YEAR = (iso: string | null | undefined): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const isoDate = (s: unknown): string => {
  if (typeof s !== "string" || !s) return "";
  return s.slice(0, 10);
};

const buildPayload = (v: FormValues) =>
  FIELDS.map((f) => {
    let value: unknown = v[f.key];
    if (f.type === "date") value = value ? new Date(String(value)).toISOString() : null;
    if (!value && f.type === "textarea") value = null;
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

const KemitraanPage = () => {
  const { token } = useAuth();
  const t = useAdminTable(PATH);

  const [editRow, setEditRow] = useState<TableRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirm, setConfirm] = useState<TableRow | null>(null);
  const [busy, setBusy] = useState(false);

  const columns: ColumnDef<TableRow>[] = [
    { key: "mitra", label: "Mitra", render: (r) => String(getCol(r, 0) ?? "") },
    { key: "bidang", label: "Bidang Kerjasama", render: (r) => String(getCol(r, 1) ?? "") },
    {
      key: "kontrak",
      label: "Jangka Waktu Kontrak",
      align: "center",
      render: (r) => `${ID_DAY_MONTH_YEAR(getCol(r, 2) as string)} – ${ID_DAY_MONTH_YEAR(getCol(r, 3) as string)}`,
    },
    { key: "keterangan", label: "Keterangan", render: (r) => String(getCol(r, 4) ?? "") },
  ];

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
        title="Dashboard Kemitraan"
        description="Kegiatan Kerjasama KST Jatikerto dengan Berbagai Mitra"
        onAdd={() => setShowAdd(true)}
      />

      <DataTable
        title="Tabel Kemitraan"
        columns={columns}
        rows={t.rows}
        loading={t.loading}
        error={t.error}
        search={t.search}
        onSearchChange={t.setSearch}
        searchPlaceholder="Cari mitra"
        page={t.page}
        hasNext={t.hasNext}
        onPrev={t.prev}
        onNext={t.next}
        onEdit={(r) => setEditRow(r)}
        onDelete={(r) => setConfirm(r)}
      />

      <RowFormModal
        open={showAdd}
        title="Tambah Kemitraan"
        fields={FIELDS}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAdd}
      />

      <RowFormModal
        open={!!editRow}
        title="Edit Kemitraan"
        fields={FIELDS}
        initialValues={editRow ? formFromRow(editRow) : undefined}
        onClose={() => setEditRow(null)}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        open={!!confirm}
        title="Hapus Data"
        message={`Hapus mitra "${confirm ? String(getCol(confirm, 0) ?? "") : ""}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        busy={busy}
      />
    </>
  );
};

export default KemitraanPage;
