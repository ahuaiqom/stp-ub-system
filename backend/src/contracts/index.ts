/**
 * Aggregated data contract for KST Jatikerto.
 * The frontend reads /api/contract once and uses this to render
 * the admin dashboard menu/tables.
 */
import type {
  ContractDocument,
  ContractItem,
  DataDesc,
} from "../types/contract.types";
import { pertanianContract } from "./pertanian.contract";
import { peternakanContract } from "./peternakan.contract";
import { konservasiHewanContract } from "./konservasiHewan.contract";
import { konservasiTanamanContract } from "./konservasiTanaman.contract";
import { akademikContract } from "./akademik.contract";
import { kemitraanContract } from "./kemitraan.contract";

const CONTRACT_VERSION = "0.0.1";

const ALL_DATA: DataDesc[] = [
  pertanianContract,
  peternakanContract,
  konservasiHewanContract,
  konservasiTanamanContract,
  akademikContract,
  kemitraanContract,
];

const filterByPermission = (
  items: DataDesc[],
  permission: "r" | "rw"
): DataDesc[] =>
  items.map((d) => ({
    ...d,
    operations:
      permission === "r"
        ? d.operations.filter((o) => o === "read")
        : d.operations,
  }));

export const buildContract = (
  permission: "r" | "rw" = "rw"
): ContractDocument => {
  const data = filterByPermission(ALL_DATA, permission);
  const contract: ContractItem[] = data;
  return { version: CONTRACT_VERSION, contract };
};

/**
 * Build a lookup table from path → DataDesc + module key
 * so /data/:path can dispatch to the right service.
 */
export const dataIndex = (): Map<string, { desc: DataDesc; module: string }> => {
  const m = new Map<string, { desc: DataDesc; module: string }>();
  m.set(pertanianContract.path,        { desc: pertanianContract,        module: "pertanian" });
  m.set(peternakanContract.path,       { desc: peternakanContract,       module: "peternakan" });
  m.set(konservasiHewanContract.path,  { desc: konservasiHewanContract,  module: "konservasiHewan" });
  m.set(konservasiTanamanContract.path,{ desc: konservasiTanamanContract,module: "konservasiTanaman" });
  m.set(akademikContract.path,         { desc: akademikContract,         module: "akademik" });
  m.set(kemitraanContract.path,        { desc: kemitraanContract,        module: "kemitraan" });
  return m;
};

/** Lookup by `code` (UUIDv6) for /query. */
export const dataIndexByCode = (): Map<
  string,
  { desc: DataDesc; module: string }
> => {
  const out = new Map<string, { desc: DataDesc; module: string }>();
  for (const [, v] of dataIndex().entries()) out.set(v.desc.code, v);
  return out;
};
