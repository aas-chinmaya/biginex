


import type {
  DiscountType,
  InvoiceStatus,
  InvoiceType,
  PaymentStatus,
} from "./invoice.types";

// =========================================================
// Invoice Item Form Values
// =========================================================

export interface InvoiceItemFormValues {
  id?: string;

  productId: string;
  productName: string;

  unit: string;
  hsnSacCode: string;

  quantity: number;
  rate: number;

  discountType: DiscountType;
  discountValue: number;

  taxableAmount: number;

  cgst: number;
  sgst: number;
  igst: number;
  cess: number;

  grandTotal: number;

  description?: string;
}

// =========================================================
// Invoice Form Values
// =========================================================

export interface InvoiceFormValues {
  // -------------------------------------------------------
  // Invoice
  // -------------------------------------------------------

  invoiceType: InvoiceType;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  financialYear: string;

  invoiceStatus: InvoiceStatus;
  invoiceSource: string;

  branchId: string;
  branch: string;

  referenceNumber: string;

  // -------------------------------------------------------
  // Customer
  // -------------------------------------------------------

  customerId: string;

  buyerName: string;
  buyerCompanyName: string;

  buyerGSTIN: string;
  buyerPAN: string;

  buyerPhone: string;
  buyerEmail: string;

  buyerType: string;
  buyerContactPerson: string;

  buyerRevCharge?: string;

  // -------------------------------------------------------
  // Billing
  // -------------------------------------------------------

  billingAddressLine1: string;
  billingAddressLine2: string;

  billingCity: string;
  billingState: string;
  billingStateCode: string;
  billingPincode: string;
  billingCountry: string;

  // -------------------------------------------------------
  // Shipping
  // -------------------------------------------------------

  sameAsBilling: boolean;

  shippingAddressLine1: string;
  shippingAddressLine2: string;

  shippingCity: string;
  shippingState: string;
  shippingStateCode: string;
  shippingPincode: string;
  shippingCountry: string;

  // -------------------------------------------------------
  // Tax
  // -------------------------------------------------------

  placeOfSupply: string;
  placeOfSupplyCode: string;

  taxType: string;

  reverseCharge: boolean;

  isExport: boolean;
  isSEZ: boolean;

  currency: string;
  exchangeRate: number;

  discountType: DiscountType;

  // -------------------------------------------------------
  // Items
  // -------------------------------------------------------

  items: InvoiceItemFormValues[];

  // -------------------------------------------------------
  // Totals
  // -------------------------------------------------------

  totalItems: number;
  totalQuantity: number;

  subtotal: number;
  discountAmount: number;
  taxableAmount: number;

  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;

  roundOffAmount: number;
  grandTotal: number;

  // -------------------------------------------------------
  // Payment
  // -------------------------------------------------------

  paymentStatus: PaymentStatus;
  paymentMethod: string;

  paidAmount: number;
  pendingAmount: number;

  paymentDate: string;

  transactionId: string;
  receivedAccount: string;

  // -------------------------------------------------------
  // E-Invoice
  // -------------------------------------------------------

  irn: string;
  acknowledgementNumber: string;
  acknowledgementDate: string;

  signedQRCode: string;
  qrCodeImage: string;

  // -------------------------------------------------------
  // Additional
  // -------------------------------------------------------

  notes: string;
  termsAndConditions: string;

  // -------------------------------------------------------
  // Seller
  // -------------------------------------------------------

  sellerLegalName: string;
  sellerTradeName: string;

  sellerGSTIN: string;
  sellerPAN: string;

  sellerPhone: string;
  sellerEmail: string;

  sellerAddressLine1: string;
  sellerAddressLine2: string;

  sellerCity: string;
  sellerState: string;
  sellerStateCode: string;
  sellerPincode: string;
  sellerCountry: string;

  // -------------------------------------------------------
  // Context
  // -------------------------------------------------------

  businessId: string;
  createdBy?: string;
}