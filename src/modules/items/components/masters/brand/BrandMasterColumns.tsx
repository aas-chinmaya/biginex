"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BrandMasterRow } from "../../../types";
import BrandActions from "./BrandActions";

export const BrandMasterColumns = (
  onDeleteSuccess?: () => void
): ColumnDef<BrandMasterRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "brandName",
    header: "Brand Name",
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
      <BrandActions id={String(row.original.id)} name={row.original.brandName} onDeleteSuccess={onDeleteSuccess} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
