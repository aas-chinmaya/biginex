"use client";

import { useMemo } from "react";
import CategoryMasterTable from "@/modules/items/components/masters/category/CategoryMasterTable";
import AddCategoryButton from "@/modules/items/components/masters/category/AddCategoryButton";
import { useCategories } from "@/modules/items/hooks/useCategories";

export default function CategoryMasterPage() {
  const {
    categories,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch,
    setPage,
  } = useCategories();

  const pageTitle = useMemo(() => "Category Master", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {pageTitle}
          </h1>

          <p className="text-gray-500">
            Manage master category records used across items and inventory.
          </p>
        </div>

        <div>
          <AddCategoryButton />
        </div>
      </div>

      <CategoryMasterTable
        categories={categories}
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