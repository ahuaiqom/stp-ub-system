/**
 * Standard API response envelope per contract section 3 §1.
 * Reference: kst-integration/contract/3_Standar_API.md
 */
export interface ApiSuccess<T> {
  timestamp: string;
  response: T;
}

export interface ApiError {
  timestamp: string;
  response: null;
  error: {
    code: number;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * PageContainer — generic envelope for paginated responses
 * (contract §4.1). Used by /users.
 */
export interface PageContainer<T> {
  offset: number;
  limit: number;
  hasNext: boolean;
  items: T[];
}

/**
 * DataContainer — wrapper for /data/{path} and /query
 * responses (contract §4.2).
 */
export interface DataContainer<T = unknown> {
  code: string;
  createdAt: string;
  updatedAt: string | null;
  data: T;
}
