"use client";

import { UseFormReturn } from "react-hook-form";
import { UserRound } from "lucide-react";

import { Input, Checkbox } from "@/components/ui";
import { FormField } from "@/components/form";

interface Props {
  form: UseFormReturn<any>;
}

export default function VendorContact({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const contactErrors = errors.contacts as any;

  return (
    <section className="rounded-3xl bg-primary/20/60 p-1">
      <div className="rounded-[22px] bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
            <UserRound size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Primary Contact
            </h2>
            <p className="text-sm text-slate-500">Main person to reach</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Contact Person Name"
            required
            error={contactErrors?.[0]?.name?.message}
          >
            <Input
              placeholder="Rahul Sharma"
              className="rounded-xl"
              {...register("contacts.0.name")}
            />
          </FormField>

          <FormField
            label="Designation"
            error={contactErrors?.[0]?.designation?.message}
          >
            <Input
              placeholder="Sales Manager"
              className="rounded-xl"
              {...register("contacts.0.designation")}
            />
          </FormField>

          <FormField
            label="Person Mobile"
            required
            error={contactErrors?.[0]?.mobile?.message}
          >
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="9876543210"
              className="rounded-xl"
              {...register("contacts.0.mobile")}
            />
          </FormField>

          <FormField
            label="Vendor Phone"
            error={contactErrors?.[0]?.vendorPhone?.message}
          >
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Vendor phone"
              className="rounded-xl"
              {...register("contacts.0.vendorPhone")}
            />
          </FormField>

          <FormField
            label="Contact Person Email"
            error={contactErrors?.[0]?.contactemail?.message}
          >
            <Input
              type="email"
              placeholder="contact@vendor.com"
              className="rounded-xl"
              {...register("contacts.0.contactemail")}
            />
          </FormField>

          <FormField
            label="Vendor Email"
            error={contactErrors?.[0]?.email?.message}
          >
            <Input
              type="email"
              placeholder="vendor@company.com"
              className="rounded-xl"
              {...register("contacts.0.email")}
            />
          </FormField>

          <FormField
            label=" Person Alternate Mobile"
            error={contactErrors?.[0]?.alternateMobile?.message}
          >
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Alternate mobile"
              className="rounded-xl"
              {...register("contacts.0.alternateMobile")}
            />
          </FormField>

          <FormField
            label="Alternate Vendor Phone"
            error={contactErrors?.[0]?.alternatevendorPhone?.message}
          >
            <Input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Alternate vendor phone"
              className="rounded-xl"
              {...register("contacts.0.alternatevendorPhone")}
            />
          </FormField>

          <FormField
            label="Website"
            error={contactErrors?.[0]?.website?.message}
          >
            <Input
              type="url"
              placeholder="https://vendor-website.com"
              className="rounded-xl"
              {...register("contacts.0.website")}
            />
          </FormField>

          {/* <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-primary/20/80 px-4 py-3.5 transition hover:bg-primary/20">
              <Checkbox
                checked={watch("contacts.0.isPrimary")}
                onCheckedChange={(checked) =>
                  setValue("contacts.0.isPrimary", Boolean(checked))
                }
              />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Primary contact
                </p>
                <p className="text-xs text-slate-500">
                  Default person for this vendor
                </p>
              </div>
            </label>
          </div> */}
        </div>
      </div>
    </section>
  );
}
