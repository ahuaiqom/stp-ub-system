import { useEffect, useRef, useState } from "react";
import { ApiError } from "../services/api";
import type { PageContainer } from "../services/public.api";

const PAGE_SIZE = 5;

export interface PagedState<T> {
  items: T[];
  page: number;        // 1-based
  hasNext: boolean;
  loading: boolean;
  error: string | null;
}

export function usePagedData<T>(
  fetcher: (p: { offset: number; limit: number }) => Promise<PageContainer<T>>,
  pageSize: number = PAGE_SIZE
) {
  const [state, setState] = useState<PagedState<T>>({
    items: [],
    page: 1,
    hasNext: false,
    loading: true,
    error: null,
  });

  // Stable ref so re-renders don't refetch when fetcher identity changes
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcherRef
      .current({ offset: (state.page - 1) * pageSize, limit: pageSize })
      .then((res) => {
        if (cancelled) return;
        setState({
          items: res.items,
          page: state.page,
          hasNext: res.hasNext,
          loading: false,
          error: null,
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg =
          e instanceof ApiError
            ? e.message
            : "Gagal memuat data. Coba lagi nanti.";
        setState((s) => ({ ...s, loading: false, error: msg }));
      });
    return () => {
      cancelled = true;
    };
  }, [state.page, pageSize]);

  const next = () =>
    setState((s) => (s.hasNext ? { ...s, page: s.page + 1 } : s));
  const prev = () =>
    setState((s) => (s.page > 1 ? { ...s, page: s.page - 1 } : s));

  return { ...state, pageSize, next, prev };
}
