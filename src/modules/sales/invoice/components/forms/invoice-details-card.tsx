
"use client";

import {
  Controller,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useEffect } from "react";
import {
  CalendarClock,
  FileText,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  InvoiceFormValues,
} from "../../types/invoice-form.types";

export default function InvoiceInformationCard() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } =
    useFormContext<InvoiceFormValues>();

  // ========================================================
  // Watch invoice date
  // ========================================================

  const invoiceDate = useWatch({
    control,
    name: "invoiceDate",
  });

  // ========================================================
  // Default current date + time
  //
  // IMPORTANT:
  // Only set it when the field is empty.
  //
  // So:
  // - Create invoice -> current date/time
  // - Edit invoice with existing date -> existing date
  // - Edit invoice without date -> current date/time
  // ========================================================

  useEffect(() => {
    if (
      invoiceDate &&
      String(invoiceDate).trim()
    ) {
      return;
    }

    const now = new Date();

    // datetime-local requires:
    // YYYY-MM-DDTHH:mm
    const year =
      now.getFullYear();

    const month = String(
      now.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      now.getDate(),
    ).padStart(2, "0");

    const hours = String(
      now.getHours(),
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes(),
    ).padStart(2, "0");

    const currentDateTime =
      `${year}-${month}-${day}T${hours}:${minutes}`;

    setValue(
      "invoiceDate",
      currentDateTime,
      {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      },
    );
  }, [
    invoiceDate,
    setValue,
  ]);

  // ========================================================
  // Render
  // ========================================================

  return (
    <section>
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-4" />
        </span>

        <h2 className="text-sm font-semibold text-gray-900">
          Invoice details
        </h2>
      </div>

      <div className="space-y-4 pt-4">

        {/* ==================================================
            INVOICE TYPE + CURRENCY
        ================================================== */}

        <div className="grid gap-3 sm:grid-cols-2">

          {/* Invoice Type */}

          <Field label="Invoice type">
            <Controller
              control={control}
              name="invoiceType"
              render={({ field }) => (
                <Select
                  value={
                    field.value || "B2B"
                  }
                  onValueChange={
                    field.onChange
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="B2B">
                      B2B
                    </SelectItem>

                    <SelectItem value="B2C">
                      B2C
                    </SelectItem>

                    <SelectItem value="EXPORT">
                      Export
                    </SelectItem>

                    <SelectItem value="SEZ">
                      SEZ
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          {/* Currency */}

          <Field label="Currency">
            <Input
              value="INR"
              readOnly
              aria-label="Currency"
            />

            <input
              type="hidden"
              {...register("currency")}
            />
          </Field>

        </div>

        {/* ==================================================
            INVOICE DATE & TIME
        ================================================== */}

        <div className="grid gap-3 sm:grid-cols-2">

          <Field
            label="Invoice date & time"
            error={
              errors.invoiceDate?.message
            }
          >
            <div className="relative">

              <CalendarClock
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                type="datetime-local"
                className="pl-9"
                {...register(
                  "invoiceDate",
                )}
              />

            </div>
          </Field>

        </div>

        {/* ==================================================
            HIDDEN BUSINESS CONTEXT
        ================================================== */}

        <input
          type="hidden"
          {...register("businessId")}
        />

        <input
          type="hidden"
          {...register("createdBy")}
        />

        <input
          type="hidden"
          {...register("branchId")}
        />

        {/* ==================================================
            BRANCH
        ================================================== */}

        <div className="grid gap-3 sm:grid-cols-2">

          <Field label="Branch">
            <Input
              {...register("branch")}
              placeholder="Branch name"
            />
          </Field>

        </div>

      </div>
    </section>
  );
}

// ==========================================================
// FIELD
// ==========================================================

function Field({
  label,
  children,
  required,
  error,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">

      <Label className="text-xs font-medium text-muted-foreground">
        {label}

        {required ? (
          <span className="ml-1 text-red-600">
            *
          </span>
        ) : null}
      </Label>

      {children}

      {error ? (
        <p className="text-xs text-red-600">
          {error}
        </p>
      ) : null}

    </div>
  );
}