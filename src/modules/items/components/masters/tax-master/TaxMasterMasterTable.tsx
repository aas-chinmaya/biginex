"use client";

import { useMemo, useState } from "react";
import { DataTable, Pagination, Search, TableToolbar } from "@/components/data-table";
import { TaxMasterRow } from "../../../types";
import { TaxMasterMasterColumns } from "./TaxMasterMasterColumns";

interface Props {
  taxMasters: TaxMasterRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function TaxMasterMasterTable({
  taxMasters,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTaxMasters = useMemo(() => {
    return taxMasters.filter((taxMaster) => {
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        taxMaster.hsnCode.toLowerCase().includes(searchTerm) ||
        taxMaster.sacCode.toLowerCase().includes(searchTerm) ||
        String(taxMaster.gstRate).toLowerCase().includes(searchTerm) ||
        String(taxMaster.id).toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ? true : statusFilter === "active" ? taxMaster.status : !taxMaster.status;

      return matchesSearch && matchesStatus;
    });
  }, [taxMasters, search, statusFilter]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Search placeholder="Search tax master..." value={search} onChange={setSearch} />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </TableToolbar>

      <DataTable columns={TaxMasterMasterColumns(onRefresh)} data={filteredTaxMasters} loading={loading} emptyMessage="No tax master records found." />

      <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={(nextPage) => onPageChange?.(nextPage)} />
    </div>
  );
}
