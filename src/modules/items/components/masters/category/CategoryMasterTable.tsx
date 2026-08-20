"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";


import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";
 
import { CategoryMasterRow } from "../../../types";
import { CategoryMasterColumns } from "./CategoryMasterColumns";

interface Props {
  categories: CategoryMasterRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function CategoryMasterTable({
  categories,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onRefresh,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        category.categoryName.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm) ||
        String(category.id).toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? category.status
            : !category.status;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  return (
    <div className="space-y-4">
    
      <TableToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Search
            placeholder="Search category..."
            value={search}
            onChange={setSearch}
          />

           
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

      <DataTable
        columns={CategoryMasterColumns(onRefresh)}
        data={filteredCategories}
        loading={loading}
        emptyMessage="No category records found."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(nextPage) => onPageChange?.(nextPage)}
      />
    </div>
  );
}
