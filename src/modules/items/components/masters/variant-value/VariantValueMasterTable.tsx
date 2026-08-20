"use client";

import { useMemo, useState } from "react";
import { DataTable, Pagination, Search, TableToolbar } from "@/components/data-table";
import { VariantValueMasterRow } from "../../../types";
import { VariantValueMasterColumns } from "./VariantValueMasterColumns";

interface Props {
  variantValues: VariantValueMasterRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function VariantValueMasterTable({
  variantValues,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVariantValues = useMemo(() => {
    return variantValues.filter((variantValue) => {
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        variantValue.value.toLowerCase().includes(searchTerm) ||
        variantValue.shortName.toLowerCase().includes(searchTerm) ||
        String(variantValue.displayOrder).includes(searchTerm) ||
        String(variantValue.id).toLowerCase().includes(searchTerm) ||
        variantValue.variantType?.variantTypeName?.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? variantValue.status
            : !variantValue.status;

      return matchesSearch && matchesStatus;
    });
  }, [variantValues, search, statusFilter]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Search placeholder="Search variant value..." value={search} onChange={setSearch} />
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

      <DataTable columns={VariantValueMasterColumns(onRefresh)} data={filteredVariantValues} loading={loading} emptyMessage="No variant value records found." />

      <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={(nextPage) => onPageChange?.(nextPage)} />
    </div>
  );
}
