


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";

import { CheckCircle2, FilePenLine, RotateCcw } from "lucide-react";

import BuyerInformationCard from "./buyer-information-card";
import InvoiceDetailsCard from "./invoice-details-card";
import InvoiceItemsCard from "./invoice-items-card";
import InvoicePaymentCard from "./invoice-payment-card";
import InvoiceAdditionalCard from "./invoice-additional-card";

import {
  DEFAULT_VALUES,
  useInvoiceForm,
} from "../../hooks/use-invoice-form";

import { useInvoiceActions } from "../../hooks/use-invoice-actions";

import type { InvoiceFormValues } from "../../types/invoice-form.types";

import {
  getRequiredFieldErrors,
  toInvoicePayload,
  getStateCode,
} from "./invoice-form-utils";

// ==========================================================
// TODO: replace with real values from auth / store / cookies
// ==========================================================
const BUSINESS_ID = "YOUR_BUSINESS_CUID"; // required
const BRANCH_ID = "YOUR_BRANCH_CUID"; // optional but recommended
const CREATED_BY = "YOUR_USER_CUID"; // required

export default function CreateInvoiceWrapper() {
  const router = useRouter();
  const form = useInvoiceForm();

  const { createDraft, createInvoice } = useInvoiceActions();

  useEffect(() => {
    form.setValue("businessId", BUSINESS_ID);
    form.setValue("branchId", BRANCH_ID);
    form.setValue("createdBy", CREATED_BY);
  }, [form]);

  const validateInvoice = (values: InvoiceFormValues): boolean => {
    const errors = getRequiredFieldErrors(values);

    if (Object.keys(errors).length === 0) return true;

    Object.entries(errors).forEach(([field, message]) => {
      form.setError(field as keyof InvoiceFormValues, {
        type: "manual",
        message,
      });
    });

    return false;
  };

  const buildPayload = (values: InvoiceFormValues) => {
    const payload = toInvoicePayload(values) as Record<string, unknown>;

    payload.businessId = values.businessId || BUSINESS_ID;
    payload.createdBy = values.createdBy || CREATED_BY;
    payload.branchId = values.branchId || BRANCH_ID || undefined;

    const resolvedCode =
      String(values.billingStateCode || "").trim() ||
      String(values.placeOfSupplyCode || "").trim() ||
      getStateCode(values.billingState) ||
      getStateCode(values.placeOfSupply);

    payload.billingStateCode = resolvedCode || undefined;
    payload.placeOfSupplyCode =
      String(values.placeOfSupplyCode || "").trim() ||
      resolvedCode ||
      undefined;

    if (values.sameAsBilling && resolvedCode) {
      payload.shippingStateCode = resolvedCode;
    }

    return payload;
  };

  const handleSaveDraft = async (values: InvoiceFormValues) => {
    if (!validateInvoice(values)) return;

    try {
      const payload = buildPayload(values);
      console.debug("createDraft payload:", payload);

      await createDraft(payload).unwrap();

      notify.success("Draft saved");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to create draft invoice:", error);
      notify.error("Failed to save draft");
    }
  };

  const handleCreateInvoice = async (values: InvoiceFormValues) => {
    if (!validateInvoice(values)) return;

    try {
      const payload = buildPayload(values);
      console.debug("createInvoice payload:", payload);

      await createInvoice(payload).unwrap();

      notify.success("Invoice created");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to create invoice:", error);
      notify.error("Failed to create invoice");
    }
  };

  const handleReset = () => {
    form.reset({
      ...DEFAULT_VALUES,
      businessId: BUSINESS_ID,
      branchId: BRANCH_ID,
      createdBy: CREATED_BY,
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateInvoice)}
        className="mx-auto w-full max-w-[1600px] space-y-4"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid min-w-0 grid-cols-1 xl:grid-cols-2">
            <div className="min-w-0 p-4 sm:p-5 lg:p-6">
              <BuyerInformationCard />
            </div>
            <div className="min-w-0 border-t border-gray-200 p-4 sm:p-5 lg:p-6 xl:border-l xl:border-t-0">
              <InvoiceDetailsCard />
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 sm:p-5 lg:p-6">
            <InvoiceItemsCard />
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
              <InvoicePaymentCard />
            </div>
            <div className="border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
              <InvoiceAdditionalCard />
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="size-4" />
                Reset form
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => void form.handleSubmit(handleSaveDraft)()}
                className="gap-2"
              >
                <FilePenLine className="size-4" />
                Save Draft
              </Button>

              <Button type="submit" className="gap-2">
                <CheckCircle2 className="size-4" />
                Save invoice
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}