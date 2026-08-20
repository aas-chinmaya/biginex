import { z } from "zod";

// ----------------------------------------------------------
// 2.1 Business Information
// ----------------------------------------------------------
export const businessInfoSchema = z.object({
  businessType: z.string().min(1, "Business type is required"),

  gstin: z
    .string()
    .min(15, "GSTIN must be 15 characters")
    .max(15, "GSTIN must be 15 characters"),

  pan: z
    .string()
    .min(10, "PAN must be 10 characters")
    .max(10, "PAN must be 10 characters"),

  legalName: z.string().min(2, "Legal name is required"),
  tradeName: z.string().optional(),
  displayName: z.string().min(2, "Display name is required"),

  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  websiteLink: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),

  businessCategoryId: z.string().min(1, "Business category is required"),
  industryId: z.string().min(1, "Industry is required"),

  registrationType: z.string().optional(),
  registrationNumber: z.string().optional(),

  otherRegistrationType: z.string().optional(),

  tan: z.string().optional(),
  msme: z.string().optional(),

  currencyId: z.string().min(1, "Currency is required"),
  timezone: z.string().min(1, "Timezone is required"),
  financialYear: z.string().min(1, "Financial year is required"),

  description: z.string().optional(),

  logo: z.any().nullable().optional(),
});

// ----------------------------------------------------------
// 2.2 Business Address
// ----------------------------------------------------------
export const businessAddressSchema = z.object({
  addressLine1: z.string().min(3, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  pincode: z.string().min(4, "Enter a valid pincode"),

  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),

  isPrimary: z.boolean().optional(),
});

// ----------------------------------------------------------
// 2.3 Business Branch (each row, when present, must be valid)
// ----------------------------------------------------------
export const businessBranchSchema = z.object({
  id: z.string().optional(),
  branchCode: z.string().optional(),
  branchName: z.string().optional(),

  managerId: z.string().optional(),

  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  pincode: z.string().min(4, "Enter a valid pincode"),

  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),

  status: z.enum(["active", "inactive"]).default("active"),
});

export const businessBranchesSchema = z.array(businessBranchSchema);

// ----------------------------------------------------------
// 2.4 Business Bank
// ----------------------------------------------------------
export const businessBankSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z
    .string()
    .min(6, "Enter a valid account number"),
  ifscCode: z.string().min(4, "Enter a valid IFSC / SWIFT code"),
  branch: z.string().min(2, "Branch is required"),
  upiId: z.string().optional(),
});

// ----------------------------------------------------------
// 2.5 Business Document (each row, when present, must be valid)
// ----------------------------------------------------------
export const businessDocumentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  file: z.any().nullable(),
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
});

export const businessDocumentsSchema = z.array(businessDocumentSchema);

// ----------------------------------------------------------
// Combined schema for the full wizard
// ----------------------------------------------------------
export const businessSetupSchema = z.object({
  info: businessInfoSchema,
  address: businessAddressSchema,
  branches: businessBranchesSchema,
  bank: businessBankSchema,
  documents: businessDocumentsSchema,
});

export type BusinessInfoData = z.infer<typeof businessInfoSchema>;
export type BusinessAddressData = z.infer<typeof businessAddressSchema>;
export type BusinessBranchData = z.infer<typeof businessBranchSchema>;
export type BusinessBankData = z.infer<typeof businessBankSchema>;
export type BusinessDocumentData = z.infer<typeof businessDocumentSchema>;
export type BusinessSetupData = z.infer<typeof businessSetupSchema>;
