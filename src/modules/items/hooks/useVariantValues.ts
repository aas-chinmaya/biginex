"use client";

import { useEffect, useState } from "react";
import { VariantValueMasterRow } from "../types";
import { variantValueservice } from "../services/variant-value.service";

export function useVariantValues() {
  const [variantValues, setVariantValues] = useState<VariantValueMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchVariantValues(nextPage = 1) {
    try {
      setLoading(true);
      const response = await variantValueservice.getVariantValues(nextPage, 10);
      const payload = response?.data?.data;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setVariantValues(list);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || list.length));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVariantValues(1);
  }, []);

  return {
    variantValues,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchVariantValues,
    setPage,
  };
}
