"use client";

import { UseFormReturn } from "react-hook-form";
import { Wallet } from "lucide-react";

import {
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";

import { FormField } from "@/components/form";

interface Props {
  form: UseFormReturn<any>;
}

export default function VendorPaymentInfo({ form }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const fieldErrors = errors as any;

  return (
    <section className="rounded-3xl bg-emerald-50/60 p-1">
      <div className="rounded-[22px] bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Wallet size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
             Purchase & Payment Settings
            </h2>
            <p className="text-sm text-slate-500">
              Currency, terms and credit settings
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Currency"
            required
            error={fieldErrors.currencyId?.message}
          >
            <Select
              value={watch("currencyId")}
              onValueChange={(value) => setValue("currencyId", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Payment Term"
            error={fieldErrors.paymentTerm?.message}
          >
            <Input
              placeholder="e.g. 30 days"
              className="rounded-xl"
              {...form.register("paymentTerm")}
            />
          </FormField>

          <FormField
            label="Payment Mode"
            error={fieldErrors.paymentMode?.message}
          >
            <Select
              value={watch("paymentMode")}
              onValueChange={(value) => setValue("paymentMode", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="BANK">Bank</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="CHEQUE">Cheque</SelectItem>
                <SelectItem value="NEFT">NEFT</SelectItem>
                <SelectItem value="RTGS">RTGS</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Balance Type"
            error={fieldErrors.balanceType?.message}
          >
            <Select
              value={watch("balanceType")}
              onValueChange={(value) => setValue("balanceType", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select balance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEBIT">Debit</SelectItem>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="GST Slab"
            error={fieldErrors.gstSlab?.message}
          >
            <Input
              placeholder="e.g. 18%"
              className="rounded-xl"
              {...form.register("gstSlab")}
            />
          </FormField>

          <FormField
            label="Purchase Ledger"
            error={fieldErrors.purchaseLedger?.message}
          >
            <Input
              placeholder="Purchase ledger name"
              className="rounded-xl"
              {...form.register("purchaseLedger")}
            />
          </FormField>

          <FormField
            label="Credit Limit"
            error={fieldErrors.creditLimit?.message}
          >
            <Input
              type="number"
              placeholder="0"
              className="rounded-xl"
              {...form.register("creditLimit", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Opening Balance"
            error={fieldErrors.openingBalance?.message}
          >
            <Input
              type="number"
              placeholder="0"
              className="rounded-xl"
              {...form.register("openingBalance", { valueAsNumber: true })}
            />
          </FormField>
        </div>
      </div>
    </section>
  );
}
