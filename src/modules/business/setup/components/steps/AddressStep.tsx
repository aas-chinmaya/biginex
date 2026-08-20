"use client";

import { useFormContext } from "react-hook-form";
import { MapPin, CheckCircle2, Info, Navigation } from "lucide-react";

import { Input, Checkbox } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { FormField } from "@/components/form";

import SectionHeader from "../SectionHeader";
import { useMasterData } from "../../hooks/useMasterData";
import LocationFields from "../LocationFields";
import { BusinessSetupData } from "../../validation";

const CARD =
  "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.35)]";

export default function AddressStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BusinessSetupData>();

  const { countries } = useMasterData();
  const e = errors.address;
  const isPrimary = watch("address.isPrimary");

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-teal-200/60 bg-gradient-to-r from-teal-50 to-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Set your registered business location
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              This address is used as the official business location and can
              appear on invoices and other documents.
            </p>
          </div>
        </div>
      </div>

      <section className={CARD}>
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
          <SectionHeader
            icon={MapPin}
            tint="blue"
            title="Registered Address"
            subtitle="Enter the complete legal address of your business"
          />
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Address Line 1"
                required
                error={e?.addressLine1?.message}
              >
                <Input
                  {...register("address.addressLine1")}
                  placeholder="Street, building, area"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/40"
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Address Line 2"
                error={e?.addressLine2?.message}
              >
                <Input
                  {...register("address.addressLine2")}
                  placeholder="Landmark, suite, floor (optional)"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/40"
                />
              </FormField>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Location
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <LocationFields namePrefix="address" countries={countries} />

              <FormField
                label="Pincode"
                required
                error={e?.pincode?.message}
              >
                <Input
                  {...register("address.pincode")}
                  placeholder="751001"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/40"
                />
              </FormField>
            </div>
          </div>

          <label
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
              isPrimary
                ? "border-primary/30 bg-primary/[0.06]"
                : "border-slate-200 bg-slate-50/50 hover:border-primary/20 hover:bg-white"
            )}
          >
            <Checkbox
              checked={isPrimary}
              onCheckedChange={(v) =>
                setValue("address.isPrimary", !!v, { shouldValidate: true })
              }
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                Set as primary business address
                {isPrimary && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Use this location by default on invoices and official
                documents.
              </p>
            </div>
          </label>

          <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            Branch-specific addresses can be added in the next step.
          </div>
        </div>
      </section>
    </div>
  );
}