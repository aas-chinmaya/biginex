"use client";

import { ColumnDef } from "@tanstack/react-table";
import { VariantTypeMasterRow } from "../../../types";
import VariantTypeActions from "../variant-type/VariantTypeActions";

export const VariantTypeMasterColumns = (
  onDeleteSuccess?: () => void
): ColumnDef<VariantTypeMasterRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
 {
  accessorKey: "subCategory.subCategoryName",
  header: "Sub Category",
  cell: ({ row }) => (
    <span className="font-medium text-slate-700">
      {row.original.subCategory?.subCategoryName ?? "-"}
    </span>
  ),
},
  {
    accessorKey: "variantTypeCode",
    header: "Variant Type Code",
  },
  {
    accessorKey: "variantTypeName",
    header: "Variant Type Name",
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
    cell: ({ row }) => <VariantTypeActions id={String(row.original.id)} name={row.original.variantTypeName} onDeleteSuccess={onDeleteSuccess} />,
    enableSorting: false,
    enableHiding: false,
  },
];
