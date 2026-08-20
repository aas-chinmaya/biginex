import { businessApi } from "../../api/business.api";
import { BusinessSetupData } from "../validation";

type BackendCreateBusinessPayload = {
  businessType: string;
  gstin?: string | null;
  pan?: string | null;
  legalName: string;
  tradeName?: string | null;
  displayName: string;
  email: string;
  phone: string;
  websiteLink?: string | null;
  businessCategoryId: string;
  industryId: string;
  registrationTypeId?: string | null;
  registrationNumber?: string | null;
  tan?: string | null;
  msme?: string | null;
  currencyId: string;
  timezone: string;
  financialYear: string;
  description?: string | null;
  logo?: string | null;
};

type WizardStepKey = "info" | "address" | "branch" | "bank" | "documents" | "review";

const toBackendBusinessPayload = (
  info: BusinessSetupData["info"]
): BackendCreateBusinessPayload => ({
  businessType: info.businessType,
  gstin: info.gstin || null,
  pan: info.pan || null,
  legalName: info.legalName,
  tradeName: info.tradeName || null,
  displayName: info.displayName,
  email: info.email,
  phone: info.phone,
  websiteLink: info.websiteLink || null,
  businessCategoryId: info.businessCategoryId || "",
  industryId: info.industryId || "",
  registrationTypeId: info.registrationType || null,
  registrationNumber: info.registrationNumber || null,
  tan: info.tan || null,
  msme: info.msme || null,
  currencyId: info.currencyId || "",
  timezone: info.timezone,
  financialYear: info.financialYear,
  description: info.description || null,
  logo: null,
});

async function createBusiness(formData: BusinessSetupData) {
  const payload = {
    ...toBackendBusinessPayload(formData.info),
    logo: formData.info.logo ?? null,
  };

  const businessRes = await businessApi.createBusiness(payload);
  const business =
    (businessRes.data as { data?: { id?: string | number; tenantId?: string } } | undefined)?.data ??
    (businessRes.data as { id?: string | number; tenantId?: string } | undefined);

  const businessId = business?.id;
  const tenantId = business?.tenantId;

  if (!businessId) {
    throw new Error("Business registration did not return an id");
  }

  return {
    businessId: String(businessId),
    tenantId: tenantId ? String(tenantId) : String(businessId),
  };
}

async function createAddress(formData: BusinessSetupData, tenantId: string) {
  await businessApi.createAddress(tenantId, {
    ...formData.address,
    countryId: formData.address.countryId,
    stateId: formData.address.stateId,
    cityId: formData.address.cityId,
  });
}

async function createBranches(formData: BusinessSetupData, tenantId: string) {
  if (formData.branches.length === 0) return;

  await Promise.all(
    formData.branches.map((branch) => {
      return businessApi.createBranch(tenantId, branch);
    })
  );
}

async function createBank(formData: BusinessSetupData, tenantId: string) {
  await businessApi.createBank(tenantId, formData.bank);
}

async function createDocuments(formData: BusinessSetupData, tenantId: string) {
  if (formData.documents.length === 0) return;

  await Promise.all(
    formData.documents.map((doc) => businessApi.uploadDocument(tenantId, doc))
  );
}

async function getTenantIdForBusiness(businessId: string) {
  const result = await businessApi.getBusinessById(businessId);
  const business = (result.data as { data?: any } | undefined)?.data ?? (result.data as any);
  return String(business?.tenantId ?? businessId);
}

export const businessService = {
  async saveStep(
    stepKey: WizardStepKey,
    formData: BusinessSetupData,
    businessId?: string | null,
    tenantId?: string | null
  ) {
    switch (stepKey) {
      case "info": {
        if (businessId) {
          const payload = {
            ...toBackendBusinessPayload(formData.info),
            logo: formData.info.logo ?? null,
          };

          await businessApi.updateBusiness(businessId, payload);

          const resolvedTenantId = tenantId ?? (await getTenantIdForBusiness(businessId));
          return { businessId, tenantId: resolvedTenantId };
        }

        const created = await createBusiness(formData);
        return { businessId: created.businessId, tenantId: created.tenantId };
      }
      case "address": {
        let activeBusinessId = businessId;
        let activeTenantId = tenantId;

        if (!activeTenantId && businessId) {
          activeTenantId = await getTenantIdForBusiness(businessId);
        }

        if (!activeBusinessId) {
          const created = await createBusiness(formData);
          activeBusinessId = created.businessId;
          activeTenantId = created.tenantId;
        }

        if (!activeTenantId) {
          throw new Error("Tenant ID is required to save business address.");
        }

        await createAddress(formData, activeTenantId);
        return { businessId: activeBusinessId, tenantId: activeTenantId };
      }
      case "branch": {
        let activeBusinessId = businessId;
        let activeTenantId = tenantId;

        if (!activeTenantId && businessId) {
          activeTenantId = await getTenantIdForBusiness(businessId);
        }

        if (!activeBusinessId) {
          const created = await createBusiness(formData);
          activeBusinessId = created.businessId;
          activeTenantId = created.tenantId;
        }

        if (!activeTenantId) {
          throw new Error("Tenant ID is required to save branches.");
        }

        await createBranches(formData, activeTenantId);
        return { businessId: activeBusinessId, tenantId: activeTenantId };
      }
      case "bank": {
        let activeBusinessId = businessId;
        let activeTenantId = tenantId;

        if (!activeTenantId && businessId) {
          activeTenantId = await getTenantIdForBusiness(businessId);
        }

        if (!activeBusinessId) {
          const created = await createBusiness(formData);
          activeBusinessId = created.businessId;
          activeTenantId = created.tenantId;
        }

        if (!activeTenantId) {
          throw new Error("Tenant ID is required to save bank details.");
        }

        await createBank(formData, activeTenantId);
        return { businessId: activeBusinessId, tenantId: activeTenantId };
      }
      case "documents": {
        let activeBusinessId = businessId;
        let activeTenantId = tenantId;

        if (!activeTenantId && businessId) {
          activeTenantId = await getTenantIdForBusiness(businessId);
        }

        if (!activeBusinessId) {
          const created = await createBusiness(formData);
          activeBusinessId = created.businessId;
          activeTenantId = created.tenantId;
        }

        if (!activeTenantId) {
          throw new Error("Tenant ID is required to save documents.");
        }

        await createDocuments(formData, activeTenantId);
        return { businessId: activeBusinessId, tenantId: activeTenantId };
      }
      default:
        return { businessId, tenantId };
    }
  },

  async submitBusinessSetup(formData: BusinessSetupData) {
    const created = await createBusiness(formData);
    await createAddress(formData, created.tenantId);
    await createBranches(formData, created.tenantId);
    await createBank(formData, created.tenantId);
    await createDocuments(formData, created.tenantId);

    return created;
  },
};
