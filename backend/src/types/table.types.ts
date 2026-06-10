/**
 * Table type response/request payloads per contract §2.8.
 */

export interface TableCellValue {
  colIdx: number;
  value: unknown;
}

export interface TableRow {
  rowId: string;
  updatedAt: string | null;
  createdAt: string;
  colValues: TableCellValue[];
}

export interface TableResponsePayload {
  typeName: "table";
  offset: number;
  limit: number;
  hasNext: boolean;
  items: TableRow[];
}

export interface TableQueryParams {
  offset: number;
  limit: number;
  search: string;
  searchCols: number[];
  sortCol: number;        // -1 = sort by createdAt
  sortOrder: "asc" | "desc";
}

export interface TableInsertRequest {
  typeName: "table";
  newValue: Array<{ colValues: TableCellValue[] }>;
}

export interface TablePatchRequest {
  typeName: "table";
  newValue: Array<{
    rowId: string;
    colValues: TableCellValue[] | null;   // null = delete row
  }>;
}
