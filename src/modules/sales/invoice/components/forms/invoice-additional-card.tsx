

"use client";

import { useFormContext } from "react-hook-form";
import { FileText, MessageSquareText, StickyNote } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { InvoiceFormValues } from "../../types/invoice-form.types";

export default function InvoiceAdditionalCard() {
  const { register } = useFormContext<InvoiceFormValues>();

  return (
    <section className="min-w-0">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
          <MessageSquareText className="size-4" />
        </span>
        <h2 className="text-sm font-semibold text-gray-900">Notes & terms</h2>
      </div>

      <div className="divide-y divide-gray-100">
        <Row label="Notes" icon={StickyNote}>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Visible to customer"
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Row>

        <Row label="Terms & Conditions" icon={FileText}>
          <textarea
            {...register("termsAndConditions")}
            rows={3}
            placeholder="Payment terms, late fees, etc."
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Row>
      </div>
    </section>
  );
}

function Row({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-1.5 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:pt-2.5">
        <Icon className="size-3.5 shrink-0" />
        {label}
      </Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}