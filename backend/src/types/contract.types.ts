/**
 * Data contract types per contract sections 4 & 5.
 * These mirror the JSON shapes the frontend expects from /contract.
 */

export type SemanticColor = "positive" | "neutral" | "negative" | string; // or "#RGBHEX"

// ---------- TypeDesc ----------------------------------------------------
export type TypeDesc =
  | { typeName: "boolean" }
  | { typeName: "number"; unit: string | null }
  | { typeName: "text" }
  | { typeName: "variant"; variants: VariantOption[] }
  | { typeName: "markdown" }
  | { typeName: "resource"; mimeType: ResourceMime }
  | { typeName: "datetime" }
  | { typeName: "table"; columns: TableColumn[] };
// timeSeries omitted — no current use case in this KST.

export interface VariantOption {
  index: number;
  variant: string;
  semantic: SemanticColor;
}

export type ResourceMime =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "video/mp4"
  | "application/pdf";

export interface TableColumn {
  colIdx: number;
  name: string;
  dataType: TypeDesc;
}

// ---------- Parameter --------------------------------------------------
export interface ContractParameter {
  key: string;
  valueType:
    | "string"
    | "int"
    | "float"
    | "datetime"
    | "string[]"
    | "int[]"
    | "float[]";
  options: string[] | null;
}

// ---------- DataDesc ---------------------------------------------------
export type Operation = "read" | "write" | "delete";

export interface DataDesc {
  name: string;
  path: string;
  code: string;
  iconUri: string | null;
  description: string;
  dataType: TypeDesc;
  operations: Operation[];
  params: ContractParameter[];
}

// ---------- CategoryDesc -----------------------------------------------
export interface CategoryDesc {
  name: string;
  path: string;
  iconUri: string | null;
  description: string;
  items: (DataDesc | CategoryDesc)[];
}

export type ContractItem = DataDesc | CategoryDesc;

export interface ContractDocument {
  version: string;
  contract: ContractItem[];
}
