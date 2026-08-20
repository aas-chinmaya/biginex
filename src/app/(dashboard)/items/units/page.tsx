"use client";

import { useMemo } from "react";
import AddUnitButton from "@/modules/items/components/masters/unit/AddUnitButton";
import UnitMasterTable from "@/modules/items/components/masters/unit/UnitMasterTable";
import { useUnits } from "@/modules/items/hooks/useUnits";

export default function UnitMasterPage() {
  const { units, loading, page, totalPages, totalRecords, refetch, setPage } = useUnits();

  const pageTitle = useMemo(() => "Unit Master", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Manage master unit records used across items and inventory.</p>
        </div>

        <div>
          <AddUnitButton />
        </div>
      </div>

      <UnitMasterTable
        units={units}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          refetch(nextPage);
        }}
        onRefresh={() => refetch(page)}
      />
    </div>
  );
}
