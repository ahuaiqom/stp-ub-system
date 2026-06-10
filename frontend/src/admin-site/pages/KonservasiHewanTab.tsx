import { useEffect, useState } from "react";
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

const PATH = "/konservasi/hewan";

const FIELDS: FormFieldDef[] = [
  { colIdx: 0, key: "jenis_satwa", label: "Komoditas / Jenis Satwa", type: "text", required: true, full: true },
  { colIdx: 1, key: "foto",        label: "URL Foto",                type: "text", full: true },
  { colIdx: 2, key: "jumlah",      label: "Jumlah",                  type: "number" },
  { colIdx: 3, key: "satuan",      label: "Satuan",                  type: "text" },
  { colIdx: 4, key: "keterangan",  label: "Keterangan",              type: "textarea", full: true },
];

const buildPayload = (v: FormValues) =>
  FIELDS.map((f) => {
    let value: unknown = v[f.key];
    if (f.type === "number") value = Number(value) || 0;
    if (!value && (f.key === "keterangan" || f.key === "foto")) value = null;
    return { colIdx: f.colIdx, value };
  });

const formFromRow = (row: TableRow): FormValues => {
  const out: FormValues = {};
  for (const f of FIELDS) {
    const v = getCol(row, f.colIdx);
    out[f.key] = (v as string | number | null) ?? "";
  }
  return out;
};

interface Props { addTrigger: number; }

const KonservasiHewanTab = ({ addTrigger }: Props) => {
  const { token } = useAuth();
  const t = useAdminTable(PATH);

  const [editRow, setEditRow] = useState<TableRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirm, setConfirm] = useState<TableRow | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (addTrigger > 0) setShowAdd(true);
  }, [addTrigger]);

  const columns: ColumnDef<TableRow>[] = [
    { key: "komoditas", label: "Komoditas", render: (r) => String(getCol(r, 0) ?? "") },
    {
      key: "foto",
      label: "Foto",
      align: "center",
      render: (r) => {
        const url = String(getCol(r, 1) ?? "");
        return url ? <img src={url} alt="" className="admin-table-row-img" /> : "";
      },
    },
    { key: "jumlah", label: "Jumlah", align: "center", render: (r) => String(getCol(r, 2) ?? "") },
    { key: "satuan", label: "Satuan", align: "center", render: (r) => String(getCol(r, 3) ?? "") },
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
      <DataTable
        title="Tabel Konservasi Hewan"
        columns={columns}
        rows={t.rows}
        loading={t.loading}
        error={t.error}
        search={t.search}
        onSearchChange={t.setSearch}
        searchPlaceholder="Cari komoditas"
        page={t.page}
        hasNext={t.hasNext}
        onPrev={t.prev}
        onNext={t.next}
        onEdit={(r) => setEditRow(r)}
        onDelete={(r) => setConfirm(r)}
      />

      <RowFormModal
        open={showAdd}
        title="Tambah Konservasi Hewan"
        fields={FIELDS}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAdd}
      />

      <RowFormModal
        open={!!editRow}
        title="Edit Konservasi Hewan"
        fields={FIELDS}
        initialValues={editRow ? formFromRow(editRow) : undefined}
        onClose={() => setEditRow(null)}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        open={!!confirm}
        title="Hapus Data"
        message={`Hapus "${confirm ? String(getCol(confirm, 0) ?? "") : ""}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        busy={busy}
      />
    </>
  );
};

export default KonservasiHewanTab;
