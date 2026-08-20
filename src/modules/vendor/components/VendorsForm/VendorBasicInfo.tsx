"use client";

import { UseFormReturn } from "react-hook-form";
import { Building2 } from "lucide-react";


import {
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";

import { FormField, ImageUpload } from "@/components/form";

interface Props {
  form: UseFormReturn<any>;
}

export default function VendorBasicInfo({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const fieldErrors = errors as any;
  const logoValue = watch("logo");
  const selectedLogo = logoValue ? logoValue : null;

  return (
    <section className="rounded-3xl p-1">
      <div className="rounded-[22px] bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Vendor Information
            </h2>
            <p className="text-sm text-slate-500">
              Company identity and basic profile
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Vendor Type"
            required
            error={fieldErrors.vendorType?.message}
          >
            <Select
              value={watch("vendorType")}
              onValueChange={(value) => setValue("vendorType", value)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPPLIER">Supplier</SelectItem>
                <SelectItem value="MANUFACTURER">Manufacturer</SelectItem>
                <SelectItem value="WHOLESALER">Wholesaler</SelectItem>
                <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
                <SelectItem value="CONTRACTOR">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Vendor Name"
            required
            error={fieldErrors.vendorName?.message}
          >
            <Input
              placeholder="ABC Traders Pvt Ltd"
              className="rounded-xl"
              {...register("vendorName")}
            />
          </FormField>

          <FormField label="Legal Name" error={fieldErrors.legalName?.message}>
            <Input
              placeholder="Legal company name"
              className="rounded-xl"
              {...register("legalName")}
            />
          </FormField>

          <FormField
            label="Display Name"
            error={fieldErrors.displayName?.message}
          >
            <Input
              placeholder="Short display name"
              className="rounded-xl"
              {...register("displayName")}
            />
          </FormField>

          <FormField
            label="Business Category"
            error={fieldErrors.businessCategory?.message}
          >
            <Input
              placeholder="e.g. Manufacturer"
              className="rounded-xl"
              {...register("businessCategory")}
            />
          </FormField>


          {/* <FormField label="Email" error={fieldErrors.email?.message}>
            <Input
              type="email"
              placeholder="vendor@company.com"
              className="rounded-xl"
              {...register("email")}
            />
          </FormField> */}
{/* 
          <FormField label="Phone" error={fieldErrors.phone?.message}>
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="9876543210"
              className="rounded-xl"
              {...register("phone")}
            />
          </FormField> */}
          {/* <FormField
            label="Alternate Phone"
            error={fieldErrors.alternatevendorPhone?.message}
          >
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Alternate phone"
              className="rounded-xl"
              {...register("alternatevendorPhone")}
            />
          </FormField>

     */}

          <FormField label="Logo" error={fieldErrors.logo?.message}>
            <ImageUpload
              value={selectedLogo}
              onChange={(file) => setValue("logo", file ?? null)}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Remarks" error={fieldErrors.remarks?.message}>
              <Textarea
                placeholder="Additional notes…"
                className="min-h-25 resize-none rounded-xl"
                {...register("remarks")}
              />
            </FormField>
          </div>
        </div>
      </div>
    </section>
  );
}