import { useCallback } from "react";

import { vendorService } from "@/modules/vendor/services/vendor.service";

const normalizeEnumValue = (value?: string, fallback = "") => {
  if (!value) return fallback;

  return String(value)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

const normalizeStringValue = (value?: unknown, fallback = "") => {
  if (value === null || value === undefined || value === "") return fallback;
  if (value instanceof File) return value.name;
  return String(value).trim();
};

const normalizeBooleanValue = (value?: unknown, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "off"].includes(normalized)) return false;
  }
  return fallback;
};

const normalizeNumberValue = (value?: unknown, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const normalizeDocumentType = (value?: string) => {
  if (!value) return "OTHER";

  const normalized = normalizeEnumValue(value, "OTHER");

  const allowed = [
    "GST_CERTIFICATE",
    "PAN_CARD",
    "AADHAAR_CARD",
    "MSME_CERTIFICATE",
    "UDYAM_CERTIFICATE",
    "TAN_CERTIFICATE",
    "CIN_CERTIFICATE",
    "IEC_CERTIFICATE",
    "TRADE_LICENSE",
    "SHOP_ESTABLISHMENT",
    "FSSAI_LICENSE",
    "DRUG_LICENSE",
    "PARTNERSHIP_DEED",
    "LLP_AGREEMENT",
    "INCORPORATION_CERTIFICATE",
    "MEMORANDUM_OF_ASSOCIATION",
    "ARTICLES_OF_ASSOCIATION",
    "CANCELLED_CHEQUE",
    "BANK_STATEMENT",
    "ADDRESS_PROOF",
    "ID_PROOF",
    "AGREEMENT",
    "CONTRACT",
    "PURCHASE_AGREEMENT",
    "NDA",
    "ISO_CERTIFICATE",
    "INSURANCE_CERTIFICATE",
    "OTHER",
  ];

  return allowed.includes(normalized) ? normalized : "OTHER";
};

export const useVendorImportExport = () => {
  const exportVendors = useCallback(
    async (params?: { page?: number; limit?: number; tenantId?: string }) => {
      return vendorService.exportVendors(params);
    },
    []
  );

  const downloadVendorTemplate = useCallback(
    async (params?: { page?: number; limit?: number }) => {
      return vendorService.downloadVendorTemplate(params);
    },
    []
  );

  const importVendors = useCallback(
    async (file: File, params?: Record<string, unknown>) => {
      return vendorService.importVendors(file, params);
    },
    []
  );

  return {
    exportVendors,
    downloadVendorTemplate,
    importVendors,
  };
};

export const buildVendorPayload = (data: Record<string, any>) => {
  const billingAddress = Array.isArray(data.addresses) && data.addresses[0] ? data.addresses[0] : {};
  const shippingAddress = data.shippingAddress ?? {};
  const addressSource = data.address ?? {};
  const contactSource = Array.isArray(data.contacts) && data.contacts[0]
    ? data.contacts[0]
    : data.contact ?? {};
  const bankSource = Array.isArray(data.banks) && data.banks[0]
    ? data.banks[0]
    : data.bank ?? {};
  const taxSource = data.tax ?? {};
  const purchaseSource = data.purchase ?? {};
  const documentFiles = Array.isArray(data.documents) ? data.documents : [];
  const documentTypes = Array.isArray(data.documentTypes) ? data.documentTypes : [];
  const sameAsBilling = normalizeBooleanValue(
    data.sameAsBilling ?? addressSource.isShippingSameAsBilling ?? true,
    true
  );

  return {
    tenantId: normalizeStringValue(data.tenantId, "tenant001"),
    branchId: normalizeStringValue(data.branchId, ""),
    vendorScope: normalizeStringValue(data.vendorScope, "BUSINESS"),
    createdBy: normalizeStringValue(data.createdBy, "user001"),
    vendorCode: normalizeStringValue(data.vendorCode, ""),
    vendorName: normalizeStringValue(data.vendorName, ""),
    legalName: normalizeStringValue(data.legalName ?? data.vendorName, ""),
    displayName: normalizeStringValue(data.displayName ?? data.vendorName, ""),
    vendorType: normalizeEnumValue(data.vendorType, "SUPPLIER"),
    businessCategory: normalizeStringValue(data.businessCategory ?? data.vendorType ?? "Manufacturer", "Manufacturer"),
    status: normalizeEnumValue(data.status, "ACTIVE"),
    logo: data.logo instanceof File ? data.logo : normalizeStringValue(data.logo, ""),
    remarks: normalizeStringValue(data.remarks, ""),
    websiteLink: normalizeStringValue(data.websiteLink, ""),
    alternatevendorPhone: normalizeStringValue(data.alternatevendorPhone ?? "", ""),
    currencyId: normalizeStringValue(data.currencyId, "INR"),
    paymentTerm: normalizeStringValue(data.paymentTerm ?? purchaseSource.paymentTerms, ""),
    paymentMode: normalizeEnumValue(data.paymentMode ?? purchaseSource.paymentMode, "BANK"),
    creditLimit: normalizeNumberValue(data.creditLimit ?? purchaseSource.creditLimit, 0),
    openingBalance: normalizeNumberValue(data.openingBalance ?? purchaseSource.openingBalance, 0),
    // logo: data.logo instanceof File ? data.logo : undefined,
    email: normalizeStringValue(data.email ?? data.email ?? contactSource.email, ""),
    vendorPhone: normalizeStringValue(data.phone ?? data.vendorPhone ?? contactSource.mobile, ""),
    address: {
      billingAddressLine1: normalizeStringValue(
        billingAddress.addressLine1 ?? addressSource.billingAddressLine1 ?? addressSource.addressLine1,
        ""
      ),
      billingAddressLine2: normalizeStringValue(
        billingAddress.addressLine2 ?? addressSource.billingAddressLine2 ?? addressSource.addressLine2,
        ""
      ),
      billingLandmark: normalizeStringValue(addressSource.billingLandmark ?? billingAddress.addressLine2 ?? "", ""),
      billingCountry: normalizeStringValue(
        billingAddress.countryId ?? addressSource.billingCountry ?? addressSource.countryId ?? "India",
        "India"
      ),
      billingState: normalizeStringValue(
        billingAddress.stateId ?? addressSource.billingState ?? addressSource.stateId,
        ""
      ),
      billingDistrict: normalizeStringValue(
        billingAddress.cityId ?? addressSource.billingDistrict ?? addressSource.cityId,
        ""
      ),
      billingCity: normalizeStringValue(
        billingAddress.cityId ?? addressSource.billingCity ?? addressSource.cityId,
        ""
      ),
      billingPincode: normalizeStringValue(
        billingAddress.pincode ?? addressSource.billingPincode ?? addressSource.pincode,
        ""
      ),
      shippingAddressLine1: sameAsBilling
        ? normalizeStringValue(
            billingAddress.addressLine1 ?? addressSource.billingAddressLine1 ?? addressSource.addressLine1,
            ""
          )
        : normalizeStringValue(
            shippingAddress.addressLine1 ?? addressSource.shippingAddressLine1,
            ""
          ),
      shippingAddressLine2: sameAsBilling
        ? normalizeStringValue(
            billingAddress.addressLine2 ?? addressSource.billingAddressLine2 ?? addressSource.addressLine2,
            ""
          )
        : normalizeStringValue(shippingAddress.addressLine2 ?? addressSource.shippingAddressLine2, ""),
      shippingCountry: sameAsBilling
        ? normalizeStringValue(
            billingAddress.countryId ?? addressSource.billingCountry ?? addressSource.countryId ?? "India",
            "India"
          )
        : normalizeStringValue(shippingAddress.countryId ?? addressSource.shippingCountry, ""),
      shippingState: sameAsBilling
        ? normalizeStringValue(
            billingAddress.stateId ?? addressSource.billingState ?? addressSource.stateId,
            ""
          )
        : normalizeStringValue(shippingAddress.stateId ?? addressSource.shippingState, ""),
      shippingCity: sameAsBilling
        ? normalizeStringValue(
            billingAddress.cityId ?? addressSource.billingCity ?? addressSource.cityId,
            ""
          )
        : normalizeStringValue(shippingAddress.cityId ?? addressSource.shippingCity, ""),
      shippingPincode: sameAsBilling
        ? normalizeStringValue(
            billingAddress.pincode ?? addressSource.billingPincode ?? addressSource.pincode,
            ""
          )
        : normalizeStringValue(shippingAddress.pincode ?? addressSource.shippingPincode, ""),
      isShippingSameAsBilling: sameAsBilling,
    },
    contact: {
      contactPerson: normalizeStringValue(contactSource.name ?? contactSource.contactPerson, ""),
      designation: normalizeStringValue(contactSource.designation, ""),
      mobile: normalizeStringValue(
        contactSource.mobile ??
          contactSource.alternateMobile ??
          data.phone ??
          data.vendorPhone ??
          "",
        ""
      ),
      vendorPhone: normalizeStringValue(
        contactSource.vendorPhone ?? data.phone ?? data.vendorPhone ?? "",
        ""
      ),
      alternatevendorPhone: normalizeStringValue(
        contactSource.alternatevendorPhone ?? data.alternatevendorPhone ?? "",
        ""
      ),
      alternateMobile: normalizeStringValue(
        contactSource.alternateMobile ?? contactSource.mobile ?? data.phone ?? "",
        ""
      ),
      email: normalizeStringValue(
        contactSource.contactemail ?? contactSource.email ?? data.email ?? data.email ?? "",
        ""
      ),
      contactemail: normalizeStringValue(
        contactSource.contactemail ?? contactSource.email ?? data.email ?? data.vendorEmail ?? "",
        ""
      ),
      website: normalizeStringValue(
        contactSource.website ?? data.websiteLink ?? "",
        ""
      ),
    },
    tax: {
      gstType: normalizeEnumValue(data.gstType ?? taxSource.gstType, "REGISTERED"),
      gstin: normalizeStringValue(data.gstin ?? taxSource.gstin, ""),
      pan: normalizeStringValue(data.pan ?? taxSource.pan, ""),
      tan: normalizeStringValue(data.tan ?? taxSource.tan, ""),
      msme: normalizeStringValue(data.msme ?? taxSource.msme, ""),
      cin: normalizeStringValue(data.cin ?? taxSource.cin, ""),
      aadhaar: normalizeStringValue(data.aadhaar ?? taxSource.aadhaar, ""),
      tdsApplicable: normalizeBooleanValue(data.tdsApplicable ?? taxSource.tdsApplicable, false),
      tdsSection: normalizeStringValue(data.tdsSection ?? taxSource.tdsSection, ""),
      tcsApplicable: normalizeBooleanValue(data.tcsApplicable ?? taxSource.tcsApplicable, false),
    },
    bank: {
      accountHolder: normalizeStringValue(bankSource.accountHolder, ""),
      bankName: normalizeStringValue(bankSource.bankName, ""),
      accountNumber: normalizeStringValue(bankSource.accountNumber, ""),
      branch: normalizeStringValue(bankSource.branch, ""),
      ifsc: normalizeStringValue(bankSource.ifsc ?? bankSource.ifscCode, ""),
      accountType: normalizeEnumValue(bankSource.accountType, "CURRENT"),
      upiId: normalizeStringValue(bankSource.upiId, ""),
      cancelledCheque: null,
    },
    purchase: {
      openingBalance: normalizeNumberValue(data.openingBalance ?? purchaseSource.openingBalance ?? 0, 0),
      balanceType: normalizeEnumValue(data.balanceType ?? purchaseSource.balanceType, "DEBIT"),
      creditLimit: normalizeNumberValue(data.creditLimit ?? purchaseSource.creditLimit ?? 0, 0),
      creditDays: normalizeNumberValue(data.creditDays ?? purchaseSource.creditDays ?? 30, 30),
      paymentTerms: normalizeStringValue(data.paymentTerm ?? purchaseSource.paymentTerms, ""),
      paymentMode: normalizeEnumValue(data.paymentMode ?? purchaseSource.paymentMode, "BANK"),
      currency: normalizeStringValue(data.currencyId ?? purchaseSource.currency, "INR"),
      gstSlab: normalizeStringValue(purchaseSource.gstSlab, ""),
      purchaseLedger: normalizeStringValue(purchaseSource.purchaseLedger, ""),
    },
    documents: documentFiles.length
      ? documentFiles.map((document: any, index: number) => ({
          ...document,
          documentType: normalizeDocumentType(document.documentType ?? documentTypes[index] ?? ""),
        }))
      : documentTypes.map((documentType: string) => ({
          documentType: normalizeDocumentType(documentType),
          fileUrl: "",
          file: undefined,
        })),
  };
};
