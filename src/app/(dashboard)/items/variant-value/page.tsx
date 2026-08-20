"use client";

import { useMemo } from "react";
import AddVariantValueButton from "@/modules/items/components/masters/variant-value/AddVariantValueButton";
import VariantValueMasterTable from "@/modules/items/components/masters/variant-value/VariantValueMasterTable";
import { useVariantValues } from "@/modules/items/hooks/useVariantValues";

export default function VariantValueMasterPage() {
  const { variantValues, loading, page, totalPages, totalRecords, refetch, setPage } = useVariantValues();

  const pageTitle = useMemo(() => "Variant Value Master", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Manage master variant value records used across items and inventory.</p>
        </div>

        <div>
          <AddVariantValueButton />
        </div>
      </div>

      <VariantValueMasterTable
        variantValues={variantValues}
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
