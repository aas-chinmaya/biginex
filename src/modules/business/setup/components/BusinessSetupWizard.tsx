"use client";

import { FormProvider } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui";

import { useBusinessSetup } from "../hooks/useBusinessSetup";
import { BusinessSetupData } from "../validation";
import StepIndicator from "./StepIndicator";

import BusinessInfoStep from "./steps/BusinessInfoStep";
import AddressStep from "./steps/AddressStep";
import BranchStep from "./steps/BranchStep";
import BankStep from "./steps/BankStep";
import DocumentsStep from "./steps/DocumentsStep";
import ReviewStep from "./steps/ReviewStep";

interface BusinessSetupWizardProps {
  initialValues?: BusinessSetupData;
  initialBusinessId?: string;
  initialTenantId?: string;
}

export default function BusinessSetupWizard({
  initialValues,
  initialBusinessId,
  initialTenantId,
}: BusinessSetupWizardProps = {}) {
  const {
    form,
    steps,
    stepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    submitting,
    goNext,
    goBack,
    goToStep,
    submit,
  } = useBusinessSetup({
    initialValues,
    initialBusinessId,
    initialTenantId,
  });

  const renderStep = () => {
    switch (currentStep.key) {
      case "info":
        return <BusinessInfoStep />;
      case "address":
        return <AddressStep />;
      case "branch":
        return <BranchStep />;
      case "bank":
        return <BankStep />;
      case "documents":
        return <DocumentsStep />;
      case "review":
        return <ReviewStep onEdit={goToStep} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-full w-full">
        {/* Full-width wizard shell. The previous max-w-5xl constraint caused the
            large unused area on the right side of the application. */}
        <div className="flex min-h-[calc(100vh-64px)] w-full flex-col">
          <StepIndicator
            steps={steps}
            stepIndex={stepIndex}
            onStepClick={goToStep}
          />

          <main className="min-h-0 flex-1 w-full">
            <div className="mx-auto w-full py-6 sm:py-7 lg:py-8">
              <div className="w-full">{renderStep()}</div>
            </div>
          </main>

          {/* Sticky-looking action bar with the same full-width alignment as the
              content above, instead of a narrow centered footer. */}
          <div className="border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="mx-auto flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isFirstStep || submitting}
                className="min-w-[108px] rounded-lg border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-500 sm:flex">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Progress saved automatically
              </div>

              {isLastStep ? (
                <Button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="min-w-[160px] rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={goNext}
                  className="min-w-[116px] rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}