"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui";

import type { Invoice } from "../../types/invoice";

import InvoiceActions from "./invoice-actions";

export const DraftInvoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Draft",

    cell: ({ row }) => {
      const draft = row.original;

      return (
        <div className="min-w-[160px]">
          <p className="font-medium">
            {draft.invoiceNumber ?? "Draft Invoice"}
          </p>

          <p className="text-xs text-muted-foreground">
            {draft.buyerName ??
              draft.buyerCompanyName ??
              "No customer"}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "updatedAt",
    header: "Last Updated",

    cell: ({ row }) => {
      const date =
        row.original.updatedAt ??
        row.original.createdAt;

      if (!date) {
        return (
          <span className="text-muted-foreground">
            -
          </span>
        );
      }

      return (
        <span>
          {new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  {
    accessorKey: "grandTotal",
    header: "Total",

    cell: ({ row }) => {
      const amount = Number(
        row.original.grandTotal ?? 0
      );

      return (
        <div>
          <p className="font-medium">
            ₹
            {amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-xs text-muted-foreground">
            {row.original.totalItems ?? 0}{" "}
            {row.original.totalItems === 1
              ? "Item"
              : "Items"}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "invoiceStatus",
    header: "Status",

    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          DRAFT
        </Badge>
      );
    },
  },

  {
    id: "actions",

    header: () => (
      <div className="text-right">
        Actions
      </div>
    ),

    cell: ({ row }) => {
      const draft = row.original;

      return (
        <div className="text-right">
          <InvoiceActions
            id={draft.id}
            invoiceNumber={
              draft.invoiceNumber ?? undefined
            }
            status="DRAFT"
            isDraft
          />
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];