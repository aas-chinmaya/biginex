



"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";

import {
  CheckCircle2,
  FilePenLine,
  RotateCcw,
} from "lucide-react";

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

import { useBusiness } from "../../hooks/use-business";

import type {
  InvoiceFormValues,
} from "../../types/invoice-form.types";

import {
  getRequiredFieldErrors,
  toInvoicePayload,
  getStateCode,
} from "./invoice-form-utils";

// ==========================================================
// COMPONENT
// ==========================================================

export default function CreateInvoiceWrapper() {
  const router = useRouter();

  const form = useInvoiceForm();

  const { business } = useBusiness();

  const {
    createDraft,
    createInvoice,
  } = useInvoiceActions();

  // ========================================================
  // Populate business context
  // ========================================================

  useEffect(() => {
    if (!business) {
      return;
    }

    form.setValue(
      "businessId",
      business.id,
    );

    form.setValue(
      "branchId",
      business.branchId,
    );

    form.setValue(
      "createdBy",
      business.createdBy,
    );

    // ------------------------------------------------------
    // Seller
    // ------------------------------------------------------

    form.setValue(
      "sellerLegalName",
      business.sellerLegalName,
    );

    form.setValue(
      "sellerTradeName",
      business.sellerTradeName,
    );

    form.setValue(
      "sellerGSTIN",
      business.sellerGSTIN,
    );

    form.setValue(
      "sellerPAN",
      business.sellerPAN,
    );

    form.setValue(
      "sellerPhone",
      business.sellerPhone,
    );

    form.setValue(
      "sellerEmail",
      business.sellerEmail,
    );

    form.setValue(
      "sellerAddressLine1",
      business.sellerAddressLine1,
    );

    form.setValue(
      "sellerAddressLine2",
      business.sellerAddressLine2,
    );

    form.setValue(
      "sellerCity",
      business.sellerCity,
    );

    form.setValue(
      "sellerState",
      business.sellerState,
    );

    form.setValue(
      "sellerStateCode",
      business.sellerStateCode,
    );

    form.setValue(
      "sellerPincode",
      business.sellerPincode,
    );

    form.setValue(
      "sellerCountry",
      business.sellerCountry,
    );
  }, [business, form]);

  // ========================================================
  // Validation
  // ========================================================

const validateInvoice = (
  values: InvoiceFormValues,
): boolean => {
  const errors =
    getRequiredFieldErrors(values);

  console.log(
    "CREATE VALIDATION ERRORS:",
    errors,
  );

  if (
    Object.keys(errors).length === 0
  ) {
    return true;
  }

  Object.entries(errors).forEach(
    ([field, message]) => {
      form.setError(
        field as keyof InvoiceFormValues,
        {
          type: "manual",
          message,
        },
      );
    },
  );

  notify.error(
    "Please complete the required invoice fields.",
  );

  return false;
};
  // ========================================================
  // Build payload
  // ========================================================

  const buildPayload = (
    values: InvoiceFormValues,
  ): Record<string, unknown> => {
    const payload =
      toInvoicePayload(values);

    // ------------------------------------------------------
    // Always force context from business
    // ------------------------------------------------------

    payload.businessId =
      business.id;

    payload.branchId =
      business.branchId;

    payload.createdBy =
      business.createdBy;

    // ------------------------------------------------------
    // State codes
    // ------------------------------------------------------
 if (values.invoiceDate?.trim()) {
    const date = new Date(values.invoiceDate);

    if (!Number.isNaN(date.getTime())) {
      payload.invoiceDate = date.toISOString();
    } else {
      payload.invoiceDate = undefined;
    }
  } else {
    payload.invoiceDate = undefined;
  }

    const resolvedBillingStateCode =
      String(
        values.billingStateCode ??
          "",
      ).trim() ||
      String(
        values.placeOfSupplyCode ??
          "",
      ).trim() ||
      getStateCode(
        values.billingState,
      ) ||
      getStateCode(
        values.placeOfSupply,
      );

    const resolvedPlaceOfSupplyCode =
      String(
        values.placeOfSupplyCode ??
          "",
      ).trim() ||
      getStateCode(
        values.placeOfSupply,
      ) ||
      resolvedBillingStateCode;

    payload.billingStateCode =
      resolvedBillingStateCode ||
      undefined;

    payload.placeOfSupplyCode =
      resolvedPlaceOfSupplyCode ||
      undefined;

    // ------------------------------------------------------
    // Shipping state
    // ------------------------------------------------------

    if (
      values.sameAsBilling &&
      resolvedBillingStateCode
    ) {
      payload.shippingStateCode =
        resolvedBillingStateCode;
    }

    return payload;
  };

  // ========================================================
  // Save Draft
  // ========================================================

  const handleSaveDraft = async (
    values: InvoiceFormValues,
  ) => {
    if (!validateInvoice(values)) {
      return;
    }

    try {
      const payload =
        buildPayload(values);

      console.debug(
        "createDraft payload:",
        payload,
      );

      await createDraft(
        payload,
      ).unwrap();

      notify.success(
        "Draft saved successfully",
      );

      router.push(
        "/sales/invoice",
      );
    } catch (error) {
      console.error(
        "Failed to create draft invoice:",
        error,
      );

      notify.error(
        "Failed to save draft invoice",
      );
    }
  };

  // ========================================================
  // Create Invoice
  // ========================================================

  const handleCreateInvoice = async (
    values: InvoiceFormValues,
  ) => {
    if (!validateInvoice(values)) {
      return;
    }

    try {
      const payload =
        buildPayload(values);

      console.debug(
        "createInvoice payload:",
        payload,
      );

      await createInvoice(
        payload,
      ).unwrap();

      notify.success(
        "Invoice created successfully",
      );

      router.push(
        "/sales/invoice",
      );
    } catch (error) {
      console.error(
        "Failed to create invoice:",
        error,
      );

      notify.error(
        "Failed to create invoice",
      );
    }
  };

  // ========================================================
  // Reset
  // ========================================================

  const handleReset = () => {
    form.reset({
      ...(DEFAULT_VALUES as InvoiceFormValues),

      businessId:
        business.id,

      branchId:
        business.branchId,

      createdBy:
        business.createdBy,

      sellerLegalName:
        business.sellerLegalName,

      sellerTradeName:
        business.sellerTradeName,

      sellerGSTIN:
        business.sellerGSTIN,

      sellerPAN:
        business.sellerPAN,

      sellerPhone:
        business.sellerPhone,

      sellerEmail:
        business.sellerEmail,

      sellerAddressLine1:
        business.sellerAddressLine1,

      sellerAddressLine2:
        business.sellerAddressLine2,

      sellerCity:
        business.sellerCity,

      sellerState:
        business.sellerState,

      sellerStateCode:
        business.sellerStateCode,

      sellerPincode:
        business.sellerPincode,

      sellerCountry:
        business.sellerCountry,
    });
  };

  // ========================================================
  // Render
  // ========================================================

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(
          handleCreateInvoice,
        )}
        className="mx-auto w-full max-w-[1600px] space-y-4"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* ==================================================
              BUYER + INVOICE
          ================================================== */}

          <div className="grid min-w-0 grid-cols-1 xl:grid-cols-2">

            <div className="min-w-0 p-4 sm:p-5 lg:p-6">
              <BuyerInformationCard />
            </div>

            <div className="min-w-0 border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
              <InvoiceDetailsCard />
            </div>

          </div>

          {/* ==================================================
              ITEMS
          ================================================== */}

          <div className="border-t border-gray-200 p-4 sm:p-5 lg:p-6">
            <InvoiceItemsCard />
          </div>

          {/* ==================================================
              PAYMENT + ADDITIONAL
          ================================================== */}

          <div className="grid lg:grid-cols-2">

            <div className="border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
              <InvoicePaymentCard />
            </div>

            <div className="border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
              <InvoiceAdditionalCard />
            </div>

          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="border-t border-gray-200 bg-white p-4 sm:p-5">

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">

              {/* RESET */}

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="size-4" />

                Reset form
              </Button>

              {/* DRAFT */}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void form.handleSubmit(
                    handleSaveDraft,
                  )()
                }
                className="gap-2"
              >
                <FilePenLine className="size-4" />

                Save Draft
              </Button>

              {/* CREATE */}

              <Button
                type="submit"
                className="gap-2"
              >
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