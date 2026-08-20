"use client";

import { useFormContext } from "react-hook-form";
import { Landmark, Info, Wifi } from "lucide-react";

import { Input } from "@/components/ui";
import { FormField } from "@/components/form";

import SectionHeader from "../SectionHeader";
import { BusinessSetupData } from "../../validation";

const SECTION_CLASS =
  "rounded-xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm";

function maskAccount(num?: string) {
  if (!num) return "•••• •••• ••••";
  const clean = num.replace(/\s+/g, "");
  if (clean.length <= 4) return clean.padStart(4, "•");
  const last4 = clean.slice(-4);
  return `•••• •••• ${last4}`;
}

export default function BankStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BusinessSetupData>();

  const e = errors.bank;

  const accountHolderName = watch("bank.accountHolderName");
  const bankName = watch("bank.bankName");
  const accountNumber = watch("bank.accountNumber");
  const ifscCode = watch("bank.ifscCode");

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-primary/10 bg-primary/5 p-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Info className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-gray-600">
          These bank details are used for settlements and will appear on
          invoices where a payee account is required.
        </p>
      </div>

      {/* Live card preview - light */}
      <div className="relative overflow-hidden rounded-lg bg-white p-6 sm:p-7 border border-slate-100">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 opacity-40" />

        <div className="relative flex items-center justify-between">
          <Landmark className="h-6 w-6 text-slate-700" />
          <Wifi className="h-5 w-5 rotate-90 text-slate-400" />
        </div>

        <p className="relative mt-6 font-mono text-lg tracking-[0.2em] text-slate-800 sm:text-xl">
          {maskAccount(accountNumber)}
        </p>

        <div className="relative mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Account Holder
            </p>
            <p className="truncate text-sm font-medium uppercase tracking-wide text-slate-900">
              {accountHolderName || "Your Name Here"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              IFSC
            </p>
            <p className="text-sm font-medium uppercase text-slate-800">
              {ifscCode || "----------"}
            </p>
          </div>
        </div>

        <p className="relative mt-1 text-xs text-slate-500">
          {bankName || "Bank name will appear here"}
        </p>
      </div>

      <section className={SECTION_CLASS}>
        <SectionHeader
          icon={Landmark}
          tint="blue"
          title="Bank Account"
          subtitle="Used for settlements and payout reconciliation"
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            label="Account Holder Name"
            required
            error={e?.accountHolderName?.message}
          >
            <Input
              {...register("bank.accountHolderName")}
              placeholder="ABC Pvt Ltd"
            />
          </FormField>

          <FormField
            label="Bank Name"
            required
            error={e?.bankName?.message}
          >
            <Input
              {...register("bank.bankName")}
              placeholder="State Bank of India"
            />
          </FormField>

          <FormField
            label="Account Number"
            required
            error={e?.accountNumber?.message}
          >
            <Input
              {...register("bank.accountNumber")}
              placeholder="123456789012"
            />
          </FormField>

          <FormField
            label="IFSC / SWIFT Code"
            required
            error={e?.ifscCode?.message}
          >
            <Input
              {...register("bank.ifscCode")}
              placeholder="SBIN0001234"
              className="uppercase"
            />
          </FormField>

          <FormField label="Branch" required error={e?.branch?.message}>
            <Input
              {...register("bank.branch")}
              placeholder="Bhubaneswar Main"
            />
          </FormField>

          <FormField label="UPI ID" error={e?.upiId?.message}>
            <Input {...register("bank.upiId")} placeholder="company@upi" />
          </FormField>
        </div>
      </section>
    </div>
  );
}
