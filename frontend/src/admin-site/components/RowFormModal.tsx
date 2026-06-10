import { useEffect, useState } from "react";
import Modal from "./Modal";

export interface FormFieldDef {
  colIdx: number;
  key: string;
  label: string;
  type: "text" | "number" | "date" | "textarea";
  required?: boolean;
  full?: boolean;
}

export interface FormValues {
  [key: string]: string | number | null;
}

interface Props {
  open: boolean;
  title: string;
  fields: FormFieldDef[];
  initialValues?: FormValues;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

const RowFormModal = ({
  open,
  title,
  fields,
  initialValues,
  onClose,
  onSubmit,
}: Props) => {
  const [values, setValues] = useState<FormValues>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const v: FormValues = {};
      for (const f of fields) {
        v[f.key] = initialValues?.[f.key] ?? (f.type === "number" ? 0 : "");
      }
      setValues(v);
      setError(null);
      setSubmitting(false);
    }
  }, [open, fields, initialValues]);

  const setField = (k: string, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
  };

  const handleSubmit = async () => {
    setError(null);
    for (const f of fields) {
      if (f.required && !String(values[f.key] ?? "").trim()) {
        setError(`${f.label} wajib diisi`);
        return;
      }
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleSubmit()}
            disabled={submitting}
          >
            {submitting ? "Menyimpan…" : "Simpan"}
          </button>
        </>
      }
    >
      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        {fields.map((f) => {
          const val = values[f.key];
          return (
            <div
              key={f.key}
              className={`form-field ${f.full ? "full" : ""}`}
            >
              <label htmlFor={f.key}>
                {f.label}
                {f.required && <span style={{ color: "#b13b2b" }}> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={f.key}
                  value={String(val ?? "")}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              ) : (
                <input
                  id={f.key}
                  type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                  value={String(val ?? "")}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default RowFormModal;
