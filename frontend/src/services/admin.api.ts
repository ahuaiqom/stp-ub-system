/**
 * Admin endpoints — wrap /api/data/{path} calls with token & helpers.
 */
import { request } from "./api";

export interface TableCellValue {
  colIdx: number;
  value: unknown;
}

export interface TableRow {
  rowId: string;
  createdAt: string;
  updatedAt: string | null;
  colValues: TableCellValue[];
}

export interface TableData {
  typeName: "table";
  offset: number;
  limit: number;
  hasNext: boolean;
  items: TableRow[];
}

export interface DataContainer<T = unknown> {
  code: string;
  createdAt: string;
  updatedAt: string | null;
  data: T;
}

export interface ListParams {
  offset?: number;
  limit?: number;
  search?: string;
  search_col?: number[];
  sort_col?: number;
  sort_order?: "asc" | "desc";
}

const buildQuery = (p: ListParams) => {
  const q: Record<string, string | number | undefined> = {};
  if (p.offset != null) q.offset = p.offset;
  if (p.limit != null) q.limit = p.limit;
  if (p.search) q.search = p.search;
  if (p.sort_col != null) q.sort_col = p.sort_col;
  if (p.sort_order) q.sort_order = p.sort_order;
  return q;
};

export const fetchTable = (path: string, params: ListParams, token: string) =>
  request<DataContainer<TableData>>(`/data${path}`, {
    method: "GET",
    query: buildQuery(params),
    token,
  });

export const insertRow = (
  path: string,
  values: TableCellValue[],
  token: string
) =>
  request<{ rowIds: string[] }>(`/data${path}`, {
    method: "POST",
    token,
    body: {
      typeName: "table",
      newValue: [{ colValues: values }],
    },
  });

export const updateRow = (
  path: string,
  rowId: string,
  values: TableCellValue[],
  token: string
) =>
  request<{ message: string }>(`/data${path}`, {
    method: "PATCH",
    token,
    body: {
      typeName: "table",
      newValue: [{ rowId, colValues: values }],
    },
  });

export const deleteRow = (path: string, rowId: string, token: string) =>
  request<{ message: string }>(`/data${path}`, {
    method: "PATCH",
    token,
    body: {
      typeName: "table",
      newValue: [{ rowId, colValues: null }],
    },
  });
