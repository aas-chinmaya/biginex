"use client";

import { UseFormReturn } from "react-hook-form";
import { MapPin, Truck } from "lucide-react";

import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import { FormField } from "@/components/form";

interface Props {
  form: UseFormReturn<any>;
}

export default function VendorAddress({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const sameAsBilling = watch("sameAsBilling") ?? true;
  const billingAddressLine1Error = ((errors as any).addresses?.[0]?.addressLine1?.message as string | undefined);
  const billingAddressLine2Error = ((errors as any).addresses?.[0]?.addressLine2?.message as string | undefined);
  const billingCountryError = ((errors as any).addresses?.[0]?.countryId?.message as string | undefined);
  const billingStateError = ((errors as any).addresses?.[0]?.stateId?.message as string | undefined);
  const billingCityError = ((errors as any).addresses?.[0]?.cityId?.message as string | undefined);
  const billingPincodeError = ((errors as any).addresses?.[0]?.pincode?.message as string | undefined);
  const billingStatusError = ((errors as any).addresses?.[0]?.status?.message as string | undefined);
  const shippingAddressLine1Error = ((errors as any).shippingAddress?.addressLine1?.message as string | undefined);
  const shippingAddressLine2Error = ((errors as any).shippingAddress?.addressLine2?.message as string | undefined);
  const shippingCountryError = ((errors as any).shippingAddress?.countryId?.message as string | undefined);
  const shippingStateError = ((errors as any).shippingAddress?.stateId?.message as string | undefined);
  const shippingCityError = ((errors as any).shippingAddress?.cityId?.message as string | undefined);
  const shippingPincodeError = ((errors as any).shippingAddress?.pincode?.message as string | undefined);

  return (
    <section className="rounded-3xl bg-primary/10/60 p-1">
      <div className="rounded-[22px] bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Address</h2>
            <p className="text-sm text-slate-500">
              Billing and shipping locations for the vendor.
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Billing address</h3>
              <p className="text-sm text-slate-500">Primary location used for invoices and records.</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80">
              <Checkbox
                checked={sameAsBilling}
                onCheckedChange={(checked) => setValue("sameAsBilling", Boolean(checked))}
              />
              Same as shipping
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Address Line 1" required error={billingAddressLine1Error}>
                <Input
                  placeholder="Street / Building"
                  className="rounded-xl"
                  {...register("addresses.0.addressLine1")}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Address Line 2" error={billingAddressLine2Error}>
                <Input
                  placeholder="Area / Landmark"
                  className="rounded-xl"
                  {...register("addresses.0.addressLine2")}
                />
              </FormField>
            </div>

            <FormField label="Landmark" error={((errors as any).addresses?.[0]?.landmark?.message as string | undefined)}>
              <Input
                placeholder="Near landmark"
                className="rounded-xl"
                {...register("addresses.0.landmark")}
              />
            </FormField>

            <FormField label="District" error={((errors as any).addresses?.[0]?.district?.message as string | undefined)}>
              <Input
                placeholder="District"
                className="rounded-xl"
                {...register("addresses.0.district")}
              />
            </FormField>

            <FormField label="Country" required error={billingCountryError}>
              <Select
                value={watch("addresses.0.countryId")}
                onValueChange={(value) => setValue("addresses.0.countryId", value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="State" required error={billingStateError}>
              <Input
                placeholder="Odisha"
                className="rounded-xl"
                {...register("addresses.0.stateId")}
              />
            </FormField>

            <FormField label="City" required error={billingCityError}>
              <Input
                placeholder="Bhubaneswar"
                className="rounded-xl"
                {...register("addresses.0.cityId")}
              />
            </FormField>

            <FormField label="Pincode" required error={billingPincodeError}>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="751024"
                className="rounded-xl"
                {...register("addresses.0.pincode")}
              />
            </FormField>

            <FormField label="Address Status" error={billingStatusError}>
              <Select
                value={watch("addresses.0.status")}
                onValueChange={(value) => setValue("addresses.0.status", value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </div>

        {!sameAsBilling && (
          <div className="mt-4 rounded-2xl bg-amber-50/70 p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
                <Truck size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Shipping address</h3>
                <p className="text-sm text-slate-500">Used when delivering goods to a different location.</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Address Line 1" required error={shippingAddressLine1Error}>
                  <Input
                    placeholder="Shipping street / building"
                    className="rounded-xl"
                    {...register("shippingAddress.addressLine1")}
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Address Line 2" error={shippingAddressLine2Error}>
                  <Input
                    placeholder="Shipping area / landmark"
                    className="rounded-xl"
                    {...register("shippingAddress.addressLine2")}
                  />
                </FormField>
              </div>

              <FormField label="Landmark" error={((errors as any).shippingAddress?.landmark?.message as string | undefined)}>
                <Input
                  placeholder="Shipping landmark"
                  className="rounded-xl"
                  {...register("shippingAddress.landmark")}
                />
              </FormField>

              <FormField label="District" error={((errors as any).shippingAddress?.district?.message as string | undefined)}>
                <Input
                  placeholder="Shipping district"
                  className="rounded-xl"
                  {...register("shippingAddress.district")}
                />
              </FormField>

              <FormField label="Country" required error={shippingCountryError}>
                <Select
                  value={watch("shippingAddress.countryId")}
                  onValueChange={(value) => setValue("shippingAddress.countryId", value)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="State" required error={shippingStateError}>
                <Input
                  placeholder="Odisha"
                  className="rounded-xl"
                  {...register("shippingAddress.stateId")}
                />
              </FormField>

              <FormField label="City" required error={shippingCityError}>
                <Input
                  placeholder="Bhubaneswar"
                  className="rounded-xl"
                  {...register("shippingAddress.cityId")}
                />
              </FormField>

              <FormField label="Pincode" required error={shippingPincodeError}>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="751024"
                  className="rounded-xl"
                  {...register("shippingAddress.pincode")}
                />
              </FormField>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
