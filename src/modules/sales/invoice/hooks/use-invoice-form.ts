


"use client";

import { useEffect } from "react";
import {
  useForm,
  type DefaultValues,
} from "react-hook-form";

import type { InvoiceFormValues } from "../types/invoice-form.types";

export const DEFAULT_VALUES: DefaultValues<InvoiceFormValues> = {
  invoiceType: "B2B",

  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",

  financialYear: "",

  invoiceStatus: "Draft",
  invoiceSource: "POS",

  branchId: "",
  branch: "",

  referenceNumber: "",

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

  billingAddressLine1: "",
  billingAddressLine2: "",

  billingCity: "",
  billingState: "",
  billingStateCode: "",
  billingPincode: "",
  billingCountry: "India",

  sameAsBilling: true,

  shippingAddressLine1: "",
  shippingAddressLine2: "",

  shippingCity: "",
  shippingState: "",
  shippingStateCode: "",
  shippingPincode: "",
  shippingCountry: "India",

  placeOfSupply: "",
  placeOfSupplyCode: "",

  taxType: "",

  reverseCharge: false,
  isExport: false,
  isSEZ: false,

  currency: "INR",
  exchangeRate: 1,

  discountType: "percentage",

  items: [],

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

  paymentStatus: "Pending",
  paymentMethod: "Cash",

  paidAmount: 0,
  pendingAmount: 0,

  paymentDate: "",
  transactionId: "",
  receivedAccount: "",

  irn: "",
  acknowledgementNumber: "",
  acknowledgementDate: "",

  signedQRCode: "",
  qrCodeImage: "",

  notes:
    "Thank you for your business and continued support.",

  termsAndConditions:
    "Payment is due as per the agreed payment terms. All applicable taxes are included as stated. Goods and services once sold are subject to the agreed terms and conditions.",

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

  businessId: "",
};

export function useInvoiceForm(
  initialValues?: InvoiceFormValues | null,
) {
  const form = useForm<InvoiceFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  return form;
}