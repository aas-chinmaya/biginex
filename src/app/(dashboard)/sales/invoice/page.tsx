"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

import InvoiceTable from "@/modules/sales/invoice/components/list/invoice-table";
import DraftInvoiceTable from "@/modules/sales/invoice/components/list/draft-invoice-table";

export default function InvoiceListPage() {
  const router = useRouter();

  const {
    invoices,
    drafts,
    loading,
    getInvoices,
    getDrafts,
  } = useInvoiceQuery();

  const [activeTab, setActiveTab] = useState<"all" | "draft">(
    "all"
  );

  useEffect(() => {
    if (activeTab === "all") {
      getInvoices();
    } else {
      getDrafts();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Invoices
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage customer invoices
          </p>
        </div>

        <Button
          onClick={() =>
            router.push("/sales/invoice/create")
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-md border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-md px-5 py-2 text-sm font-medium transition-all ${
            activeTab === "all"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("draft")}
          className={`rounded-md px-5 py-2 text-sm font-medium transition-all ${
            activeTab === "draft"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Drafts
        </button>
      </div>

      {/* All invoices */}
      {activeTab === "all" && (
        <InvoiceTable
          invoices={invoices}
          loading={loading}
        />
      )}

      {/* Draft invoices */}
      {activeTab === "draft" && (
        <DraftInvoiceTable
          drafts={drafts}
          loading={loading}
        />
      )}
    </div>
  );
}