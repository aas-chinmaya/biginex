"use client";

import { useEffect, useState } from "react";
import { CategoryMasterRow } from "../types";
import { categoryservice } from "../services/category.service";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchCategories(nextPage = 1) {
    try {
      setLoading(true);

      const response = await categoryservice.getCategories(nextPage, 10);
      const payload = response?.data?.data;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setCategories(list);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || list.length));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories(1);
  }, []);

  return {
    categories,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchCategories,
    setPage,
  };
}
