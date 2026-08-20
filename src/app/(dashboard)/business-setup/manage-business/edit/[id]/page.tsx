"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import Container from "@/components/common/Container";
import BusinessSetupWizard from "@/modules/business/setup/components/BusinessSetupWizard";
import { businessApi } from "@/modules/business/api/business.api";
import { BusinessSetupData } from "@/modules/business/setup/validation";

export default function EditBusinessPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<BusinessSetupData | null>(null);
  const [initialTenantId, setInitialTenantId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    setLoading(true);

    businessApi
      .getBusinessById(id)
      .then((res) => {
        const payload = (res.data as any)?.data ?? (res.data as any);

        const mapToForm = (): BusinessSetupData => {
          const info = {
            businessType: payload.businessType ?? "retail",
            gstin: payload.gstin ?? "",
            pan: payload.pan ?? "",
            legalName: payload.legalName ?? payload.displayName ?? "",
            tradeName: payload.tradeName ?? "",
            displayName: payload.displayName ?? payload.legalName ?? "",
            email: payload.email ?? "",
            phone: payload.phone ?? "",
            websiteLink: payload.websiteLink ?? payload.website ?? "",
            businessCategoryId: String(payload.businessCategoryId ?? payload.businessCategoryId ?? ""),
            industryId: String(payload.industryId ?? payload.industryId ?? ""),
            registrationType: payload.registrationTypeId ?? payload.registrationType ?? "",
            registrationNumber: payload.registrationNumber ?? "",
            tan: payload.tan ?? "",
            msme: payload.msme ?? "",
            currencyId: payload.currencyId ?? "inr",
            timezone: payload.timezone ?? "Asia/Kolkata",
            financialYear: payload.financialYear ?? "2025-2026",
            description: payload.description ?? "",
            logo: null,
          };

          const addressObj = (payload.addresses && payload.addresses[0]) || payload.address || {};
          const address = {
            addressLine1: addressObj.addressLine1 ?? addressObj.line1 ?? "",
            addressLine2: addressObj.addressLine2 ?? addressObj.line2 ?? "",
            pincode: addressObj.pincode ?? "",
            countryId: addressObj.country ?? addressObj.countryId ?? "in",
            stateId: addressObj.state ?? addressObj.stateId ?? "",
            cityId: addressObj.city ?? addressObj.cityId ?? "",
            isPrimary: addressObj.isPrimary ?? true,
          };

          const branches = (payload.branches || payload.businessBranches || []).map((b: any) => ({
            id: String(b.id ?? b.branchId ?? ""),
            branchCode: b.branchCode ?? b.code ?? "",
            branchName: b.branchName ?? b.name ?? "",
            managerId: b.userId ?? b.managerId ?? "",
            phone: b.phone ?? "",
            email: b.email ?? "",
            pincode: b.pincode ?? "",
            countryId: b.country ?? b.countryId ?? "in",
            stateId: b.state ?? b.stateId ?? "",
            cityId: b.city ?? b.cityId ?? "",
            status: b.status ?? "active",
          }));

          const bankObj = (payload.banks && payload.banks[0]) || payload.bank || {};
          const bank = {
            accountHolderName: bankObj.accountHolderName ?? bankObj.holderName ?? "",
            bankName: bankObj.bankName ?? "",
            accountNumber: bankObj.accountNumber ?? "",
            ifscCode: bankObj.ifscCode ?? "",
            branch: bankObj.branch ?? "",
            upiId: bankObj.upiId ?? "",
          };

          const documents = (payload.documents || payload.businessDocuments || []).map((d: any) => ({
            documentType: d.documentType ?? d.type ?? "",
            file: null,
            fileName: d.fileName ?? d.name ?? "",
            fileUrl: d.fileUrl ?? d.url ?? d.fileUrl ?? "",
          }));

          return {
            info,
            address,
            branches,
            bank,
            documents,
          };
        };

        if (mounted) {
          setInitialValues(mapToForm());
          const tenant = payload.tenantId ?? payload.tenantID ?? payload.tenant_id;
          setInitialTenantId(tenant && String(tenant).trim() ? String(tenant) : null);
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!id) {
    return (
      <Container className="py-8">
        <div className="text-center text-muted">Business id is missing in the URL.</div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {loading || !initialValues ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <BusinessSetupWizard initialValues={initialValues} initialBusinessId={id} initialTenantId={initialTenantId ?? undefined} />
      )}
    </Container>
  );
}
