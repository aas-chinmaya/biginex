"use client";

import { useMemo, useState } from "react";
import { DataTable, Pagination, Search, TableToolbar } from "@/components/data-table";
import { Switch } from "@/components/ui";
import { ProductRow } from "@/modules/items/types";
import Container from "../../../../components/common/Container";
import ItemActions from "./ItemActions";

interface Props {
  products: ProductRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onStatusChange?: (id: string, status: boolean) => Promise<void> | void;
}

export default function ProductTable({
  products,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onStatusChange,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchTerm = search.toLowerCase();
      return (
        product.itemCode?.toLowerCase().includes(searchTerm) ||
        product.itemName?.toLowerCase().includes(searchTerm) ||
        product.hsnCode?.toLowerCase().includes(searchTerm) ||
        product.category?.categoryName?.toLowerCase().includes(searchTerm) ||
        product.brand?.brandName?.toLowerCase().includes(searchTerm)
      );
    });
  }, [products, search]);

  return (
    <div className="space-y-4">
        <TableToolbar>
          <Search placeholder="Search product..." value={search} onChange={setSearch} />
        </TableToolbar>

        <DataTable className="mt-4"
          columns={[
            { accessorKey: "itemCode", header: "Item Code" },
            { accessorKey: "itemName", header: "Item Name" },
            {
              id: "category",
              header: "Category",
              cell: ({ row }) => <span>{row.original.category?.categoryName ?? "-"}</span>,
            },
            {
              id: "subCategory",
              header: "Sub Category",
              cell: ({ row }) => <span>{row.original.subCategory?.subCategoryName ?? "-"}</span>,
            },
            {
              id: "brand",
              header: "Brand",
              cell: ({ row }) => <span>{row.original.brand?.brandName ?? "-"}</span>,
            },
            {
              id: "unit",
              header: "Unit",
              cell: ({ row }) => <span>{row.original.inventoryUnit?.unitName ?? "-"}</span>,
            },
            {
              id: "tax",
              header: "Tax",
              cell: ({ row }) => <span>{row.original.tax?.hsnCode ?? "-"}</span>,
            },
            { accessorKey: "minimumStock", header: "Min Stock" },
            { accessorKey: "maximumStock", header: "Max Stock" },
            {
              id: "status",
              header: "Status",
              cell: ({ row }) => {
                const itemId = String(row.original.id ?? (row.original as any)._id ?? "");
                return (
                  <Switch
                    checked={row.original.status}
                    onCheckedChange={(next) => itemId && onStatusChange?.(itemId, !!next)}
                    aria-label="Toggle product status"
                  />
                );
              },
            },
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => {
                const itemId = String(row.original.id ?? (row.original as any)._id ?? "");
                return <ItemActions id={itemId} name={row.original.itemName} />;
              },
              enableSorting: false,
              enableHiding: false,
            },
          ]}
          data={filteredProducts}
          loading={loading}
          emptyMessage="No products found."
        />

        <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={(nextPage) => onPageChange?.(nextPage)} />
    </div>
  );
}
