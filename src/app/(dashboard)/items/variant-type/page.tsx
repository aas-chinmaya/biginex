"use client";

import { useMemo } from "react";
import AddVariantTypeButton from "@/modules/items/components/masters/variant-type/AddVariantTypeButton";
import VariantTypeMasterTable from "@/modules/items/components/masters/variant-type/VariantTypeMasterTable";
import { useVariantTypes } from "@/modules/items/hooks/useVariantTypes";

export default function VariantTypeMasterPage() {
  const { variantTypes, loading, page, totalPages, totalRecords, refetch, setPage } = useVariantTypes();

  const pageTitle = useMemo(() => "Variant Type Master", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Manage master variant type records used across items and inventory.</p>
        </div>

        <div>
          <AddVariantTypeButton />
        </div>
      </div>

      <VariantTypeMasterTable
        variantTypes={variantTypes}
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
