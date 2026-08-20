

"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { BadgeIndianRupee, CalendarDays, CreditCard, Hash, Landmark, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InvoiceFormValues } from "../../types/invoice-form";

const methods = ["Cash", "Bank Transfer", "UPI", "Credit Card", "Cheque"];
const statuses = ["Pending", "Paid", "Partially Paid", "Overdue"];
const accounts = ["HDFC Bank", "State Bank of India", "ICICI Bank"];

export default function InvoicePaymentCard() {
  const { control, register, setValue } = useFormContext<InvoiceFormValues>();
  const paymentMethod = useWatch({ control, name: "paymentMethod" });
  const needsAccount = paymentMethod === "Bank Transfer" || paymentMethod === "Cheque";
  const needsReference = paymentMethod && paymentMethod !== "Cash";

  return (
    <section className="min-w-0">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <CreditCard className="size-4" />
        </span>
        <h2 className="text-sm font-semibold text-gray-900">Payment details</h2>
      </div>

      <div className="divide-y divide-gray-100">
        <Row label="Payment method">
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value !== "Bank Transfer" && value !== "Cheque") setValue("receivedAccount", "");
                }}
              >
                <IconSelectTrigger icon={Wallet}>
                  <SelectValue placeholder="Select method" />
                </IconSelectTrigger>
                <SelectContent>
                  {methods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Row>

        <Row label="Payment status">
          <Controller
            control={control}
            name="paymentStatus"
            render={({ field }) => (
              <Select value={field.value || "Pending"} onValueChange={field.onChange}>
                <IconSelectTrigger icon={BadgeIndianRupee}>
                  <SelectValue />
                </IconSelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Row>

        <Row label="Payment date">
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="date" className="pl-9" {...register("paymentDate")} />
          </div>
        </Row>

        <Row label="Paid amount">
          <div className="relative">
            <BadgeIndianRupee className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              className="pl-9"
              {...register("paidAmount")}
            />
          </div>
        </Row>

        {needsReference && (
          <Row label={paymentMethod === "Cheque" ? "Cheque number" : "Transaction reference"}>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Reference number" className="pl-9" {...register("transactionId")} />
            </div>
          </Row>
        )}

        {needsAccount && (
          <Row label="Received account">
            <Controller
              control={control}
              name="receivedAccount"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <IconSelectTrigger icon={Landmark}>
                    <SelectValue placeholder="Select bank account" />
                  </IconSelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Row>
        )}
      </div>
    </section>
  );
}

function IconSelectTrigger({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <SelectTrigger className="pl-9">{children}</SelectTrigger>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-1.5 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
      <Label className="text-xs font-medium text-muted-foreground sm:pt-2.5">{label}</Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

