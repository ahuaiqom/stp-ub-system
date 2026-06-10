import type { DataDesc } from "../types/contract.types";

export const akademikContract: DataDesc = {
  name: "Pelayanan Akademik",
  path: "/akademik/items",
  code: "1f0c9d2a-3b4c-6d7e-8f90-aaaaaaaaaa05",
  iconUri: null,
  description: "Kegiatan riset mahasiswa di KST Jatikerto.",
  operations: ["read", "write", "delete"],
  params: [],
  dataType: {
    typeName: "table",
    columns: [
      { colIdx: 0, name: "Nama",              dataType: { typeName: "text" } },
      { colIdx: 1, name: "Dosen Pembimbing",  dataType: { typeName: "text" } },
      { colIdx: 2, name: "Program Studi",     dataType: { typeName: "text" } },
      { colIdx: 3, name: "Mulai",             dataType: { typeName: "datetime" } },
      { colIdx: 4, name: "Selesai",           dataType: { typeName: "datetime" } },
      { colIdx: 5, name: "Luasan",            dataType: { typeName: "number", unit: "m2" } },
      { colIdx: 6, name: "Judul Penelitian",  dataType: { typeName: "text" } },
    ],
  },
};
