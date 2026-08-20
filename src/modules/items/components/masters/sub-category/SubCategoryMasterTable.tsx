"use client";

import { useMemo, useState } from "react";
import { DataTable, Pagination, Search, TableToolbar } from "@/components/data-table";
import { SubCategoryMasterRow } from "../../../types";
import { SubCategoryMasterColumns } from "./SubCategoryMasterColumns";

interface Props {
  subCategories: SubCategoryMasterRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function SubCategoryMasterTable({
  subCategories,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((subCategory) => {
      const searchTerm = search.toLowerCase();
    const matchesSearch =
  subCategory.subCategoryName.toLowerCase().includes(searchTerm) ||
  subCategory.description.toLowerCase().includes(searchTerm) ||
  subCategory.category?.categoryName.toLowerCase().includes(searchTerm) ||
  String(subCategory.id).toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? subCategory.status
            : !subCategory.status;

      return matchesSearch && matchesStatus;
    });
  }, [subCategories, search, statusFilter]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Search placeholder="Search sub-category..." value={search} onChange={setSearch} />
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

      <DataTable columns={SubCategoryMasterColumns(onRefresh)} data={filteredSubCategories} loading={loading} emptyMessage="No sub-category records found." />

      <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={(nextPage) => onPageChange?.(nextPage)} />
    </div>
  );
}
