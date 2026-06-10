import type { DataDesc } from "../types/contract.types";

export const pertanianContract: DataDesc = {
  name: "Pertanian",
  path: "/pertanian/items",
  code: "1f0c9d2a-3b4c-6d7e-8f90-aaaaaaaaaa01",
  iconUri: null,
  description: "Proyeksi panen komoditas pertanian KST Jatikerto.",
  operations: ["read", "write", "delete"],
  params: [],
  dataType: {
    typeName: "table",
    columns: [
      { colIdx: 0, name: "Komoditas",            dataType: { typeName: "text" } },
      { colIdx: 1, name: "Luas Usaha (m2)",      dataType: { typeName: "number", unit: "m2" } },
      { colIdx: 2, name: "Masa Tanam (Bulan)",   dataType: { typeName: "number", unit: "bulan" } },
      { colIdx: 3, name: "Per-Tahun (kali)",     dataType: { typeName: "number", unit: "kali" } },
      { colIdx: 4, name: "Proyeksi Panen",       dataType: { typeName: "number", unit: null } },
      { colIdx: 5, name: "Satuan",               dataType: { typeName: "text" } },
      { colIdx: 6, name: "Keterangan",           dataType: { typeName: "text" } },
    ],
  },
};
