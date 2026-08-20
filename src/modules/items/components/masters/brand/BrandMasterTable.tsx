"use client";

import { useMemo, useState } from "react";
import { DataTable, Pagination, Search, TableToolbar } from "@/components/data-table";
import { BrandMasterRow } from "../../../types";
import { BrandMasterColumns } from "./BrandMasterColumns";
 
interface Props {
  brands: BrandMasterRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function BrandMasterTable({
  brands,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        brand.brandName.toLowerCase().includes(searchTerm) ||
        brand.description.toLowerCase().includes(searchTerm) ||
        String(brand.id).toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? brand.status
            : !brand.status;

      return matchesSearch && matchesStatus;
    });
  }, [brands, search, statusFilter]);

  return (
    <div className="space-y-4">
         

      <TableToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Search placeholder="Search brand..." value={search} onChange={setSearch} />
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

      <DataTable columns={BrandMasterColumns(onRefresh)} data={filteredBrands} loading={loading} emptyMessage="No brand records found." />

      <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={(nextPage) => onPageChange?.(nextPage)} />
 

    </div>
  );
}
