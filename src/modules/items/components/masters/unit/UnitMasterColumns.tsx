"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UnitMasterRow } from "../../../types";
import UnitActions from "./UnitActions";

export const UnitMasterColumns = (
  onDeleteSuccess?: () => void
): ColumnDef<UnitMasterRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "unitName",
    header: "Unit Name",
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
  },
  {
    accessorKey: "unitType",
    header: "Unit Type",
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
      <UnitActions id={String(row.original.id)} name={row.original.unitName} onDeleteSuccess={onDeleteSuccess} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
