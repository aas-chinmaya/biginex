



"use client";

import { useEffect } from "react";
import { useForm, type DefaultValues } from "react-hook-form";

import type { InvoiceFormValues } from "../types/invoice-form.types";

export const DEFAULT_VALUES: DefaultValues<InvoiceFormValues> = {
  // ========================================================
  // Invoice
  // ========================================================

  invoiceType: "B2B",

  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",

  financialYear: "",

  invoiceStatus: "Draft",
  invoiceSource: "POS",

  branchId: "",
  branch: "",


  // ========================================================
  // Customer
  // ========================================================

  customerId: "",

  buyerName: "",
  buyerCompanyName: "",

  buyerGSTIN: "",
  buyerPAN: "",

  buyerPhone: "",
  buyerEmail: "",

  buyerType: "REGISTERED",
  buyerContactPerson: "",

  buyerRevCharge: "",

  // ========================================================
  // Billing
  // ========================================================

  billingAddressLine1: "",
  billingAddressLine2: "",

  billingCity: "",
  billingState: "",
  billingStateCode: "",
  billingPincode: "",
  billingCountry: "India",

  // ========================================================
  // Shipping
  // ========================================================

  sameAsBilling: true,

  shippingAddressLine1: "",
  shippingAddressLine2: "",

  shippingCity: "",
  shippingState: "",
  shippingStateCode: "",
  shippingPincode: "",
  shippingCountry: "India",

  // ========================================================
  // Tax
  // ========================================================

  placeOfSupply: "",
  placeOfSupplyCode: "",

  taxType: "",

  reverseCharge: false,
  isExport: false,
  isSEZ: false,

  currency: "INR",
  exchangeRate: 1,

  discountType: "percentage",

  // ========================================================
  // Items
  // ========================================================

  items: [],

  // ========================================================
  // Totals
  // ========================================================

  totalItems: 0,
  totalQuantity: 0,

  subtotal: 0,
  discountAmount: 0,
  taxableAmount: 0,

  cgstAmount: 0,
  sgstAmount: 0,
  igstAmount: 0,
  cessAmount: 0,

  roundOffAmount: 0,
  grandTotal: 0,

  // ========================================================
  // Payment
  // ========================================================

  paymentStatus: "Pending",
  paymentMethod: "Cash",

  paidAmount: 0,
  pendingAmount: 0,

  paymentDate: "",
  transactionId: "",
  receivedAccount: "",

  // ========================================================
  // E-Invoice
  // ========================================================

  irn: "",
  acknowledgementNumber: "",
  acknowledgementDate: "",

  signedQRCode: "",
  qrCodeImage: "",

  // ========================================================
  // Additional
  // ========================================================

  notes: "",

  termsAndConditions:
    "Payment is due as per the agreed payment terms. All applicable taxes are included as stated. Goods and services once sold are subject to the agreed terms and conditions.",

  // ========================================================
  // Seller
  // ========================================================

  sellerLegalName: "",
  sellerTradeName: "",

  sellerGSTIN: "",
  sellerPAN: "",

  sellerPhone: "",
  sellerEmail: "",

  sellerAddressLine1: "",
  sellerAddressLine2: "",

  sellerCity: "",
  sellerState: "",
  sellerStateCode: "",
  sellerPincode: "",
  sellerCountry: "India",

  // ========================================================
  // Context
  // ========================================================

  businessId: "",
  createdBy: "",
};

export function useInvoiceForm(
  initialValues?: InvoiceFormValues | null,
) {
  const form = useForm<InvoiceFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (!initialValues) return;

    form.reset({
      ...DEFAULT_VALUES,
      ...initialValues,
      items: initialValues.items ?? [],
    });
  }, [initialValues, form]);

  return form;
}