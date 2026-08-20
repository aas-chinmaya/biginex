"use client";

import { useMemo } from "react";
import AddBrandButton from "@/modules/items/components/masters/brand/AddBrandButton";
import BrandMasterTable from "@/modules/items/components/masters/brand/BrandMasterTable";
import { useBrands } from "@/modules/items/hooks/useBrands";

export default function BrandMasterPage() {
  const { brands, loading, page, totalPages, totalRecords, refetch, setPage } = useBrands();

  const pageTitle = useMemo(() => "Brand Master", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Manage master brand records used across items and inventory.</p>
        </div>

        <div>
          <AddBrandButton />
        </div>
      </div>

      <BrandMasterTable
        brands={brands}
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
