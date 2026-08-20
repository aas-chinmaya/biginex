"use client";

import { useEffect, useState } from "react";
import { VariantTypeMasterRow } from "../types";
import { variantTypeservice } from "../services/variant-type.service";

export function useVariantTypes() {
  const [variantTypes, setVariantTypes] = useState<VariantTypeMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchVariantTypes(nextPage = 1) {
    try {
      setLoading(true);
      const response = await variantTypeservice.getVariantTypes(nextPage, 10);
      const payload = response?.data?.data;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setVariantTypes(list);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || list.length));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVariantTypes(1);
  }, []);

  return {
    variantTypes,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchVariantTypes,
    setPage,
  };
}
