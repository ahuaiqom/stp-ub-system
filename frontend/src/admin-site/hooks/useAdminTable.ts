import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../../services/api";
import { fetchTable, type TableRow } from "../../services/admin.api";
import { useAuth } from "../context/AuthContext";

interface State {
  rows: TableRow[];
  page: number;
  pageSize: number;
  hasNext: boolean;
  loading: boolean;
  error: string | null;
}

export function useAdminTable(path: string, pageSize = 5) {
  const { token } = useAuth();
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const [search, setSearch] = useState("");
  const [state, setState] = useState<State>({
    rows: [],
    page: 1,
    pageSize,
    hasNext: false,
    loading: true,
    error: null,
  });

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(id);
  }, [search]);

  const reload = useCallback(() => {
    if (!tokenRef.current) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchTable(
      path,
      {
        offset: (state.page - 1) * pageSize,
        limit: pageSize,
        search: debouncedSearch,
      },
      tokenRef.current
    )
      .then((c) => {
        setState((s) => ({
          ...s,
          rows: c.data.items,
          hasNext: c.data.hasNext,
          loading: false,
        }));
      })
      .catch((e: unknown) => {
        const msg =
          e instanceof ApiError ? e.message : "Gagal memuat data";
        setState((s) => ({ ...s, loading: false, error: msg }));
      });
  }, [path, pageSize, state.page, debouncedSearch]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setState((s) => (s.page === 1 ? s : { ...s, page: 1 }));
  }, [debouncedSearch]);

  return {
    rows: state.rows,
    page: state.page,
    pageSize,
    hasNext: state.hasNext,
    loading: state.loading,
    error: state.error,
    search,
    setSearch,
    next: () => setState((s) => (s.hasNext ? { ...s, page: s.page + 1 } : s)),
    prev: () => setState((s) => (s.page > 1 ? { ...s, page: s.page - 1 } : s)),
    reload,
  };
}

/** Pull a column value from a TableRow by colIdx. */
export const getCol = (row: TableRow, idx: number): unknown =>
  row.colValues.find((c) => c.colIdx === idx)?.value;
