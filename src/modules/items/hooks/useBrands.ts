"use client";

import { useEffect, useState } from "react";
import { BrandMasterRow } from "../types";
import { brandservice } from "../services/brand.service";

export function useBrands() {
  const [brands, setBrands] = useState<BrandMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchBrands(nextPage = 1) {
    try {
      setLoading(true);

      const response = await brandservice.getBrands(nextPage, 10);
      const payload = response?.data?.data;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setBrands(list);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || list.length));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands(1);
  }, []);

  return {
    brands,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchBrands,
    setPage,
  };
}
