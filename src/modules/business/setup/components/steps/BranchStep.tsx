"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Building2, Info, MapPin, Phone } from "lucide-react";

import {
  Input,
  Button,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { FormField } from "@/components/form";

import { useMasterData } from "../../hooks/useMasterData";
import LocationFields from "../LocationFields";
import { BusinessSetupData } from "../../validation";

const emptyBranch = {
  branchName: "",
  managerId: "",
  phone: "",
  email: "",
  pincode: "",
  countryId: "in",
  stateId: "",
  cityId: "",
  status: "active" as const,
};

const CARD =
  "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.35)]";

export default function BranchStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BusinessSetupData>();

  const { countries } = useMasterData();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
    keyName: "fieldId",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-white p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Manage your business branches
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Add each additional location that needs separate stock, billing,
            contact information or operational status.
          </p>
        </div>
      </div>

      {fields.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
            <Building2 className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            No branches added
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
            You can skip this step and create branches later from Settings.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {fields.map((field, index) => {
          const branchErrors = errors.branches?.[index];
          const status = watch(`branches.${index}.status`);
          const branchName = watch(`branches.${index}.branchName`);

          return (
            <section key={field.fieldId} className={CARD}>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                    <span className="text-sm font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {branchName || `Branch ${index + 1}`}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Branch profile & location
                    </p>
                  </div>
                  <Badge
                    variant={status === "active" ? "success" : "secondary"}
                    className="hidden sm:inline-flex"
                  >
                    {status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="shrink-0 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Remove
                </Button>
              </div>

              <div className="space-y-7 p-5 sm:p-6">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Branch details
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Contact and operational information
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      label="Branch Name"
                      error={branchErrors?.branchName?.message}
                    >
                      <Input
                        {...register(`branches.${index}.branchName`)}
                        placeholder="Bhubaneswar Branch"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/40"
                      />
                    </FormField>

                    <FormField
                      label="Phone"
                      required
                      error={branchErrors?.phone?.message}
                    >
                      <Input
                        {...register(`branches.${index}.phone`)}
                        placeholder="+91 9876543210"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/40"
                      />
                    </FormField>

                    <FormField
                      label="Email"
                      required
                      error={branchErrors?.email?.message}
                    >
                      <Input
                        type="email"
                        {...register(`branches.${index}.email`)}
                        placeholder="branch@company.com"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/40"
                      />
                    </FormField>

                    <FormField label="Status">
                      <Select
                        value={status}
                        onValueChange={(v) =>
                          setValue(
                            `branches.${index}.status`,
                            v as "active" | "inactive",
                            { shouldValidate: true }
                          )
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Branch location
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Where this branch operates
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <LocationFields
                      namePrefix={`branches.${index}`}
                      countries={countries}
                    />

                    <FormField
                      label="Pincode"
                      required
                      error={branchErrors?.pincode?.message}
                    >
                      <Input
                        {...register(`branches.${index}.pincode`)}
                        placeholder="751001"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/40"
                      />
                    </FormField>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  Branch contact details can be used for branch-level
                  communication and billing.
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ ...emptyBranch })}
        className={cn(
          "group flex w-full items-center justify-center gap-2 rounded-2xl",
          "border-2 border-dashed border-slate-200 bg-white py-5",
          "text-sm font-semibold text-slate-500 transition-all",
          "hover:border-primary/40 hover:bg-primary/[0.03] hover:text-primary"
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-primary/10">
          <Plus className="h-4 w-4" />
        </span>
        Add another branch
      </button>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Info className="h-3.5 w-3.5" />
        Branches are optional. You can add them later.
      </div>
    </div>
  );
}