

"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";

import {
  CheckCircle2,
  FilePenLine,
  Lock,
  RotateCcw,
} from "lucide-react";

import BuyerInformationCard from "./buyer-information-card";
import InvoiceDetailsCard from "./invoice-details-card";
import InvoiceItemsCard from "./invoice-items-card";
import InvoicePaymentCard from "./invoice-payment-card";
import InvoiceAdditionalCard from "./invoice-additional-card";

import { useInvoiceForm } from "../../hooks/use-invoice-form";
import { useInvoiceActions } from "../../hooks/use-invoice-actions";
import { useInvoiceQuery } from "../../hooks/use-invoice-query";
import { useBusiness } from "../../hooks/use-business";

import type {
  InvoiceFormValues,
} from "../../types/invoice-form.types";

import {
  getRequiredFieldErrors,
  toInvoiceFormValues,
  toInvoicePayload,
  getStateCode,
} from "./invoice-form-utils";

// ==========================================================
// TYPES
// ==========================================================

interface EditInvoiceWrapperProps {
  invoiceId: string;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function EditInvoiceWrapper({
  invoiceId,
}: EditInvoiceWrapperProps) {
  const router = useRouter();

  // ========================================================
  // FORM
  // ========================================================

  const form = useInvoiceForm();

  // ========================================================
  // BUSINESS
  // ========================================================

  const { business } = useBusiness();

  // ========================================================
  // INVOICE QUERY
  // ========================================================

  const {
    selectedDraft,
    loading,
    getDraftById,
  } = useInvoiceQuery();

  // ========================================================
  // INVOICE ACTIONS
  // ========================================================

  const {
    updateDraft,
    createInvoice,
  } = useInvoiceActions();

  // ========================================================
  // PREVENT DUPLICATE FETCH
  // ========================================================

  const fetchedInvoiceRef =
    useRef<string | null>(null);

  useEffect(() => {
    if (!invoiceId) {
      return;
    }

    if (
      fetchedInvoiceRef.current === invoiceId
    ) {
      return;
    }

    fetchedInvoiceRef.current = invoiceId;

    void getDraftById(invoiceId);

    // getDraftById may have unstable reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  // ========================================================
  // API -> FORM VALUES
  // ========================================================

  const initialValues =
    useMemo<InvoiceFormValues | null>(() => {
      if (!selectedDraft) {
        return null;
      }

      const values =
        toInvoiceFormValues(
          selectedDraft as Record<string, unknown>,
        );

      const billingStateCode =
        String(
          values.billingStateCode ?? "",
        ).trim() ||
        String(
          values.placeOfSupplyCode ?? "",
        ).trim() ||
        getStateCode(
          values.billingState,
        ) ||
        getStateCode(
          values.placeOfSupply,
        ) ||
        String(
          business.sellerStateCode ?? "",
        ).trim();

      return {
        ...values,

        // ==================================================
        // BUSINESS
        // ==================================================

        businessId:
          business.id ||
          values.businessId,

        branchId:
          business.branchId ||
          values.branchId,

        createdBy:
          business.createdBy ||
          values.createdBy,

        // ==================================================
        // BILLING = SHIPPING
        // ==================================================

        sameAsBilling: true,

        shippingAddressLine1:
          values.billingAddressLine1 ?? "",

        shippingAddressLine2:
          values.billingAddressLine2 ?? "",

        shippingCity:
          values.billingCity ?? "",

        shippingState:
          values.billingState ?? "",

        shippingStateCode:
          billingStateCode,

        shippingPincode:
          values.billingPincode ?? "",

        shippingCountry:
          values.billingCountry ??
          "India",

        // ==================================================
        // STATE CODES
        // ==================================================

        billingStateCode:
          billingStateCode,

        placeOfSupplyCode:
          String(
            values.placeOfSupplyCode ?? "",
          ).trim() ||
          getStateCode(
            values.placeOfSupply,
          ) ||
          billingStateCode,
      };
    }, [
      selectedDraft,
      business,
    ]);

  // ========================================================
  // INITIALIZE FORM
  // ========================================================

  const initializedInvoiceRef =
    useRef<string | null>(null);

  useEffect(() => {
    if (
      !selectedDraft ||
      !initialValues
    ) {
      return;
    }

    const draftId = String(
      (
        selectedDraft as Record<
          string,
          unknown
        >
      ).id ?? invoiceId,
    );

    if (
      initializedInvoiceRef.current ===
      draftId
    ) {
      return;
    }

    initializedInvoiceRef.current =
      draftId;

    form.reset({
      ...initialValues,

      // ====================================================
      // BUSINESS CONTEXT
      // ====================================================

      businessId:
        business.id,

      branchId:
        business.branchId,

      createdBy:
        business.createdBy,

      // ====================================================
      // SELLER
      // ====================================================

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

      // ====================================================
      // BILLING = SHIPPING
      // ====================================================

      sameAsBilling: true,

      shippingAddressLine1:
        initialValues.billingAddressLine1 ??
        "",

      shippingAddressLine2:
        initialValues.billingAddressLine2 ??
        "",

      shippingCity:
        initialValues.billingCity ??
        "",

      shippingState:
        initialValues.billingState ??
        "",

      shippingStateCode:
        initialValues.billingStateCode ??
        initialValues.placeOfSupplyCode ??
        getStateCode(
          initialValues.billingState,
        ) ??
        getStateCode(
          initialValues.placeOfSupply,
        ) ??
        String(
          business.sellerStateCode ?? "",
        ).trim(),

      shippingPincode:
        initialValues.billingPincode ??
        "",

      shippingCountry:
        initialValues.billingCountry ??
        "India",

      // ====================================================
      // STATE CODES
      // ====================================================

      billingStateCode:
        initialValues.billingStateCode ??
        initialValues.placeOfSupplyCode ??
        getStateCode(
          initialValues.billingState,
        ) ??
        getStateCode(
          initialValues.placeOfSupply,
        ) ??
        String(
          business.sellerStateCode ?? "",
        ).trim(),

      placeOfSupplyCode:
        initialValues.placeOfSupplyCode ??
        getStateCode(
          initialValues.placeOfSupply,
        ) ??
        initialValues.billingStateCode ??
        getStateCode(
          initialValues.billingState,
        ) ??
        String(
          business.sellerStateCode ?? "",
        ).trim(),
    });
  }, [
    selectedDraft,
    initialValues,
    business,
    form,
    invoiceId,
  ]);

  // ========================================================
  // VALIDATION
  // ========================================================

const validateInvoice = (
  values: InvoiceFormValues,
): boolean => {
  const errors =
    getRequiredFieldErrors(values);

  console.log(
    "EDIT VALIDATION ERRORS:",
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
  // BUILD PAYLOAD
  // ========================================================

  const buildPayload = (
    values: InvoiceFormValues,
  ): Record<string, unknown> => {
    const payload =
      toInvoicePayload(values);

    // ======================================================
    // BUSINESS CONTEXT
    // ======================================================

    payload.businessId =
      business.id;

    payload.branchId =
      business.branchId;

    payload.createdBy =
      business.createdBy;

    // ======================================================
    // INVOICE DATE
    // ======================================================

    if (
      values.invoiceDate?.trim()
    ) {
      const date =
        new Date(
          values.invoiceDate,
        );

      if (
        !Number.isNaN(
          date.getTime(),
        )
      ) {
        payload.invoiceDate =
          date.toISOString();
      } else {
        payload.invoiceDate =
          undefined;
      }
    } else {
      payload.invoiceDate =
        undefined;
    }

    // ======================================================
    // BILLING STATE CODE
    // ======================================================

    const resolvedBillingStateCode =
      String(
        values.billingStateCode ?? "",
      ).trim() ||
      String(
        values.placeOfSupplyCode ?? "",
      ).trim() ||
      getStateCode(
        values.billingState,
      ) ||
      getStateCode(
        values.placeOfSupply,
      ) ||
      String(
        business.sellerStateCode ?? "",
      ).trim();

    // ======================================================
    // PLACE OF SUPPLY CODE
    // ======================================================

    const resolvedPlaceOfSupplyCode =
      String(
        values.placeOfSupplyCode ?? "",
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

    // ======================================================
    // BILLING = SHIPPING
    // ======================================================

    payload.sameAsBilling = true;

    payload.shippingAddressLine1 =
      values.billingAddressLine1;

    payload.shippingAddressLine2 =
      values.billingAddressLine2;

    payload.shippingCity =
      values.billingCity;

    payload.shippingState =
      values.billingState;

    payload.shippingStateCode =
      resolvedBillingStateCode ||
      undefined;

    payload.shippingPincode =
      values.billingPincode;

    payload.shippingCountry =
      values.billingCountry;

    return payload;
  };

  // ========================================================
  // UPDATE DRAFT
  // ========================================================

  const handleUpdateDraft = async (
    values: InvoiceFormValues,
  ) => {
    if (
      !validateInvoice(values)
    ) {
      return;
    }

    if (
      !business.id ||
      !business.branchId ||
      !business.createdBy
    ) {
      notify.error(
        "Business, branch, or user information is missing.",
      );

      return;
    }

    try {
      const payload =
        buildPayload(values);

      console.debug(
        "updateDraft payload:",
        payload,
      );

      await updateDraft(
        invoiceId,
        payload as never,
      ).unwrap();

      notify.success(
        "Draft updated successfully",
      );

      router.push(
        "/sales/invoice",
      );
    } catch (error) {
      console.error(
        "Failed to update draft invoice:",
        error,
      );

      notify.error(
        "Failed to update draft invoice",
      );
    }
  };

  // ========================================================
  // FINALIZE
  //
  // IMPORTANT:
  // Uses the SAME createInvoice(payload) action
  // as CreateInvoiceWrapper.
  // ========================================================

  const handleFinalize = async (
    values: InvoiceFormValues,
  ) => {
    if (
      !validateInvoice(values)
    ) {
      return;
    }

    if (
      !business.id ||
      !business.branchId ||
      !business.createdBy
    ) {
      notify.error(
        "Business, branch, or user information is missing.",
      );

      return;
    }

    try {
      const payload =
        buildPayload(values);

      console.debug(
        "finalize -> createInvoice payload:",
        payload,
      );

      // ====================================================
      // SAME CREATE API AS CREATE INVOICE
      // ====================================================

      await createInvoice(
        payload,
      ).unwrap();

      notify.success(
        "Invoice finalized successfully",
      );

      router.push(
        "/sales/invoice",
      );
    } catch (error) {
      console.error(
        "Failed to finalize invoice:",
        error,
      );

      notify.error(
        "Failed to finalize invoice",
      );
    }
  };

  // ========================================================
  // RESET
  // ========================================================

  const handleReset = () => {
    if (!initialValues) {
      return;
    }

    const billingStateCode =
      String(
        initialValues.billingStateCode ??
          "",
      ).trim() ||
      String(
        initialValues.placeOfSupplyCode ??
          "",
      ).trim() ||
      getStateCode(
        initialValues.billingState,
      ) ||
      getStateCode(
        initialValues.placeOfSupply,
      ) ||
      String(
        business.sellerStateCode ?? "",
      ).trim();

    form.reset({
      ...initialValues,

      // ====================================================
      // BUSINESS
      // ====================================================

      businessId:
        business.id,

      branchId:
        business.branchId,

      createdBy:
        business.createdBy,

      // ====================================================
      // SELLER
      // ====================================================

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

      // ====================================================
      // BILLING = SHIPPING
      // ====================================================

      sameAsBilling: true,

      shippingAddressLine1:
        initialValues.billingAddressLine1 ??
        "",

      shippingAddressLine2:
        initialValues.billingAddressLine2 ??
        "",

      shippingCity:
        initialValues.billingCity ??
        "",

      shippingState:
        initialValues.billingState ??
        "",

      shippingStateCode:
        billingStateCode,

      shippingPincode:
        initialValues.billingPincode ??
        "",

      shippingCountry:
        initialValues.billingCountry ??
        "India",

      billingStateCode:
        billingStateCode,

      placeOfSupplyCode:
        initialValues.placeOfSupplyCode ??
        getStateCode(
          initialValues.placeOfSupply,
        ) ??
        billingStateCode,
    });
  };

  // ========================================================
  // LOADING
  // ========================================================

  if (
    loading &&
    !selectedDraft
  ) {
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-gray-400">
              Loading invoice...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // NO INVOICE
  // ========================================================

  if (!selectedDraft) {
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-gray-400">
              Loading invoice...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // INVOICE STATUS
  // ========================================================

  const invoiceStatus =
    String(
      (
        selectedDraft as Record<
          string,
          unknown
        >
      ).invoiceStatus ??
        "DRAFT",
    ).toUpperCase();

  const isFinalized =
    invoiceStatus !== "DRAFT";

  // ========================================================
  // FINALIZED INVOICE
  // ========================================================

  if (isFinalized) {
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <Lock className="mt-0.5 size-4 shrink-0" />

          <div>
            <p className="font-medium">
              This invoice is finalized.
            </p>

            <p className="mt-1">
              Finalized invoices are
              read-only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(
          handleFinalize,
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

                Discard changes
              </Button>

              {/* UPDATE DRAFT */}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void form.handleSubmit(
                    handleUpdateDraft,
                  )()
                }
                className="gap-2"
              >
                <FilePenLine className="size-4" />

                Update Draft
              </Button>

              {/* FINALIZE */}

              <Button
                type="submit"
                className="gap-2"
              >
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