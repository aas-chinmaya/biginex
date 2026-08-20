"use client";

import { useMemo, useState } from "react";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import InvoiceFilters from "./invoice-filters";
import { DraftInvoiceColumns } from "./draft-invoice-columns";

import type { Invoice } from "../../types/invoice";

interface DraftInvoiceTableProps {
  drafts: Invoice[];
  loading?: boolean;
}

export default function DraftInvoiceTable({
  drafts,
  loading = false,
}: DraftInvoiceTableProps) {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");

  const filteredDrafts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return drafts.filter((draft) => {
      const matchesSearch =
        (draft.invoiceNumber ?? "")
          .toLowerCase()
          .includes(searchText) ||
        (draft.buyerName ?? "")
          .toLowerCase()
          .includes(searchText) ||
        (draft.buyerCompanyName ?? "")
          .toLowerCase()
          .includes(searchText);

      const matchesPeriod = (() => {
        const dateValue =
          draft.invoiceDate ??
          draft.createdAt ??
          draft.updatedAt;

        if (!dateValue) {
          return period === "all";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
          return period === "all";
        }

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        switch (period) {
          case "today":
            return date >= startOfToday && date <= now;

          case "7d": {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 6);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            return (
              date >= sevenDaysAgo &&
              date <= now
            );
          }

          case "30d": {
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(now.getDate() - 29);
            thirtyDaysAgo.setHours(0, 0, 0, 0);

            return (
              date >= thirtyDaysAgo &&
              date <= now
            );
          }

          case "month":
            return (
              date.getFullYear() === now.getFullYear() &&
              date.getMonth() === now.getMonth()
            );

          case "year":
            return (
              date.getFullYear() === now.getFullYear()
            );

          case "all":
          default:
            return true;
        }
      })();

      return matchesSearch && matchesPeriod;
    });
  }, [drafts, period, search]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <Search
          placeholder="Search draft invoice..."
          value={search}
          onChange={setSearch}
        />

        <InvoiceFilters
          value="DRAFT"
          onChange={() => {}}
          period={period}
          onPeriodChange={setPeriod}
          showDraftsOnly
        />
      </TableToolbar>

      <DataTable
        columns={DraftInvoiceColumns}
        data={filteredDrafts}
        loading={loading}
        emptyMessage="No draft invoices found."
      />

      <Pagination
        page={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}