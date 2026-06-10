/**
 * Maps a contract module key → CRUD service module.
 * Used by /data/{path} and /query so the contract is the single
 * source of truth for routing.
 */
import * as pertanian from "./pertanian.service";
import * as peternakan from "./peternakan.service";
import * as konservasi from "./konservasi.service";
import * as konservasiTanaman from "./konservasiTanaman.service";
import * as akademik from "./akademik.service";
import * as kemitraan from "./kemitraan.service";

import type { TableQueryParams } from "../types/table.types";

export interface ModuleService {
  list: (q: TableQueryParams) => Promise<unknown>;
  insert: (
    rows: Array<{ colValues: { colIdx: number; value: unknown }[] }>,
    userId: number | null
  ) => Promise<string[]>;
  patch: (
    rows: Array<{ rowId: string; colValues: { colIdx: number; value: unknown }[] | null }>,
    userId: number | null
  ) => Promise<void>;
}

export const MODULES: Record<string, ModuleService> = {
  pertanian,
  peternakan,
  konservasiHewan: konservasi,
  konservasiTanaman,
  akademik,
  kemitraan,
};
