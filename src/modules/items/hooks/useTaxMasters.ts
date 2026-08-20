"use client";

import { useEffect, useState } from "react";
import { TaxMasterRow } from "../types";
import { taxMasterservice } from "../services/tax-master.service";

export function useTaxMasters() {
  const [taxMasters, setTaxMasters] = useState<TaxMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchTaxMasters(nextPage = 1) {
    try {
      setLoading(true);
      const response = await taxMasterservice.getTaxMasters(nextPage, 10);
      const payload = response?.data?.data;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setTaxMasters(list);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || list.length));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTaxMasters(1);
  }, []);

  return {
    taxMasters,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchTaxMasters,
    setPage,
  };
}
