import type {
  InvoiceStatus,
  InvoiceType,
  PaymentStatus,
} from "./invoice.types";

// =========================================================
// Invoice line item — shape returned by the API (matches
// what toInvoicePayload() sends and what the backend echoes
// back on fetch: productId/itemId, itemName/product,
// unitPrice, lineTotal, etc.)
// =========================================================

export interface InvoiceLineItem {
  id?: string;

  productId?: string;
  itemId?: string;

  itemName?: string;
  product?: string;
  itemCode?: string | null;

  description?: string;

  unit?: string;
  hsnSacCode?: string;

  quantity: number;

  unitPrice: number;
  sellingPrice?: number;

  discountType?: "PERCENTAGE" | "FIXED" | string;
  discountValue?: number;
  discountAmount?: number;

  gstRate?: number;

  taxableAmount: number;

  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cessAmount?: number;

  lineNumber?: number;
  lineTotal: number;
}

// =========================================================
// Invoice — the persisted/returned record. Field names
// mirror InvoiceFormValues (see invoice-form.types.ts) since
// this is what the API returns after toInvoicePayload().
// =========================================================

export interface Invoice {
  id?: string;
  invoiceId?: string;

  businessId?: string;
  branchId?: string;
  createdBy?: string;

  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  financialYear?: string;

  invoiceType?: InvoiceType;
  invoiceStatus?: InvoiceStatus;
  invoiceSource?: string;

  branch?: string;
  referenceNumber?: string;

  // ------------------------------
  // Seller
  // ------------------------------

  sellerLegalName?: string;
  sellerTradeName?: string;

  sellerGSTIN?: string;
  sellerPAN?: string;

  sellerPhone?: string;
  sellerEmail?: string;

  sellerAddressLine1?: string;
  sellerAddressLine2?: string;

  sellerCity?: string;
  sellerState?: string;
  sellerStateCode?: string;
  sellerPincode?: string;
  sellerCountry?: string;

  // ------------------------------
  // Buyer
  // ------------------------------

  customerId?: string;

  buyerName?: string;
  buyerCompanyName?: string;

  buyerGSTIN?: string;
  buyerPAN?: string;

  buyerPhone?: string;
  buyerEmail?: string;

  buyerType?: string;
  buyerContactPerson?: string;
  buyerRevCharge?: string;

  // ------------------------------
  // Billing / shipping
  // ------------------------------

  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingStateCode?: string;
  billingPincode?: string;
  billingCountry?: string;

  sameAsBilling?: boolean;

  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingStateCode?: string;
  shippingPincode?: string;
  shippingCountry?: string;

  // ------------------------------
  // Tax
  // ------------------------------

  placeOfSupply?: string;
  placeOfSupplyCode?: string;

  taxType?: string;
  reverseCharge?: boolean;

  isExport?: boolean;
  isSEZ?: boolean;

  currency?: string;
  exchangeRate?: number;

  // ------------------------------
  // Items + totals
  // ------------------------------

  items: InvoiceLineItem[];

  totalItems?: number;
  totalQuantity?: number;

  subtotal?: number;
  discountAmount?: number;
  taxableAmount?: number;

  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cessAmount?: number;

  roundOffAmount?: number;
  grandTotal?: number;

  // ------------------------------
  // Payment
  // ------------------------------

  paymentStatus?: PaymentStatus;
  paymentMethod?: string;

  paidAmount?: number;
  pendingAmount?: number;

  paymentDate?: string;
  transactionId?: string;
  receivedAccount?: string;

  // ------------------------------
  // E-Invoice
  // ------------------------------

  irn?: string;
  acknowledgementNumber?: string;
  acknowledgementDate?: string;

  signedQRCode?: string;
  qrCodeImage?: string;

  // ------------------------------
  // Additional
  // ------------------------------

  notes?: string;
  termsAndConditions?: string;
}