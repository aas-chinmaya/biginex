"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import VendorAddress from "./VendorAddress";
import VendorBank from "./VendorBank";
import VendorBasicInfo from "./VendorBasicInfo";
import VendorContact from "./VendorContact";
import VendorDocuments from "./VendorDocuments";
import VendorPaymentInfo from "./VendorPaymentInfo";
import VendorTaxInfo from "./VendorTaxInfo";
import { vendorFormSchema } from "@/modules/vendor/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  createBasicInformation,
  savePurchase,
  saveAddress,
  saveContact,
  saveBanking,
  saveGSTTax,
  uploadVendorDocument,
  markSectionSaved,
} from "@/modules/vendor/store/vendorSlice";
import { vendorApi } from "@/modules/vendor/api/vendor.api";

interface VendorFormProps {
  loading?: boolean;
  onSubmit: (data: any) => void;
  onComplete?: (data: any) => void;
  onCancel: () => void;
  defaultValues?: Record<string, any>;
  mode?: "add" | "edit";
}

const steps = [
  { id: "business", title: "Business", description: "Vendor profile" },
  { id: "payment", title: "Payment", description: "Terms & credit" },
  { id: "address", title: "Address", description: "Billing & shipping" },
  { id: "contact", title: "Contact", description: "Primary person" },
  { id: "bank", title: "Bank", description: "Account details" },
  { id: "tax", title: "Tax", description: "Compliance IDs" },
  { id: "documents", title: "Documents", description: "Certificates" },
] as const;

const buildDefaultValues = (defaults?: Record<string, any>): Record<string, any> => {
  const resolveWebsiteLink = (value?: string) => {
    if (!value) return "";

    try {
      new URL(value);
      return value;
    } catch {
      return "";
    }
  };

  const baseAddress = {
    addressLine1: "",
    addressLine2: "",
    countryId: "",
    stateId: "",
    cityId: "",
    pincode: "",
    isBilling: true,
    isShipping: true,
    status: "Active",
  };

  const baseShippingAddress = {
    addressLine1: "",
    addressLine2: "",
    countryId: "",
    stateId: "",
    cityId: "",
    pincode: "",
    isBilling: false,
    isShipping: true,
    status: "Active",
  };

  const baseContact = {
    name: "",
    designation: "",
    mobile: "",
    email: "",
    isPrimary: true,
  };

  const baseBank = {
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    upiId: "",
    accountType: "",
    cancelledCheque: "",
    isPrimary: true,
  };

  const baseDocument = {
    documentType: "",
    fileUrl: "",
  };

  const addressSource = defaults?.address ?? {};
  const contactSource = defaults?.contact ?? {};
  const bankSource = defaults?.bank ?? {};
  const taxSource = defaults?.tax ?? {};
  const purchaseSource = defaults?.purchase ?? {};
  const sameAsBilling =
    defaults?.sameAsBilling ?? addressSource.isShippingSameAsBilling ?? true;

  const normalizedAddress = {
    ...baseAddress,
    addressLine1:
      defaults?.addresses?.[0]?.addressLine1 ??
      addressSource.billingAddressLine1 ??
      addressSource.addressLine1 ??
      "",
    addressLine2:
      defaults?.addresses?.[0]?.addressLine2 ??
      addressSource.billingAddressLine2 ??
      addressSource.addressLine2 ??
      "",
    landmark:
      defaults?.addresses?.[0]?.landmark ??
      addressSource.billingLandmark ??
      "",
    district:
      defaults?.addresses?.[0]?.district ??
      addressSource.billingDistrict ??
      "",
    countryId:
      defaults?.addresses?.[0]?.countryId ??
      addressSource.billingCountry ??
      addressSource.countryId ??
      "",
    stateId:
      defaults?.addresses?.[0]?.stateId ??
      addressSource.billingState ??
      addressSource.stateId ??
      "",
    cityId:
      defaults?.addresses?.[0]?.cityId ??
      addressSource.billingCity ??
      addressSource.cityId ??
      "",
    pincode:
      defaults?.addresses?.[0]?.pincode ??
      addressSource.billingPincode ??
      addressSource.pincode ??
      "",
    status: defaults?.addresses?.[0]?.status ?? "Active",
  };

  const normalizedShippingAddress = {
    ...baseShippingAddress,
    addressLine1:
      defaults?.shippingAddress?.addressLine1 ??
      addressSource.shippingAddressLine1 ??
      "",
    addressLine2:
      defaults?.shippingAddress?.addressLine2 ??
      addressSource.shippingAddressLine2 ??
      "",
    landmark:
      defaults?.shippingAddress?.landmark ??
      addressSource.shippingLandmark ??
      "",
    district:
      defaults?.shippingAddress?.district ??
      addressSource.shippingDistrict ??
      "",
    countryId:
      defaults?.shippingAddress?.countryId ??
      addressSource.shippingCountry ??
      "",
    stateId:
      defaults?.shippingAddress?.stateId ??
      addressSource.shippingState ??
      "",
    cityId:
      defaults?.shippingAddress?.cityId ??
      addressSource.shippingCity ??
      "",
    pincode:
      defaults?.shippingAddress?.pincode ??
      addressSource.shippingPincode ??
      "",
    status: defaults?.shippingAddress?.status ?? "Active",
  };

  const normalizedContact = {
    ...baseContact,
    name:
      defaults?.contacts?.[0]?.name ??
      contactSource.contactPerson ??
      contactSource.name ??
      "",
    designation:
      defaults?.contacts?.[0]?.designation ?? contactSource.designation ?? "",
    mobile:
      defaults?.contacts?.[0]?.mobile ??
      contactSource.mobile ??
      contactSource.alternateMobile ??
      "",
    vendorPhone:
      defaults?.contacts?.[0]?.vendorPhone ??
      contactSource.vendorPhone ??
      contactSource.mobile ??
      "",
    email:
      defaults?.contacts?.[0]?.email ??
      contactSource.email ??
      contactSource.contactemail ??
      "",
    contactemail:
      defaults?.contacts?.[0]?.contactemail ??
      contactSource.contactemail ??
      contactSource.email ??
      "",
    alternateMobile:
      defaults?.contacts?.[0]?.alternateMobile ??
      contactSource.alternateMobile ??
      "",
    alternatevendorPhone:
      defaults?.contacts?.[0]?.alternatevendorPhone ??
      contactSource.alternatevendorPhone ??
      "",
    website:
      defaults?.contacts?.[0]?.website ?? contactSource.website ?? "",
  };

  const normalizedBank = {
    ...baseBank,
    accountHolder:
      defaults?.banks?.[0]?.accountHolder ?? bankSource.accountHolder ?? "",
    bankName: defaults?.banks?.[0]?.bankName ?? bankSource.bankName ?? "",
    accountNumber:
      defaults?.banks?.[0]?.accountNumber ?? bankSource.accountNumber ?? "",
    ifscCode:
      defaults?.banks?.[0]?.ifscCode ??
      bankSource.ifsc ??
      bankSource.ifscCode ??
      "",
    branch: defaults?.banks?.[0]?.branch ?? bankSource.branch ?? "",
    upiId: defaults?.banks?.[0]?.upiId ?? bankSource.upiId ?? "",
    accountType: defaults?.banks?.[0]?.accountType ?? bankSource.accountType ?? "",
    cancelledCheque:
      defaults?.banks?.[0]?.cancelledCheque ?? bankSource.cancelledCheque ?? "",
    isPrimary: defaults?.banks?.[0]?.isPrimary ?? true,
  };

  const normalizedDocuments =
    Array.isArray(defaults?.documents)
      ? defaults.documents
      : Array.isArray(defaults?.documentTypes) && defaults.documentTypes.length
        ? defaults.documentTypes.map((documentType: string) => ({
          documentType,
          fileUrl: "",
        }))
        : [];

  return {
    vendorCode: defaults?.vendorCode ?? "",
    businessId: defaults?.businessId ?? "",
    tenantId: defaults?.tenantId ?? "tenant001",
    createdBy: defaults?.createdBy ?? "user001",
    vendorType: defaults?.vendorType ?? "",
    vendorName: defaults?.vendorName ?? "",
    legalName: defaults?.legalName ?? "",
    displayName: defaults?.displayName ?? "",
    businessCategory: defaults?.businessCategory ?? "",
    remarks: defaults?.remarks ?? "",
    logo: defaults?.logo ?? defaults?.logoUrl?.view ?? "",
    gstin: defaults?.gstin ?? taxSource.gstin ?? "",
    pan: defaults?.pan ?? taxSource.pan ?? "",
    email: defaults?.email ?? defaults?.vendorEmail ?? contactSource.email ?? "",
    phone: defaults?.phone ?? defaults?.vendorPhone ?? contactSource.mobile ?? "",
    alternatevendorPhone: defaults?.alternatevendorPhone ?? "",
    websiteLink: resolveWebsiteLink(defaults?.websiteLink ?? contactSource.website ?? ""),
    currencyId: defaults?.currencyId ?? purchaseSource.currency ?? "INR",
    paymentTerm: defaults?.paymentTerm ?? purchaseSource.paymentTerms ?? "",
    paymentMode: defaults?.paymentMode ?? purchaseSource.paymentMode ?? "",
    gstSlab: defaults?.gstSlab ?? purchaseSource.gstSlab ?? "",
    purchaseLedger: defaults?.purchaseLedger ?? purchaseSource.purchaseLedger ?? "",
    creditLimit: Number(defaults?.creditLimit ?? purchaseSource.creditLimit ?? 0),
    openingBalance: Number(
      defaults?.openingBalance ?? purchaseSource.openingBalance ?? 0
    ),
    status: defaults?.status ?? "ACTIVE",
    gstType: defaults?.gstType ?? taxSource.gstType ?? "REGISTERED",
    tan: defaults?.tan ?? taxSource.tan ?? "",
    msme: defaults?.msme ?? taxSource.msme ?? "",
    cin: defaults?.cin ?? taxSource.cin ?? "",
    aadhaar: defaults?.aadhaar ?? taxSource.aadhaar ?? "",
    tdsApplicable: Boolean(
      defaults?.tdsApplicable ?? taxSource.tdsApplicable ?? false
    ),
    tdsSection: defaults?.tdsSection ?? taxSource.tdsSection ?? "",
    tcsApplicable: Boolean(
      defaults?.tcsApplicable ?? taxSource.tcsApplicable ?? false
    ),
    creditDays: Number(defaults?.creditDays ?? purchaseSource.creditDays ?? 30),
    balanceType: defaults?.balanceType ?? purchaseSource.balanceType ?? "DEBIT",
    sameAsBilling,
    addresses:
      Array.isArray(defaults?.addresses) && defaults.addresses.length
        ? defaults.addresses.map((item: any) => ({ ...baseAddress, ...item }))
        : [normalizedAddress],
    shippingAddress: defaults?.shippingAddress
      ? { ...baseShippingAddress, ...defaults.shippingAddress }
      : normalizedShippingAddress,
    contacts:
      Array.isArray(defaults?.contacts) && defaults.contacts.length
        ? defaults.contacts.map((item: any) => ({ ...baseContact, ...item }))
        : [normalizedContact],
    banks:
      Array.isArray(defaults?.banks) && defaults.banks.length
        ? defaults.banks.map((item: any) => ({ ...baseBank, ...item }))
        : [normalizedBank],
    documents: normalizedDocuments,
  };
};

export default function VendorForm({
  loading,
  onSubmit,
  onComplete,
  onCancel,
  defaultValues,
  mode = "add",
}: VendorFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [savingStep, setSavingStep] = useState(false);
  const isEditMode = mode === "edit" || Boolean(defaultValues);
  const [vendorId, setVendorId] = useState<string | null>(
    (defaultValues && (defaultValues.id || defaultValues._id || defaultValues.vendorId)) || null
  );

  const dispatch = useAppDispatch();

  const progress = useAppSelector(
    (state) => state.vendors.progress
  );

  useEffect(() => {
    console.log("VendorForm isEditMode:", isEditMode, "defaultValues:", defaultValues);
  }, [isEditMode, defaultValues]);

  const resolvedDefaultValues = useMemo(
    () => buildDefaultValues(defaultValues),
    [defaultValues]
  );

  const form = useForm<any>({
    resolver: zodResolver(vendorFormSchema as any),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: resolvedDefaultValues,
  });

  useEffect(() => {
    form.reset(resolvedDefaultValues);
  }, [resolvedDefaultValues, form]);

  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  // Fields to validate per step
  const stepValidationFields: string[][] = [
    // Step 0 - Business
    [
      "vendorType",
      "vendorName",
      "status",
      "email",
      "phone",
    ],
    // Step 1 - Payment
    [
      "currencyId",
      "paymentTerm",
      "paymentMode",
      "creditLimit",
      "openingBalance",
      "creditDays",
      "balanceType",
    ],
    // Step 2 - Address
    [
      "addresses.0.addressLine1",
      "addresses.0.addressLine2",
      "addresses.0.countryId",
      "addresses.0.stateId",
      "addresses.0.cityId",
      "addresses.0.pincode",
      "addresses.0.status",
      "sameAsBilling",
      "shippingAddress.addressLine1",
      "shippingAddress.addressLine2",
      "shippingAddress.countryId",
      "shippingAddress.stateId",
      "shippingAddress.cityId",
      "shippingAddress.pincode",
    ],
    // Step 3 - Contact
    [
      "contacts.0.name",
      "contacts.0.designation",
      "contacts.0.mobile",
      "contacts.0.contactemail",
    ],
    // Step 4 - Bank
    [
      "banks.0.accountHolder",
      "banks.0.bankName",
      "banks.0.accountNumber",
      "banks.0.ifscCode",
      "banks.0.branch",
      "banks.0.upiId",
    ],
    // Step 5 - Tax
    [
      "gstType",
      "gstin",
      "pan",
      "tan",
      "msme",
      "cin",
      "aadhaar",
      "tdsApplicable",
      "tcsApplicable",
      "tdsSection",
    ],
    // Step 6 - Documents (optional)
    ["documents"],
  ];

  const handleNext = async () => {
    const fields = stepValidationFields[activeStep] || [];

    // debug: log invocation and current step
    // eslint-disable-next-line no-console
    console.log(`handleNext called - step=${activeStep}`, { fields });

    if (activeStep === 5) {
      const hasTaxInteraction = [
        "gstType",
        "gstin",
        "pan",
        "tan",
        "msme",
        "cin",
        "aadhaar",
        "tdsApplicable",
        "tcsApplicable",
        "tdsSection",
      ].some((field) => {
        const fieldState = form.getFieldState(field as any);
        return Boolean(fieldState?.isDirty || fieldState?.isTouched);
      });

      if (!hasTaxInteraction) {
        form.setError("gstin", {
          type: "manual",
          message: "Please edit or fill a tax/compliance field before continuing",
        });
        form.setFocus("gstin");
        return;
      }

      form.clearErrors([
        "gstin",
        "pan",
        "tan",
        "msme",
        "cin",
        "aadhaar",
        "tdsSection",
      ]);
    }

    const isValid = await form.trigger(fields as any);

    // log validation result
    if (!isValid) {
      const invalidField = getFirstInvalidField(form.formState.errors as Record<string, any>, fields);
      // eslint-disable-next-line no-console
      console.warn("Validation failed for step", activeStep, { invalidField, errors: form.formState.errors });
      if (invalidField) {
        form.setFocus(invalidField);
      }

      // For debugging/dev: still attempt to call the API for the business step so you can see the network request.
      if (activeStep !== 0) return;
      // else continue to call saveStep for step 0
    }

    // If validation passed, call API for current step
    const values = form.getValues();

    const saveStep = async () => {
      setSavingStep(true);
      try {
        switch (currentStep.id) {
          case "business": {
            const targetVendorId = vendorId ?? defaultValues?.vendorId ?? defaultValues?.id ?? defaultValues?._id;
            const payload = {
              tenantId: values.tenantId ?? defaultValues?.tenantId ?? "tenant001",
              branchId: values.branchId ?? defaultValues?.branchId ?? undefined,
              vendorCode: values.vendorCode ?? defaultValues?.vendorCode ?? undefined,
              createdBy: values.createdBy ?? defaultValues?.createdBy ?? "user001",
              vendorName: values.vendorName ?? "",
              legalName: values.legalName ?? "",
              displayName: values.displayName ?? "",
              vendorType: values.vendorType ?? null,
              businessCategory: values.businessCategory ?? "",
              status: values.status ?? "ACTIVE",
              logo: values.logo ?? null,
              remarks: values.remarks ?? "",
            } as Record<string, any>;
            // log payload for debugging
            // eslint-disable-next-line no-console
            console.log("Saving basic information payload:", payload);

            if (targetVendorId) {
              await vendorApi.update(targetVendorId, payload);
            } else {
              const response = await vendorApi.createBasicInformation(payload);
              const res = response?.data?.data ?? response?.data ?? null;
              const id = [res?.id, res?._id, res?.vendorId, res?.vendorID].find(Boolean) as string | undefined;
              if (id) setVendorId(id);
            }

            dispatch(markSectionSaved("basic"));
            break;
          }

          case "payment": {
            const purchasePayload = {
              currency: values.currencyId ?? values.currency ?? "INR",
              paymentTerms: values.paymentTerm ?? values.paymentTerms ?? "",
              paymentMode: values.paymentMode ?? "BANK",
              gstSlab: values.gstSlab ?? "",
              purchaseLedger: values.purchaseLedger ?? "",
              creditLimit: Number(values.creditLimit ?? 0),
              openingBalance: Number(values.openingBalance ?? 0),
              creditDays: Number(values.creditDays ?? 0),
              balanceType: values.balanceType ?? "DEBIT",
            };

            await dispatch(savePurchase({ vendorId: vendorId ?? undefined, data: { purchase: purchasePayload } })).unwrap();
            dispatch(markSectionSaved("purchase"));
            break;
          }

          case "address": {
            const billing = values.addresses?.[0] ?? values.address ?? {};
            const shipping = values.shippingAddress ?? {};

            const addressPayload = {
              billingAddressLine1: billing.addressLine1 ?? billing.billingAddressLine1 ?? "",
              billingAddressLine2: billing.addressLine2 ?? billing.billingAddressLine2 ?? "",
              billingLandmark: billing.landmark ?? billing.billingLandmark ?? "",
              billingCountry: billing.countryId ?? billing.billingCountry ?? "",
              billingState: billing.stateId ?? billing.billingState ?? "",
              billingDistrict: billing.district ?? billing.billingDistrict ?? "",
              billingCity: billing.cityId ?? billing.billingCity ?? "",
              billingPincode: billing.pincode ?? billing.billingPincode ?? "",
            };

            const shippingPayload = {
              shippingAddressLine1: shipping.addressLine1 ?? shipping.shippingAddressLine1 ?? "",
              shippingAddressLine2: shipping.addressLine2 ?? shipping.shippingAddressLine2 ?? "",
              shippingLandmark: shipping.landmark ?? shipping.shippingLandmark ?? "",
              shippingCountry: shipping.countryId ?? shipping.shippingCountry ?? "",
              shippingState: shipping.stateId ?? shipping.shippingState ?? "",
              shippingDistrict: shipping.district ?? shipping.shippingDistrict ?? "",
              shippingCity: shipping.cityId ?? shipping.shippingCity ?? "",
              shippingPincode: shipping.pincode ?? shipping.shippingPincode ?? "",
            };

            await dispatch(saveAddress({ vendorId: vendorId ?? undefined, data: { address: addressPayload, shippingAddress: shippingPayload, sameAsBilling: Boolean(values.sameAsBilling) } })).unwrap();
            dispatch(markSectionSaved("address"));
            break;
          }

          case "contact": {
            const c = values.contacts?.[0] ?? values.contact ?? {};
            const contactPayload = {
              contactPerson: c.name ?? c.contactPerson ?? "",
              designation: c.designation ?? "",
              mobile: c.mobile ?? "",
              vendorPhone: c.vendorPhone ?? "",
              alternateMobile: c.alternateMobile ?? null,
              alternatevendorPhone: c.alternatevendorPhone ?? null,
              email: c.email ?? c.contactemail ?? "",
              contactemail: c.contactemail ?? c.email ?? "",
              website: c.website ?? "",
            };

            await dispatch(saveContact({ vendorId: vendorId ?? undefined, data: { contact: contactPayload } })).unwrap();
            dispatch(markSectionSaved("contact"));
            break;
          }

          case "bank": {
            const b = values.banks?.[0] ?? values.bank ?? {};
            const bankPayload = {
              accountHolder: b.accountHolder ?? "",
              bankName: b.bankName ?? "",
              accountNumber: b.accountNumber ?? "",
              ifsc: b.ifscCode ?? b.ifsc ?? "",
              branch: b.branch ?? "",
              upiId: b.upiId ?? "",
              accountType: b.accountType ?? undefined,
              cancelledCheque: b.cancelledCheque ?? undefined,
            };

            await dispatch(saveBanking({ vendorId: vendorId ?? undefined, data: { bank: bankPayload } })).unwrap();
            dispatch(markSectionSaved("bank"));
            break;
          }

          case "tax": {
            const payload = {
              tax: {
                gstType: values.gstType,
                gstin: values.gstin,
                pan: values.pan,
                tan: values.tan,
                msme: values.msme,
                cin: values.cin,
                aadhaar: values.aadhaar,
                tdsApplicable: values.tdsApplicable,
                tcsApplicable: values.tcsApplicable,
                tdsSection: values.tdsSection,
              },
            };
            await dispatch(saveGSTTax({ vendorId: vendorId ?? undefined, data: payload })).unwrap();
            dispatch(markSectionSaved("gst"));
            break;
          }

          case "documents": {
            const formData = new FormData();
            const docs = values.documents ?? [];
            const files = docs.filter((d: any) => d?.file);
            const documentTypes = files
              .map((d: any) => d?.documentType)
              .filter(Boolean);

            files.forEach((d: any, idx: number) => {
              formData.append("documents", d.file, d.file.name ?? `doc_${idx + 1}`);
            });

            if (files.length > 0 && documentTypes.length > 0) {
              formData.append("documentTypes", JSON.stringify(documentTypes));
            }

            if (files.length > 0) {
              if (!vendorId) throw new Error("Missing vendor id for documents upload");
              await dispatch(uploadVendorDocument({ vendorId: vendorId as string, data: formData })).unwrap();
            }

            dispatch(markSectionSaved("documents"));
            break;
          }

          default:
            break;
        }

        // proceed to next step when API succeeds
        if (!isLastStep) {
          setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
          if (onComplete) {
            onComplete(values);
          } else if (vendorId) {
            router.replace(`/vendors/${vendorId}`);
          } else {
            router.push("/vendors");
          }
        }
      } catch (err: any) {
        console.error("Save step failed", err);
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const notify = require("@/lib/toast").default;
          notify?.error(err?.message || "Failed to save section");
        } catch (_) { }
      }
      finally {
        setSavingStep(false);
      }
    };

    await saveStep();
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  const handleInvalidSubmit = (errors: Record<string, any>) => {
    console.log("VendorForm submit invalid", errors);
    const currentStepField = getFirstInvalidField(errors, stepValidationFields[activeStep] || []);

    if (currentStepField) {
      form.setFocus(currentStepField);
      return;
    }

    for (let index = 0; index < stepValidationFields.length; index += 1) {
      const invalidField = getFirstInvalidField(errors, stepValidationFields[index]);
      if (invalidField) {
        setActiveStep(index);
        form.setFocus(invalidField);
        return;
      }
    }

    if (errors.documents) {
      setActiveStep(steps.length - 1);
    }
  };

  const getFirstInvalidField = (errors: Record<string, any>, fields: string[]) => {
    for (const field of fields) {
      const path = field.split(".");
      let current: any = errors;

      for (const segment of path) {
        if (!current) {
          current = undefined;
          break;
        }
        current = current[segment];
      }

      if (!current) continue;
      if (typeof current === "object" && Object.keys(current).length > 0) {
        return field;
      }
      if (current?.message) {
        return field;
      }
    }

    return null;
  };

  const hasErrorsForStep = (stepIndex: number, errors: Record<string, any>) => {
    const fields = stepValidationFields[stepIndex] || [];
    return getFirstInvalidField(errors, fields) !== null;
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onCancel();
    } else {
      setActiveStep((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      {/* ========== Header with Back Arrow ========== */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (defaultValues) {
              onCancel();
              return;
            }
            router.back();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {isEditMode ? "Edit Vendor" : "Add New Vendor"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditMode
              ? "Update vendor details and save your changes."
              : "Fill in the details step by step"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-slate-600 mb-2">Progress: {progress}%</div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div style={{ width: `${progress}%` }} className="h-2 bg-emerald-500 rounded-full" />
        </div>
      </div>

      <form
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            const target = event.target as HTMLElement | null;
            const isTextInput =
              target instanceof HTMLInputElement ||
              target instanceof HTMLTextAreaElement;
            const isSelect = target instanceof HTMLSelectElement;

            if (isTextInput || isSelect) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          void form.handleSubmit(handleFormSubmit, handleInvalidSubmit)(event);
        }}
        className="w-full space-y-8"
      >
        {/* ========== Stepper */}
        <nav aria-label="Form progress" className="w-full overflow-x-auto pb-1">
          <ol className="flex min-w-160 items-start justify-between px-1">
            {steps.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              const isLast = index === steps.length - 1;

              return (
                <li
                  key={step.id}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {!isLast && (
                    <div
                      className={`absolute left-[50%] top-4 h-0.5 w-full ${isCompleted ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      aria-hidden
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditMode || index <= activeStep) {
                        setActiveStep(index);
                      }
                    }}
                    className="relative z-10 flex flex-col items-center gap-2"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-white transition ${isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-200 text-slate-500"
                        }`}
                    >
                      {isCompleted ? (
                        <Check size={14} strokeWidth={2.5} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="text-center">
                      <span
                        className={`block text-xs font-semibold ${isActive
                          ? "text-slate-900"
                          : isCompleted
                            ? "text-emerald-700"
                            : "text-slate-400"
                          }`}
                      >
                        {step.title}
                      </span>
                      <span className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
                        {step.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Mobile step indicator */}
        <div className="sm:hidden">
          <p className="text-xs font-medium text-slate-400">
            Step {activeStep + 1} / {steps.length}
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            {currentStep.title}
          </h2>
        </div>

        {/* ========== Step Content ========== */}
        <div className="min-h-85">
          {activeStep === 0 && <VendorBasicInfo form={form} />}
          {activeStep === 1 && <VendorPaymentInfo form={form} />}
          {activeStep === 2 && <VendorAddress form={form} />}
          {activeStep === 3 && <VendorContact form={form} />}
          {activeStep === 4 && <VendorBank form={form} />}
          {activeStep === 5 && <VendorTaxInfo form={form} />}
          {activeStep === 6 && <VendorDocuments form={form} />}
        </div>

        {/* ========== Footer Buttons ========== */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="h-11 rounded-xl px-5"
            onClick={handleBack}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} />
              {activeStep === 0 ? "Cancel" : "Back"}
            </span>
          </Button>

          <div className="hidden text-xs text-slate-400 sm:block">
            {activeStep + 1} of {steps.length}
          </div>

          {!isLastStep ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              className="h-11 rounded-xl px-6"
              onClick={handleNext}
              disabled={savingStep}
              aria-busy={savingStep}
            >
              <span className="flex items-center gap-2">
                {savingStep ? "Saving…" : "Continue"}
                <ArrowRight size={16} />
              </span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              className="h-11 rounded-xl px-8"
              onClick={handleNext}
              disabled={savingStep || loading}
              aria-busy={savingStep}
            >
              {savingStep || loading ? (isEditMode ? "Updating…" : "Saving…") : isEditMode ? "Update Vendor" : "Save Vendor"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}