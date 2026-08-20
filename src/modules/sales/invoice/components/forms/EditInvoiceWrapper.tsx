"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";

import { CheckCircle2, FilePenLine, Lock, RotateCcw } from "lucide-react";

import BuyerInformationCard from "./buyer-information-card";
import InvoiceDetailsCard from "./invoice-details-card";
import InvoiceItemsCard from "./invoice-items-card";
import InvoicePaymentCard from "./invoice-payment-card";
import InvoiceAdditionalCard from "./invoice-additional-card";

import { useInvoiceForm } from "../../hooks/use-invoice-form";
import { useInvoiceActions } from "../../hooks/use-invoice-actions";
import { useInvoiceQuery } from "../../hooks/use-invoice-query";

import type { InvoiceFormValues } from "../../types/invoice-form.types";

import {
  getRequiredFieldErrors,
  toInvoiceFormValues,
  toInvoicePayload,
  getStateCode,
} from "./invoice-form-utils";

// ==========================================================
// TODO: replace with real values from auth / store / cookies
// ==========================================================
const BUSINESS_ID = "YOUR_BUSINESS_CUID";
const BRANCH_ID = "YOUR_BRANCH_CUID";
const CREATED_BY = "YOUR_USER_CUID";

interface EditInvoiceWrapperProps {
  invoiceId: string;
}

export default function EditInvoiceWrapper({ invoiceId }: EditInvoiceWrapperProps) {
  const router = useRouter();

  const { selectedDraft, loading, error, getDraftById } = useInvoiceQuery();
  const { updateDraft, finalizeDraft } = useInvoiceActions();

  useEffect(() => {
    if (!invoiceId) return;
    getDraftById(invoiceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  // toInvoiceFormValues only runs once selectedDraft actually arrives, so the
  // form isn't reset on every render — only when the fetched draft changes.
  const initialValues = useMemo<InvoiceFormValues | null>(() => {
    if (!selectedDraft) return null;
    const today = new Date().toISOString().slice(0, 10);
    const values = toInvoiceFormValues(selectedDraft as Record<string, unknown>);
    return {
      ...values,
      invoiceDate: values.invoiceDate || today,
    };
  }, [selectedDraft]);

  const form = useInvoiceForm(initialValues);

  useEffect(() => {
    if (!selectedDraft) return;
    form.setValue("businessId", (selectedDraft as any).businessId || BUSINESS_ID);
    form.setValue("branchId", (selectedDraft as any).branchId || BRANCH_ID);
    form.setValue("createdBy", (selectedDraft as any).createdBy || CREATED_BY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDraft]);

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

  const handleUpdateDraft = async (values: InvoiceFormValues) => {
    if (!validateInvoice(values)) return;

    try {
      const payload = buildPayload(values);
      console.debug("updateDraft payload:", payload);

      await updateDraft(invoiceId, payload as never).unwrap();

      notify.success("Draft updated");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to update draft invoice:", error);
      notify.error("Failed to update draft");
    }
  };

  const handleFinalize = async (values: InvoiceFormValues) => {
    if (!validateInvoice(values)) return;

    try {
      const payload = buildPayload(values);
      console.debug("finalizeDraft payload:", payload);

      await finalizeDraft(invoiceId, payload as never).unwrap();

      notify.success("Invoice finalized");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to finalize draft:", error);
      notify.error("Failed to finalize invoice");
    }
  };

  const handleReset = () => {
    if (initialValues) form.reset(initialValues);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-400">
        Loading invoice...
      </div>
    );
  }

  if (error || !selectedDraft) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-400">
        {error ?? "Invoice not found."}
      </div>
    );
  }

  const draftStatus = String((selectedDraft as any).invoiceStatus ?? "Draft");
  const isFinalized =
    draftStatus.toUpperCase() !== "DRAFT" || Boolean((selectedDraft as any).invoiceNumber);

  if (isFinalized) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <Lock className="mt-0.5 size-4 shrink-0" />
        <p>
          This invoice has already been finalized and has an invoice number. Finalized invoices
          are read-only.
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFinalize)}
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
              <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="size-4" />
                Discard changes
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => void form.handleSubmit(handleUpdateDraft)()}
                className="gap-2"
              >
                <FilePenLine className="size-4" />
                Update Draft
              </Button>

              <Button type="submit" className="gap-2">
                <CheckCircle2 className="size-4" />
                Finalize invoice
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}