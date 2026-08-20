"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import VendorForm from "@/modules/vendor/components/VendorsForm/VendorForm";
import { vendorApi } from "@/modules/vendor/api/vendor.api";
import { buildVendorPayload } from "@/modules/vendor/hooks/usevendor";
import { notify } from "@/lib/toast";

const resolveWebsiteLink = (value?: string) => {
  if (!value) return "";

  try {
    new URL(value);
    return value;
  } catch {
    return "";
  }
};

const normalizeStatus = (value?: string) => {
  const normalized = String(value ?? "").trim().toUpperCase();
  return ["ACTIVE", "INACTIVE", "BLOCKED"].includes(normalized)
    ? normalized
    : "ACTIVE";
};

const normalizeDocumentUrl = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?.view ?? value?.download ?? "";
};

const mapVendorToFormValues = (vendor: any) => {
  const addressSource = vendor.addresses?.[0] ?? vendor.address ?? {};
  const shippingSource = vendor.shippingAddress ?? {};
  const contactSource = vendor.contacts?.[0] ?? vendor.contact ?? {};
  const bankSource = vendor.banks?.[0] ?? vendor.bank ?? {};
  const purchaseSource = vendor.purchase ?? {};
  const taxSource = vendor.tax ?? {};

  const phoneValue =
    contactSource.vendorPhone ??
    contactSource.mobile ??
    vendor.phone ??
    vendor.vendorPhone ??
    "";

  const emailValue =
    contactSource.contactemail ??
    contactSource.email ??
    vendor.email ??
    vendor.vendorEmail ??
    "";

  return {
    ...vendor,
    vendorCode: vendor.vendorCode ?? "",
    tenantId: vendor.tenantId ?? "tenant001",
    vendorName: vendor.vendorName ?? "",
    legalName: vendor.legalName ?? "",
    displayName: vendor.displayName ?? "",
    vendorType: vendor.vendorType ?? "",
    businessCategory: vendor.businessCategory ?? "",
    status: normalizeStatus(vendor.status),
    remarks: vendor.remarks ?? "",
    logo: vendor.logoUrl?.view ?? vendor.logo ?? null,
    createdBy: vendor.createdBy ?? "user001",
    gstin: taxSource.gstin ?? "",
    pan: taxSource.pan ?? "",
    email: emailValue,
    phone: phoneValue,
    alternatevendorPhone:
      vendor.alternatevendorPhone ?? contactSource.alternatevendorPhone ?? "",
    websiteLink: resolveWebsiteLink(vendor.websiteLink) || resolveWebsiteLink(contactSource.website) || "",
    currencyId: purchaseSource.currency ?? "INR",
    paymentTerm: purchaseSource.paymentTerms ?? "",
    paymentMode: purchaseSource.paymentMode ?? "",
    creditLimit: Number(purchaseSource.creditLimit ?? 0),
    openingBalance: Number(purchaseSource.openingBalance ?? 0),
    sameAsBilling:
      typeof addressSource.isShippingSameAsBilling === "boolean"
        ? addressSource.isShippingSameAsBilling
        : true,
    addresses: [
      {
        addressLine1:
          addressSource.billingAddressLine1 ?? addressSource.addressLine1 ?? "",
        addressLine2:
          addressSource.billingAddressLine2 ?? addressSource.addressLine2 ?? "",
        countryId:
          addressSource.billingCountry ?? addressSource.countryId ?? "",
        stateId:
          addressSource.billingState ?? addressSource.stateId ?? "",
        cityId:
          addressSource.billingCity ?? addressSource.cityId ?? "",
        pincode:
          addressSource.billingPincode ?? addressSource.pincode ?? "",
        isBilling: true,
        isShipping:
          typeof addressSource.isShippingSameAsBilling === "boolean"
            ? addressSource.isShippingSameAsBilling
            : true,
        status: "Active",
        shippingAddressLine1:
          addressSource.shippingAddressLine1 ?? shippingSource.addressLine1 ?? "",
        shippingAddressLine2:
          addressSource.shippingAddressLine2 ?? shippingSource.addressLine2 ?? "",
      },
    ],
    shippingAddress: {
      addressLine1:
        shippingSource.addressLine1 ?? addressSource.shippingAddressLine1 ?? "",
      addressLine2:
        shippingSource.addressLine2 ?? addressSource.shippingAddressLine2 ?? "",
      countryId:
        shippingSource.countryId ?? addressSource.shippingCountry ?? "",
      stateId:
        shippingSource.stateId ?? addressSource.shippingState ?? "",
      cityId:
        shippingSource.cityId ?? addressSource.shippingCity ?? "",
      pincode:
        shippingSource.pincode ?? addressSource.shippingPincode ?? "",
      isBilling: false,
      isShipping: true,
      status: "Active",
    },
    contacts: [
      {
        name: contactSource.contactPerson ?? contactSource.name ?? "",
        designation: contactSource.designation ?? "",
        mobile:
          contactSource.mobile ?? contactSource.vendorPhone ?? phoneValue ?? "",
        vendorPhone: contactSource.vendorPhone ?? contactSource.mobile ?? phoneValue ?? "",
        email: contactSource.email ?? contactSource.contactemail ?? emailValue ?? "",
        contactemail: emailValue,
        alternateMobile: contactSource.alternateMobile ?? "",
        alternatevendorPhone: contactSource.alternatevendorPhone ?? "",
        website: contactSource.website ?? "",
      },
    ],
    banks: [
      {
        accountHolder: bankSource.accountHolder ?? "",
        bankName: bankSource.bankName ?? "",
        accountNumber: bankSource.accountNumber ?? "",
        ifscCode: bankSource.ifsc ?? bankSource.ifscCode ?? "",
        branch: bankSource.branch ?? "",
        upiId: bankSource.upiId ?? "",
        accountType: bankSource.accountType ?? "",
        isPrimary: true,
      },
    ],
    documents:
      vendor.documents?.map((doc: any) => ({
        documentType: doc.documentType ?? doc.type ?? "OTHER",
        fileUrl: normalizeDocumentUrl(doc.fileUrl ?? doc.url),
        id: doc.id,
        originalName: doc.originalName ?? doc.fileName ?? "",
      })) ?? [],
  };
};

export default function EditVendorPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params?.vendorId as string | undefined;

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) return;

    const loadVendor = async () => {
      try {
        setLoading(true);
        const response = await vendorApi.getById(vendorId);
        const rawVendor = response?.data?.data ?? null;
        setVendor(rawVendor ? mapVendorToFormValues(rawVendor) : null);
      } catch (err: any) {
        console.error("Failed to load vendor", err);
        setError(err?.response?.data?.message || "Unable to load vendor details.");
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, [vendorId]);

  const handleSubmit = async (data: any) => {
    // console.log("EditVendorPage handleSubmit", { vendorId, data });
    if (!vendorId) return;
    setSaving(true);

    try {
      const payload = buildVendorPayload(data);
      // console.log("EditVendorPage update payload", payload);
      await vendorApi.update(vendorId, payload);
      notify.success("Vendor updated successfully");
      router.replace(`/vendors/${vendorId}`);
    } catch (err: any) {
      console.error("Vendor update failed", err);
      notify.error(err?.response?.data?.message || "Failed to update vendor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading vendor...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!vendor) return <div className="p-6">Vendor not found.</div>;

  return (
    <div className="p-6">
      
      <VendorForm
        loading={saving}
        mode="edit"
        onCancel={() => router.replace(`/vendors/${vendorId}`)}
        onSubmit={handleSubmit}
        onComplete={() => router.replace(`/vendors/${vendorId}`)}
        defaultValues={vendor}
      />
    </div>
  );
}
