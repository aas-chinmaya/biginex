"use client";

import { useMemo } from "react";
import AddSubCategoryButton from "@/modules/items/components/masters/sub-category/AddSubCategoryButton";
import SubCategoryMasterTable from "@/modules/items/components/masters/sub-category/SubCategoryMasterTable";
import { useSubCategories } from "@/modules/items/hooks/useSubCategories";

export default function SubCategoryMasterPage() {
  const { subCategories, loading, page, totalPages, totalRecords, refetch, setPage } = useSubCategories();

  const pageTitle = useMemo(() => "Sub Category Master", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Manage master sub-category records used across items and inventory.</p>
        </div>

        <div>
          <AddSubCategoryButton />
        </div>
      </div>

      <SubCategoryMasterTable
        subCategories={subCategories}
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
