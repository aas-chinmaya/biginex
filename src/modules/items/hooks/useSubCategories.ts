"use client";

import { useEffect, useState } from "react";
import { SubCategoryMasterRow } from "../types";
import { subCategoryservice } from "../services/sub-category.service";

export function useSubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategoryMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchSubCategories(nextPage = 1) {
    try {
      setLoading(true);

      const response = await subCategoryservice.getSubCategories(nextPage, 10);
      const payload = response?.data?.data;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setSubCategories(list);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || list.length));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubCategories(1);
  }, []);

  return {
    subCategories,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchSubCategories,
    setPage,
  };
}
