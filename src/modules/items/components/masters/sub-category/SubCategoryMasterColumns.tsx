"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SubCategoryMasterRow } from "../../../types";
import SubCategoryActions from "./SubCategoryActions";

export const SubCategoryMasterColumns = (
  onDeleteSuccess?: () => void
): ColumnDef<SubCategoryMasterRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  
  {
  accessorKey: "category.categoryName",
  header: "Category",
  cell: ({ row }) => (
    <span className="font-medium text-slate-700">
      {row.original.category?.categoryName || "-"}
    </span>
  ),
},
  {
    accessorKey: "categoryId",
    header: "Category ID",
  },
 {
    accessorKey: "subCategoryName",
    header: "Sub Category Name",
  },
 
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const html = row.original.description || "";
      const text = html.replace(/<[^>]*>/g, "").trim();
      return <span className="line-clamp-2">{text || "-"}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleDateString("en-IN")}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => <span>{new Date(row.original.updatedAt).toLocaleDateString("en-IN")}</span>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <SubCategoryActions id={String(row.original.id)} name={row.original.subCategoryName} onDeleteSuccess={onDeleteSuccess} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
