"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui";

import type { Invoice } from "../../types/invoice";

import InvoiceActions from "./invoice-actions";

export const InvoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice",

    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <div className="min-w-[160px]">
          <p className="font-medium">
            {invoice.invoiceNumber ?? "-"}
          </p>

          <p className="text-xs text-muted-foreground">
            {invoice.buyerName ??
              invoice.buyerCompanyName ??
              "No customer"}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",

    cell: ({ row }) => {
      const date = row.original.invoiceDate;

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
      const status = (
        row.original.invoiceStatus ?? ""
      ).toUpperCase();

      const variant =
        status === "PAID"
          ? "success"
          : status === "PENDING"
            ? "secondary"
            : status === "CANCELLED"
              ? "destructive"
              : "outline";

      return (
        <Badge variant={variant}>
          {status || "-"}
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
      const invoice = row.original;

      return (
        <div className="text-right">
          <InvoiceActions
            id={invoice.id}
            invoiceNumber={
              invoice.invoiceNumber ?? undefined
            }
            status={invoice.invoiceStatus}
            isDraft={false}
          />
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];