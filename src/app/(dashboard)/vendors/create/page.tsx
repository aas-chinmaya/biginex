"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { notify } from "@/lib/toast";
import { vendorApi } from "@/modules/vendor/api/vendor.api";
import { buildVendorPayload } from "@/modules/vendor/hooks/usevendor";
import VendorForm from "@/modules/vendor/components/VendorsForm/VendorForm";

export default function CreateVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Build payload for basic-information step based on the screenshot fields
      const payload: Record<string, any> = {
        tenantId: data.tenantId ?? data.tenantId ?? "tenant001",
        createdBy: data.createdBy ?? "user001",
        vendorType: data.vendorType ?? null,
        vendorName: data.vendorName ?? "",
        legalName: data.legalName ?? "",
        displayName: data.displayName ?? "",
        businessCategory: data.businessCategory ?? "",
        status: data.status ?? "ACTIVE",
        remarks: data.remarks ?? "",
        // include contact fields if present on the form; backend can ignore extra keys
        vendorEmail: data.email ?? data.vendorEmail ?? undefined,
        vendorPhone: data.phone ?? data.vendorPhone ?? undefined,
        websiteLink: data.websiteLink ?? undefined,
        currencyId: data.currencyId ?? undefined,
      };

      // include logo file if present
      if (data.logo) payload.logo = data.logo;

      const response = await vendorApi.createBasicInformation(payload);
      const createdVendorId =
        response?.data?.data?.id || response?.data?.id || undefined;

      notify.success("Vendor saved (basic information)");
      router.push("/vendors");
    } catch (error: any) {
      console.error("Vendor basic-information failed", error);
      notify.error(
        error?.response?.data?.message || "Failed to save vendor basic information"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorForm
      loading={loading}
      mode="add"
      onCancel={() => router.push("/vendors")}
      onSubmit={handleSubmit}
      onComplete={() => router.push("/vendors")}
    />
  );
}