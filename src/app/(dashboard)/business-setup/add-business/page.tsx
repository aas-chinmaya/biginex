

import { BusinessSetupWizard } from "@/modules/business/setup";

export default function BusinessSetupPage() {
  return (
    <main className="flex h-full w-full min-w-full flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Setup Your Business
        </h2>

        <p className="mt-2 text-muted">
          Configure your business information, address, branches, bank
          details and documents before you start using Biznex.
        </p>
      </div>

      <div className="flex h-full w-full min-w-full overflow-hidden rounded-2xl">
        <BusinessSetupWizard />
      </div>
    </main>
  );
}