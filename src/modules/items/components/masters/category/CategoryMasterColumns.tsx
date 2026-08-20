"use client";

import { ColumnDef } from "@tanstack/react-table";
 
import { CategoryMasterRow } from "../../../types";
import CategoryActions from "./CategoryActions";

export const CategoryMasterColumns = (
  onDeleteSuccess?: () => void
): ColumnDef<CategoryMasterRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "categoryName",
    header: "Category Name",
  },
{
  accessorKey: "description",
  header: "Description",
  cell: ({ row }) => {
    const html = row.original.description || "";

    const text = html.replace(/<[^>]*>/g, "").trim();

    return (
      <span className="line-clamp-2">
        {text || "-"}
      </span>
    );
  },
},  
   
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString("en-IN")}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <span>{new Date(row.original.updatedAt).toLocaleDateString("en-IN")}</span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <CategoryActions
        id={String(row.original.id)}
        name={row.original.categoryName}
        onDeleteSuccess={onDeleteSuccess}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
