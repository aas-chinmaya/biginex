// ============================================================
// Business Setup — Types
// Mirrors backend schema sections 2.1 – 2.5
// ============================================================

export type EntityStatus = "active" | "inactive";

// ----------------------------------------------------------
// 2.1 Business Information
// ----------------------------------------------------------
export interface BusinessInfo {
  businessType: string;

  gstin: string;
  pan: string;

  legalName: string;
  tradeName?: string;
  displayName: string;

  email: string;
  phone: string;
  websiteLink?: string;

  businessCategoryId: string;
  industryId: string;

  registrationType?: string;
  registrationNumber?: string;

  otherRegistrationType?: string;

  tan?: string;
  msme?: string;

  currencyId: string;
  timezone: string;
  financialYear: string;

  description?: string;

  logo?: File | null;
}

// ----------------------------------------------------------
// 2.2 Business Address
// ----------------------------------------------------------
export interface BusinessAddress {
  addressLine1: string;
  addressLine2?: string;
  pincode: string;

  countryId: string;
  stateId: string;
  cityId: string;

  isPrimary?: boolean;
}

// ----------------------------------------------------------
// 2.3 Business Branch (optional, zero or more)
// ----------------------------------------------------------
export interface BusinessBranch {
  id?: string;
  branchCode?: string;
  branchName?: string;

  managerId?: string;

  phone: string;
  email: string;
  pincode: string;

  countryId: string;
  stateId: string;
  cityId: string;

  status: EntityStatus;
}

// ----------------------------------------------------------
// 2.4 Business Bank
// ----------------------------------------------------------
export interface BusinessBank {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId?: string;
}

// ----------------------------------------------------------
// 2.5 Business Document (zero or more)
// ----------------------------------------------------------
export interface BusinessDocument {
  documentType: string;
  file: File | null;
  fileName?: string;
  fileUrl?: string;
}

// ----------------------------------------------------------
// Combined wizard payload
// ----------------------------------------------------------
export interface BusinessSetupFormData {
  info: BusinessInfo;
  address: BusinessAddress;
  branches: BusinessBranch[];
  bank: BusinessBank;
  documents: BusinessDocument[];
}

// ----------------------------------------------------------
// Master data (from master tables / master APIs)
// ----------------------------------------------------------
export interface MasterOption {
  id: string;
  name: string;
  parentId?: string; // used for state->country, city->state chaining
  meta?: string; // e.g. currency symbol, country dial code
}
