import type { DataDesc } from "../types/contract.types";

export const kemitraanContract: DataDesc = {
  name: "Kemitraan",
  path: "/kemitraan/items",
  code: "1f0c9d2a-3b4c-6d7e-8f90-aaaaaaaaaa06",
  iconUri: null,
  description: "Kegiatan kerjasama KST Jatikerto dengan berbagai mitra.",
  operations: ["read", "write", "delete"],
  params: [],
  dataType: {
    typeName: "table",
    columns: [
      { colIdx: 0, name: "Mitra",             dataType: { typeName: "text" } },
      { colIdx: 1, name: "Bidang Kerjasama",  dataType: { typeName: "text" } },
      { colIdx: 2, name: "Tanggal Mulai",     dataType: { typeName: "datetime" } },
      { colIdx: 3, name: "Tanggal Selesai",   dataType: { typeName: "datetime" } },
      { colIdx: 4, name: "Keterangan",        dataType: { typeName: "text" } },
    ],
  },
};
