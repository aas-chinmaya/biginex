"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TaxMasterRow } from "../../../types";
import TaxMasterActions from "../tax-master/TaxMasterActions";
import { formatDate } from "@/lib/utils";

export const TaxMasterMasterColumns = (
  onDeleteSuccess?: () => void
): ColumnDef<TaxMasterRow>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "hsnCode",
    header: "HSN Code",
  },
  {
    accessorKey: "sacCode",
    header: "SAC Code",
  },
  {
    accessorKey: "gstRate",
    header: "GST Rate", 
    cell: ({ row }) => <span>{row.original.gstRate}%</span>,
  },
  {
    accessorKey: "cgst",
    header: "CGST",
    cell: ({ row }) => <span>{row.original.cgst}%</span>,
  },
  {
    accessorKey: "sgst",
    header: "SGST",
    cell: ({ row }) => <span>{row.original.sgst}%</span>,
  },
 {
  accessorKey: "effectiveFrom",
  header: "Effective From",
  cell: ({ row }) => (
    <span>{formatDate(row.original.effectiveFrom)}</span>
  ),
},
{
  accessorKey: "effectiveTo",
  header: "Effective To",
  cell: ({ row }) => formatDate(row.original.effectiveTo),
},
  
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <TaxMasterActions id={String(row.original.id)} name={row.original.hsnCode} onDeleteSuccess={onDeleteSuccess} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
