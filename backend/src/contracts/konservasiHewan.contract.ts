import type { DataDesc } from "../types/contract.types";

export const konservasiHewanContract: DataDesc = {
  name: "Konservasi Hewan",
  path: "/konservasi/hewan",
  code: "1f0c9d2a-3b4c-6d7e-8f90-aaaaaaaaaa03",
  iconUri: null,
  description: "Detail konservasi hewan KST Jatikerto.",
  operations: ["read", "write", "delete"],
  params: [],
  dataType: {
    typeName: "table",
    columns: [
      { colIdx: 0, name: "Komoditas",   dataType: { typeName: "text" } },
      { colIdx: 1, name: "Foto",        dataType: { typeName: "resource", mimeType: "image/jpeg" } },
      { colIdx: 2, name: "Jumlah",      dataType: { typeName: "number", unit: null } },
      { colIdx: 3, name: "Satuan",      dataType: { typeName: "text" } },
      { colIdx: 4, name: "Keterangan",  dataType: { typeName: "text" } },
    ],
  },
};
