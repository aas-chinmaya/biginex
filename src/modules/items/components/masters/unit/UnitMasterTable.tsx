"use client";

import { useMemo, useState } from "react";
import { DataTable, Pagination, Search, TableToolbar } from "@/components/data-table";
import { UnitMasterRow } from "../../../types";
import { UnitMasterColumns } from "./UnitMasterColumns";

interface Props {
  units: UnitMasterRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function UnitMasterTable({
  units,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        unit.unitName.toLowerCase().includes(searchTerm) ||
        unit.shortName.toLowerCase().includes(searchTerm) ||
        unit.unitType.toLowerCase().includes(searchTerm) ||
        unit.description.toLowerCase().includes(searchTerm) ||
        String(unit.id).toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? unit.status
            : !unit.status;

      return matchesSearch && matchesStatus;
    });
  }, [units, search, statusFilter]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Search placeholder="Search unit..." value={search} onChange={setSearch} />
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

      <DataTable columns={UnitMasterColumns(onRefresh)} data={filteredUnits} loading={loading} emptyMessage="No unit records found." />

      <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={(nextPage) => onPageChange?.(nextPage)} />
    </div>
  );
}
