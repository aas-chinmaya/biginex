import api from "@/services/api";

import {
  BusinessInfoData,
  BusinessAddressData,
  BusinessBranchData,
  BusinessBankData,
  BusinessDocumentData,
} from "../validation";

const normalizeDocumentType = (value: string) => {
  const normalizedKey = value
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");

  const map: Record<string, string> = {
    gst: "GST",
    // gst_certificate: "GST",
    // gst_cert: "GST",
    pan: "PAN",
    // pan_card: "PAN",
    // pancard: "PAN",
    // pan_card_document: "PAN",
    msme: "MSME",
   // msme_certificate: "MSME",
    tan: "TAN",
    //tan_certificate: "TAN",
    license: "LICENSE",
    //business_license: "LICENSE",
    // address_proof: "CERTIFICATE",
    // address_proof_document: "CERTIFICATE",
    // proof_of_address: "CERTIFICATE",
    certificate: "CERTIFICATE",
    // certificates: "CERTIFICATE",
    other: "OTHER",
    // others: "OTHER",
  };

  return map[normalizedKey] ?? normalizedKey.toUpperCase();
};

export const businessApi = {
  // 2.1 Business Information
  createBusiness(data: Omit<BusinessInfoData, "logo"> & { logo?: File | null }) {
    const form = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "logo" || value === null || value === undefined || value === "") return;
      form.append(key, String(value));
    });

    if (data.logo instanceof File) {
      form.append("logo", data.logo);
    }

    return api.post("/businesses", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadLogo(tenantId: string, file: File) {
    const form = new FormData();
    form.append("logo", file);

    return api.post(`/business/${tenantId}/logo`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 2.2 Business Address
  createAddress(tenantId: string, data: BusinessAddressData) {
    return api.post("/business/business-addresses/", {
      tenantId,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      pincode: data.pincode,
      country: data.countryId,
      state: data.stateId,
      city: data.cityId,
      isPrimary: data.isPrimary,
    });
  },

  // 2.3 Business Branch
  createBranch(tenantId: string, data: BusinessBranchData) {
    const payload: Record<string, unknown> = {
      tenantId,
      branchName: data.branchName ?? null,
      phone: data.phone,
      email: data.email,
      pincode: data.pincode,
      country: data.countryId,
      state: data.stateId,
      city: data.cityId,
    };

    if (data.managerId && data.managerId.trim()) {
      payload.userId = data.managerId;
    }

    return api.post("/business/business-branches/createBranch", payload);
  },
  updateBranch(branchId: string, data: BusinessBranchData) {
    const payload: Record<string, unknown> = {
      branchName: data.branchName ?? null,
      phone: data.phone,
      email: data.email,
      pincode: data.pincode,
      country: data.countryId,
      state: data.stateId,
      city: data.cityId,
    };

    if (data.managerId && data.managerId.trim()) {
      payload.userId = data.managerId;
    }

    return api.put(`/business/business-branches/updateBranch/${branchId}`, payload);
  },
  // 2.4 Business Bank
  createBank(tenantId: string, data: BusinessBankData) {
    return api.post("/business/business-banks/", {
      tenantId,
      accountHolderName: data.accountHolderName,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      branch: data.branch,
      upiId: data.upiId ?? null,
    });
  },

  // 2.5 Business Document
  uploadDocument(tenantId: string, doc: BusinessDocumentData) {
    const form = new FormData();

    form.append("tenantId", tenantId);
    form.append("documentType", normalizeDocumentType(doc.documentType));

    if (doc.file instanceof File) {
      form.append("file", doc.file);
    }

    if (doc.fileName) {
      form.append("fileName", doc.fileName);
    }

    if (doc.fileUrl) {
      form.append("fileUrl", doc.fileUrl);
    }

    return api.post("/business/business-documents/createDocument", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
