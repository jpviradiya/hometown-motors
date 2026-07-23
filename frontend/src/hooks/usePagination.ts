import { useState, useCallback } from "react";
import type { PaginationMeta } from "@/types/vehicle";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: options.initialPage || 1,
    limit: options.initialLimit || 6,
    total: 0,
    totalPages: 1,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages || 1)),
    }));
  }, []);

  const setPaginationMeta = useCallback((meta: PaginationMeta) => {
    setPagination(meta || { page: 1, limit: 6, total: 0, totalPages: 1 });
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  return {
    pagination,
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    setPage,
    setPaginationMeta,
    nextPage,
    prevPage,
  };
}

export default usePagination;
