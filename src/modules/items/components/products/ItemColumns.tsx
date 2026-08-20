"use client";

import { ColumnDef } from "@tanstack/react-table";
import { item } from "../../types";
import ItemActions from "./ItemActions";
import { Badge } from "@/components/ui";

export const ItemColumns: ColumnDef<item>[] = [
  {
    accessorKey: "name",

    header: "Item",

    cell: ({ row }) => (
      <div>
        <p className="font-medium text-gray-900">
          {row.original.name}
        </p>

        <p className="text-sm text-gray-500">
          {row.original.sku}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "category",

    header: "Category",
  },

  {
    accessorKey: "sellingPrice",

    header: "Selling Price",

    cell: ({ row }) => (
      <span className="font-medium">
        ₹{row.original.sellingPrice.toLocaleString("en-IN")}
      </span>
    ),
  },

  {
    accessorKey: "stock",

    header: "Stock",

    cell: ({ row }) => {
      const stock = row.original.stock;

      return (
        <Badge
          variant={
            stock < 10
              ? "destructive"
              : "default"
          }
        >
          {stock}
        </Badge>
      );
    },
  },

  {
    accessorKey: "gst",

    header: "GST",

    cell: ({ row }) => (
      <span>{row.original.gst}%</span>
    ),
  },

  {
    id: "actions",

    header: () => (
      <div className="text-right">
        Actions
      </div>
    ),

    cell: ({ row }) => (
      <ItemActions
        id={row.original.id}
        name={row.original.name}
      />
    ),

    enableSorting: false,
    enableHiding: false,
  },
];