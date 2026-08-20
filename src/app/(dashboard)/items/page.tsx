"use client";

import { useMemo } from "react";
import AdditemButton from "@/modules/items/components/products/AddItemButton";
import ProductTable from "@/modules/items/components/products/ItemTable";
import { useProducts } from "@/modules/items/hooks/useProducts";

export default function itemsPage() {
  const { products, loading, page, totalPages, totalRecords, refetch, setPage, changeProductStatus } = useProducts();

  const pageTitle = useMemo(() => "Products", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Manage product records with master-linked category, brand, unit, and tax information.</p>
        </div>

        <div>
          <AdditemButton />
        </div>
      </div>

      <ProductTable
        products={products}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          refetch(nextPage);
        }}
        onStatusChange={async (id, status) => {
          await changeProductStatus(id, status);
        }}
      />
    </div>
  );
}