"use client";

import { useEffect, useState } from "react";
import { UnitMasterRow } from "../types";
import { unitservice } from "../services/unit.service";

export function useUnits() {
  const [units, setUnits] = useState<UnitMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchUnits(nextPage = 1) {
    try {
      setLoading(true);
      const response = await unitservice.getUnits(nextPage, 10);
      const payload = response?.data?.data;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setUnits(list);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || list.length));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUnits(1);
  }, []);

  return {
    units,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchUnits,
    setPage,
  };
}
