import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));
const requiredString = (message: string) => z.string().trim().min(1, message);
const requiredPincode = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter a valid 6-digit pincode");
const optionalPincode = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter a valid 6-digit pincode")
  .optional()
  .or(z.literal(""));
const required10DigitString = (message: string) =>
  z.string().trim().regex(/^\d{10}$/, message);

const addressSchema = z.object({
  addressLine1: requiredString("Address line 1 is required"),
  addressLine2: optionalString,
  landmark: optionalString,
  district: optionalString,
  countryId: requiredString("Country is required"),
  stateId: requiredString("State is required"),
  cityId: requiredString("City is required"),
  pincode: requiredPincode,
  isBilling: z.boolean().default(true),
  isShipping: z.boolean().default(true),
  status: requiredString("Address status is required"),
});

const shippingAddressSchema = z.object({
  addressLine1: optionalString,
  addressLine2: optionalString,
  landmark: optionalString,
  district: optionalString,
  countryId: optionalString,
  stateId: optionalString,
  cityId: optionalString,
  pincode: optionalPincode,
  isBilling: z.boolean().default(false),
  isShipping: z.boolean().default(true),
  status: optionalString,
});

const contactSchema = z.object({
  name: requiredString("Contact name is required"),
  designation: optionalString,
  mobile: required10DigitString("Enter a valid 10-digit mobile number"),
  vendorPhone: optionalString,
  contactemail: requiredString("Contact email is required").email("Enter a valid email"),
  email: optionalString,
  alternateMobile: optionalString,
  alternatevendorPhone: optionalString,
  website: optionalString,
});

const bankSchema = z.object({
  accountHolder: requiredString("Account holder is required"),
  bankName: requiredString("Bank name is required"),
  accountNumber: requiredString("Account number is required"),
  ifscCode: requiredString("IFSC code is required"),
  branch: optionalString,
  upiId: optionalString,
  accountType: optionalString,
  cancelledCheque: optionalString,
  isPrimary: z.boolean().default(true),
});

const documentSchema = z
  .object({
    documentType: requiredString("Document type is required"),
    fileUrl: optionalString,
    file: z.any().optional(),
  })
  .superRefine((document, ctx) => {
    if (!document.file && !document.fileUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Please upload a document file",
      });
    }
  });

export const vendorFormSchema = z
  .object({
    vendorCode: optionalString,
    businessId: optionalString,
    vendorType: requiredString("Vendor type is required"),
    vendorName: requiredString("Vendor name is required"),
    legalName: optionalString,
    displayName: optionalString,
    businessCategory: optionalString,
    remarks: optionalString,
    logo: z.any().optional(),
    createdBy: optionalString,
    gstin: z.string().trim().optional().or(z.literal("")),
    pan: z.string().trim().optional().or(z.literal("")),
    email: requiredString("Vendor email is required").email("Enter a valid email"),
    phone: required10DigitString("Enter a valid 10-digit phone number"),
    alternatevendorPhone: optionalString,
    websiteLink: z.string().trim().url("Enter a valid website URL").optional().or(z.literal("")),
    currencyId: requiredString("Currency is required"),
    paymentTerm: requiredString("Payment term is required"),
    paymentMode: requiredString("Payment mode is required"),
    creditLimit: z.number().min(0, "Credit limit cannot be negative").default(0),
    openingBalance: z.number().min(0, "Opening balance cannot be negative").default(0),
    gstSlab: optionalString,
    purchaseLedger: optionalString,
    status: requiredString("Status is required"),
    gstType: requiredString("GST type is required"),
    tan: z.string().trim().optional().or(z.literal("")),
    msme: z.string().trim().optional().or(z.literal("")),
    cin: z.string().trim().optional().or(z.literal("")),
    aadhaar: z.string().trim().optional().or(z.literal("")),
    tdsApplicable: z.boolean().default(false),
    tdsSection: optionalString,
    tcsApplicable: z.boolean().default(false),
    creditDays: z.number().int().min(0, "Credit days cannot be negative").default(30),
    balanceType: requiredString("Balance type is required"),
    sameAsBilling: z.boolean().default(true),
    addresses: z.array(addressSchema).min(1, "Billing address is required"),
    shippingAddress: shippingAddressSchema.optional(),
    contacts: z.array(contactSchema).min(1, "Primary contact is required"),
    banks: z.array(bankSchema).min(1, "Bank details are required"),
    documents: z.array(documentSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (!data.sameAsBilling) {
      const shipping = data.shippingAddress;

      if (!shipping?.addressLine1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shippingAddress", "addressLine1"],
          message: "Shipping address line 1 is required",
        });
      }

      if (!shipping?.countryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shippingAddress", "countryId"],
          message: "Shipping country is required",
        });
      }

      if (!shipping?.stateId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shippingAddress", "stateId"],
          message: "Shipping state is required",
        });
      }

      if (!shipping?.cityId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shippingAddress", "cityId"],
          message: "Shipping city is required",
        });
      }

      if (!shipping?.pincode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shippingAddress", "pincode"],
          message: "Shipping pincode is required",
        });
      }
    }
  });

export type VendorFormValues = z.infer<typeof vendorFormSchema>;
