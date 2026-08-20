"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  businessSetupSchema,
  BusinessSetupData,
} from "../validation";
import { businessService } from "../services/business.service";
import { notify } from "@/lib/toast";

export interface WizardStep {
  key: "info" | "address" | "branch" | "bank" | "documents" | "review";
  title: string;
  description: string;
  fields: FieldPath<BusinessSetupData>[];
}

export const wizardSteps: WizardStep[] = [
  {
    key: "info",
    title: "Business Information",
    description: "Legal identity, tax IDs & preferences",
    fields: ["info"],
  },
  {
    key: "address",
    title: "Business Address",
    description: "Registered address of the business",
    fields: ["address"],
  },
  {
    key: "branch",
    title: "Branches",
    description: "Add branches now, or skip for later",
    fields: ["branches"],
  },
  {
    key: "bank",
    title: "Bank Details",
    description: "Where payments will be settled",
    fields: ["bank"],
  },
  {
    key: "documents",
    title: "Documents",
    description: "Upload supporting documents",
    fields: ["documents"],
  },
  {
    key: "review",
    title: "Review & Submit",
    description: "Confirm everything looks right",
    fields: [],
  },
];

const defaultValues: BusinessSetupData = {
  info: {
    businessType: "retail",
    gstin: "",
    pan: "",
    legalName: "",
    tradeName: "",
    displayName: "",
    email: "",
    phone: "",
    websiteLink: "",
    businessCategoryId: "",
    industryId: "",
    registrationType: "",
    registrationNumber: "",
    tan: "",
    msme: "",
    currencyId: "inr",
    timezone: "Asia/Kolkata",
    financialYear: "2025-2026",
    description: "",
    logo: null,
  },
  address: {
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    countryId: "in",
    stateId: "",
    cityId: "",
    isPrimary: true,
  },
  branches: [],
  bank: {
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    upiId: "",
  },
  documents: [],
};

export function useBusinessSetup({ initialValues, initialBusinessId, initialTenantId }: { initialValues?: BusinessSetupData; initialBusinessId?: string; initialTenantId?: string } = {}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [savedSteps, setSavedSteps] = useState<Record<string, boolean>>({});
  const [businessId, setBusinessId] = useState<string | null>(initialBusinessId ?? null);
  const [tenantId, setTenantId] = useState<string | null>(
    initialTenantId && initialTenantId.trim() ? initialTenantId.trim() : null
  );

  const form = useForm<BusinessSetupData>({
    resolver: zodResolver(businessSetupSchema),
    mode: "onBlur",
    defaultValues: initialValues ?? defaultValues,
  });

  const currentStep = wizardSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === wizardSteps.length - 1;

  async function saveCurrentStep() {
    if (currentStep.key === "review") return;
    if (savedSteps[currentStep.key]) return;

    try {
      const result = await businessService.saveStep(
        currentStep.key,
        form.getValues(),
        businessId,
        tenantId
      );

      if (result.businessId) {
        setBusinessId(result.businessId);
      }

      if (result.tenantId) {
        setTenantId(result.tenantId);
      }

      setSavedSteps((prev) => ({ ...prev, [currentStep.key]: true }));
    } catch (err) {
      notify.error("Could not save this step. Please try again.");
      throw err;
    }
  }

  async function goNext() {
    // Validate only the current step's fields before advancing.
    const valid = await form.trigger(currentStep.fields, {
      shouldFocus: true,
    });

    if (!valid) return false;

    await saveCurrentStep();
    setStepIndex((i) => Math.min(i + 1, wizardSteps.length - 1));
    return true;
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function goToStep(index: number) {
    // Only allow jumping to a step that's already been reached.
    if (index <= stepIndex) setStepIndex(index);
  }

  async function submit() {
    const valid = await form.trigger();
    if (!valid) return;

    try {
      setSubmitting(true);
      await saveCurrentStep();
      notify.success("Business setup complete");
      router.push("/dashboard");
    } catch (err) {
      notify.error("Something went wrong while saving your business");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    steps: wizardSteps,
    stepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    submitting,
    businessId,
    tenantId,
    goNext,
    goBack,
    goToStep,
    submit,
  };
}
