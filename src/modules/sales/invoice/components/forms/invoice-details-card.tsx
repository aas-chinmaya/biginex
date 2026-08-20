"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CalendarDays, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InvoiceFormValues } from "../../types/invoice-form";

export default function InvoiceInformationCard() {
  const { control, register, formState: { errors } } = useFormContext<InvoiceFormValues>();
  return <section>
    <div className="flex items-center gap-2 border-b border-gray-200 pb-3"><span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="size-4" /></span><h2 className="text-sm font-semibold text-gray-900">Invoice details</h2></div>
    <div className="space-y-4 pt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Invoice type"><Controller control={control} name="invoiceType" render={({ field }) => <Select value={field.value || "B2B"} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="B2B">B2B</SelectItem><SelectItem value="B2C">B2C</SelectItem><SelectItem value="EXPORT">Export</SelectItem><SelectItem value="SEZ">SEZ</SelectItem></SelectContent></Select>} /></Field>
        <Field label="Currency"><Input value="INR" readOnly aria-label="Currency" /><input type="hidden" {...register("currency")} /></Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Invoice date" required error={errors.invoiceDate?.message}>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="date" className="pl-9" {...register("invoiceDate")} />
          </div>
        </Field>
      </div>
      <input type="hidden" {...register("businessId")} /><input type="hidden" {...register("createdBy")} /><input type="hidden" {...register("branchId")} />
      <div className="grid gap-3 sm:grid-cols-2"><Field label="Branch"><Input {...register("branch")} placeholder="Branch name" /></Field><Field label="Reference number"><Input {...register("referenceNumber")} placeholder="Optional reference" /></Field></div>

      {/* No T&C checkbox as per user preference */}
    </div>
  </section>;
}

function Field({ label, children, required, error }: { label: string; children: React.ReactNode; required?: boolean; error?: string }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}{required ? <span className="ml-1 text-red-600">*</span> : null}</Label>{children}{error ? <p className="text-xs text-red-600">{error}</p> : null}</div>;
}
