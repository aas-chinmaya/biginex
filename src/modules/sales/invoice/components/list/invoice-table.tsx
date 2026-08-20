"use client";

import { useMemo, useState } from "react";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import InvoiceFilters from "./invoice-filters";
import { InvoiceColumns } from "./invoice-columns";

import { InvoiceListItem } from "../../types/invoice-list.types";

interface InvoiceTableProps {
  invoices: InvoiceListItem[];
  loading?: boolean;
}

export default function InvoiceTable({
  invoices,
  loading = false,
}: InvoiceTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("all");

  const filteredInvoices = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return invoices.filter((invoice) => {
      const matchesSearch =
        (invoice.invoiceNumber ?? "")
          .toLowerCase()
          .includes(searchText) ||
        (invoice.buyerName ?? "")
          .toLowerCase()
          .includes(searchText) ||
        (invoice.buyerCompanyName ?? "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus = status
        ? (invoice.invoiceStatus ?? "").toUpperCase() ===
          status.toUpperCase()
        : true;

      const matchesPeriod = (() => {
        const invoiceDateValue =
          invoice.invoiceDate ??
          invoice.createdAt ??
          invoice.updatedAt;

        if (!invoiceDateValue) {
          return period === "all";
        }

        const invoiceDate = new Date(invoiceDateValue);

        if (Number.isNaN(invoiceDate.getTime())) {
          return period === "all";
        }

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        switch (period) {
          case "today":
            return (
              invoiceDate >= startOfToday &&
              invoiceDate <= now
            );

          case "7d": {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 6);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            return (
              invoiceDate >= sevenDaysAgo &&
              invoiceDate <= now
            );
          }

          case "30d": {
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(now.getDate() - 29);
            thirtyDaysAgo.setHours(0, 0, 0, 0);

            return (
              invoiceDate >= thirtyDaysAgo &&
              invoiceDate <= now
            );
          }

          case "month":
            return (
              invoiceDate.getFullYear() === now.getFullYear() &&
              invoiceDate.getMonth() === now.getMonth()
            );

          case "year":
            return (
              invoiceDate.getFullYear() === now.getFullYear()
            );

          case "all":
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPeriod
      );
    });
  }, [invoices, period, search, status]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <Search
          placeholder="Search invoice..."
          value={search}
          onChange={setSearch}
        />

        <InvoiceFilters
          value={status}
          onChange={setStatus}
          period={period}
          onPeriodChange={setPeriod}
        />
      </TableToolbar>

      <DataTable
        columns={InvoiceColumns}
        data={filteredInvoices}
        loading={loading}
        emptyMessage="No invoices found."
      />

      <Pagination
        page={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}