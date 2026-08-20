"use client";

import { ColumnDef } from "@tanstack/react-table";
import { VariantValueMasterRow } from "../../../types";
import VariantValueActions from "./VariantValueActions";

export const VariantValueMasterColumns = (
  onDeleteSuccess?: () => void
): ColumnDef<VariantValueMasterRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "variantType.variantTypeName",
    header: "Variant Type",
    cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.variantType?.variantTypeName || "-"}</span>,
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
  },
  {
    accessorKey: "displayOrder",
    header: "Display Order",
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
    cell: ({ row }) => <VariantValueActions id={String(row.original.id)} name={row.original.value} onDeleteSuccess={onDeleteSuccess} />,
    enableSorting: false,
    enableHiding: false,
  },
];
