

import { DEFAULT_VALUES } from "../../hooks/use-invoice-form";
import type {
  InvoiceFormValues,
  InvoiceItemFormValues,
} from "../../types/invoice-form.types";

// ==========================================================
// GST state code helpers
// ==========================================================

export const STATE_CODE_MAP: Record<string, string> = {
  "andhra pradesh": "37",
  "arunachal pradesh": "12",
  "assam": "18",
  "bihar": "10",
  "chhattisgarh": "22",
  "goa": "30",
  "gujarat": "24",
  "haryana": "06",
  "himachal pradesh": "02",
  "jharkhand": "20",
  "karnataka": "29",
  "kerala": "32",
  "madhya pradesh": "23",
  "maharashtra": "27",
  "manipur": "14",
  "meghalaya": "17",
  "mizoram": "15",
  "nagaland": "13",
  "odisha": "21",
  "punjab": "03",
  "rajasthan": "08",
  "sikkim": "11",
  "tamil nadu": "33",
  "telangana": "36",
  "tripura": "16",
  "uttar pradesh": "09",
  "uttarakhand": "05",
  "west bengal": "19",
  "andaman and nicobar islands": "35",
  "chandigarh": "04",
  "dadra and nagar haveli and daman and diu": "26",
  "delhi": "07",
  "jammu and kashmir": "01",
  "ladakh": "38",
  "lakshadweep": "31",
  "puducherry": "34",
};

export function getStateCode(
  state?: string | null,
  fallbackCode?: string | null,
): string {
  if (fallbackCode && fallbackCode.trim()) return fallbackCode.trim();
  if (!state) return "";
  return STATE_CODE_MAP[state.trim().toLowerCase()] ?? "";
}

// ==========================================================
// Helpers
// ==========================================================

const text = (value: unknown): string => String(value ?? "").trim();

const numberValue = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const round = (value: number): number => Number(value.toFixed(2));

// ==========================================================
// Lightweight check
// ==========================================================

export function invoiceHasRequiredCustomerAndItems(
  values: InvoiceFormValues,
): boolean {
  return Boolean(
    (text(values.customerId) || text(values.buyerName)) &&
      text(values.invoiceDate) &&
      values.items?.some(
        (item) => text(item.productId) && numberValue(item.quantity) > 0,
      ),
  );
}

// ==========================================================
// Required field errors
// ==========================================================

export function getRequiredFieldErrors(
  values: InvoiceFormValues,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!text(values.customerId) && !text(values.buyerName)) {
    errors.customerId = "Buyer is required";
    errors.buyerName = "Buyer name is required";
  }

  if (!text(values.invoiceDate)) {
    errors.invoiceDate = "Invoice date is required";
  }

  if (!Array.isArray(values.items) || values.items.length === 0) {
    errors.items = "At least one invoice item is required";
  } else {
    const invalidIndex = values.items.findIndex(
      (item) => !text(item.productId) || numberValue(item.quantity) <= 0,
    );
    if (invalidIndex >= 0) {
      errors[`items.${invalidIndex}.productId`] =
        "Item and quantity are required";
    }
  }

  if (!text(values.placeOfSupply)) {
    errors.placeOfSupply = "Place of supply is required";
  }

  // Only enforce billing address when no customer is selected
  if (!text(values.customerId)) {
    if (!text(values.billingAddressLine1)) {
      errors.billingAddressLine1 = "Billing address is required";
    }
    if (!text(values.billingCity)) {
      errors.billingCity = "Billing city is required";
    }
    if (!text(values.billingState)) {
      errors.billingState = "Billing state is required";
    }
    if (!text(values.billingPincode)) {
      errors.billingPincode = "Billing pincode is required";
    }
  }

  return errors;
}

// ==========================================================
// Form → API payload
// ==========================================================

export function toInvoicePayload(
  values: InvoiceFormValues,
): Record<string, unknown> {
  const sellerStateCode = text(values.sellerStateCode);

  const billingStateCode =
    text(values.billingStateCode) ||
    getStateCode(values.billingState) ||
    getStateCode(values.placeOfSupply);

  const placeOfSupplyCode =
    text(values.placeOfSupplyCode) ||
    billingStateCode ||
    getStateCode(values.placeOfSupply);

  const isIntraStateSupply = Boolean(
    sellerStateCode &&
      placeOfSupplyCode &&
      sellerStateCode === placeOfSupplyCode,
  );

  const items = (values.items ?? []).map((item, index) => {
    const quantity = numberValue(item.quantity);
    const rate = numberValue(item.rate);
    const subtotal = quantity * rate;
    const discountValue = numberValue(item.discountValue);

    const discountAmount =
      item.discountType === "fixed"
        ? Math.min(discountValue, subtotal)
        : Math.min((subtotal * discountValue) / 100, subtotal);

    const taxableAmount = round(subtotal - discountAmount);

    let cgst = round(numberValue(item.cgst));
    let sgst = round(numberValue(item.sgst));
    let igst = round(numberValue(item.igst));
    const cess = round(numberValue(item.cess));

    if (isIntraStateSupply && igst > 0 && cgst === 0 && sgst === 0) {
      cgst = round(igst / 2);
      sgst = round(igst / 2);
      igst = 0;
    } else if (!isIntraStateSupply && (cgst > 0 || sgst > 0) && igst === 0) {
      igst = round(cgst + sgst);
      cgst = 0;
      sgst = 0;
    }

    const lineTotal = round(taxableAmount + cgst + sgst + igst + cess);

    // gstRate should be percentage, not amount
    const gstRatePct =
      taxableAmount > 0
        ? round(((cgst + sgst + igst) / taxableAmount) * 100)
        : 0;

    return {
      id: item.id,
      productId: text(item.productId) || undefined,
      itemId: text(item.productId) || undefined,
      itemName: text(item.productName),
      product: text(item.productName),
itemCode: text(item.itemCode) || text(item.productId) || "NA",      unit: text(item.unit) || "NOS",
      hsnSacCode: text(item.hsnSacCode) || "NA",
      
     classification:
    String(item.classification ?? "GOODS").toUpperCase() === "SERVICES"
      ? "SERVICES"
      : "GOODS",


      quantity,
      unitPrice: rate,
      sellingPrice: rate,
      discountType: String(item.discountType).toUpperCase(),
      discountValue,
      discountAmount: round(discountAmount),
      gstRate: gstRatePct,
      taxableAmount,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: igst,
      cessAmount: cess,
      lineNumber: index + 1,
      lineTotal,
    };
  });

  const subtotal = round(
    items.reduce(
      (sum, item) =>
        sum + numberValue(item.quantity) * numberValue(item.unitPrice),
      0,
    ),
  );

  const discountAmount = round(
    items.reduce((sum, item) => sum + numberValue(item.discountAmount), 0),
  );

  const taxableAmount = round(
    items.reduce((sum, item) => sum + numberValue(item.taxableAmount), 0),
  );

  const cgstAmount = round(
    items.reduce((sum, item) => sum + numberValue(item.cgstAmount), 0),
  );

  const sgstAmount = round(
    items.reduce((sum, item) => sum + numberValue(item.sgstAmount), 0),
  );

  const igstAmount = round(
    items.reduce((sum, item) => sum + numberValue(item.igstAmount), 0),
  );

  const cessAmount = round(
    items.reduce((sum, item) => sum + numberValue(item.cessAmount), 0),
  );

  const calculatedTotal = round(
    taxableAmount + cgstAmount + sgstAmount + igstAmount + cessAmount,
  );

  const roundOffAmount = round(numberValue(values.roundOffAmount));
  const grandTotal = round(calculatedTotal + roundOffAmount);
  const paidAmount = round(numberValue(values.paidAmount));
  const pendingAmount = round(Math.max(grandTotal - paidAmount, 0));

  const shippingAddress = values.sameAsBilling
    ? {
        shippingAddressLine1: text(values.billingAddressLine1),
        shippingAddressLine2: text(values.billingAddressLine2),
        shippingCity: text(values.billingCity),
        shippingState: text(values.billingState),
        shippingStateCode: billingStateCode,
        shippingPincode: text(values.billingPincode),
        shippingCountry: text(values.billingCountry),
      }
    : {
        shippingAddressLine1: text(values.shippingAddressLine1),
        shippingAddressLine2: text(values.shippingAddressLine2),
        shippingCity: text(values.shippingCity),
        shippingState: text(values.shippingState),
        shippingStateCode:
          text(values.shippingStateCode) ||
          getStateCode(values.shippingState),
        shippingPincode: text(values.shippingPincode),
        shippingCountry: text(values.shippingCountry),
      };

  return {
    businessId: text(values.businessId) || undefined,
    branchId: text(values.branchId) || undefined,
    createdBy: text(values.createdBy) || undefined,

    invoiceNumber: text(values.invoiceNumber) || undefined,
    invoiceDate: text(values.invoiceDate) || undefined,
    dueDate: text(values.dueDate) || undefined,
    financialYear: text(values.financialYear) || undefined,
    invoiceType: text(values.invoiceType) || undefined,
    invoiceStatus: text(values.invoiceStatus) || undefined,
    invoiceSource: text(values.invoiceSource) || undefined,
    referenceNumber: text(values.referenceNumber) || undefined,

    sellerLegalName: text(values.sellerLegalName) || undefined,
    sellerTradeName: text(values.sellerTradeName) || undefined,
    sellerGSTIN: text(values.sellerGSTIN) || undefined,
    sellerPAN: text(values.sellerPAN) || undefined,
    sellerPhone: text(values.sellerPhone) || undefined,
    sellerEmail: text(values.sellerEmail) || undefined,
    sellerAddressLine1: text(values.sellerAddressLine1) || undefined,
    sellerAddressLine2: text(values.sellerAddressLine2) || undefined,
    sellerCity: text(values.sellerCity) || undefined,
    sellerState: text(values.sellerState) || undefined,
    sellerStateCode: sellerStateCode || undefined,
    sellerPincode: text(values.sellerPincode) || undefined,
    sellerCountry: text(values.sellerCountry) || undefined,

    customerId: text(values.customerId) || undefined,
    buyerName: text(values.buyerName) || undefined,
    buyerCompanyName: text(values.buyerCompanyName) || undefined,
    buyerGSTIN: text(values.buyerGSTIN) || undefined,
    buyerPAN: text(values.buyerPAN) || undefined,
    buyerPhone: text(values.buyerPhone) || undefined,
    buyerEmail: text(values.buyerEmail) || undefined,
    buyerType: text(values.buyerType) || undefined,
    buyerContactPerson: text(values.buyerContactPerson) || undefined,
    buyerRevCharge: text(values.buyerRevCharge) || undefined,

    billingAddressLine1: text(values.billingAddressLine1) || undefined,
    billingAddressLine2: text(values.billingAddressLine2) || undefined,
    billingCity: text(values.billingCity) || undefined,
    billingState: text(values.billingState) || undefined,
    billingStateCode: billingStateCode || undefined,
    billingPincode: text(values.billingPincode) || undefined,
    billingCountry: text(values.billingCountry) || undefined,

    ...shippingAddress,
    sameAsBilling: Boolean(values.sameAsBilling),

    placeOfSupply: text(values.placeOfSupply) || undefined,
    placeOfSupplyCode: placeOfSupplyCode || undefined,
    taxType: text(values.taxType) || undefined,
    reverseCharge: Boolean(values.reverseCharge),
    isExport: Boolean(values.isExport),
    isSEZ: Boolean(values.isSEZ),
    currency: text(values.currency) || undefined,
    exchangeRate: numberValue(values.exchangeRate),

    items,
    totalItems: items.length,
    totalQuantity: items.reduce(
      (sum, item) => sum + numberValue(item.quantity),
      0,
    ),
    subtotal,
    discountAmount,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    cessAmount,
    roundOffAmount,
    grandTotal,

    paymentStatus: text(values.paymentStatus) || undefined,
    paymentMethod: text(values.paymentMethod) || undefined,
    paidAmount,
    pendingAmount,
    paymentDate: text(values.paymentDate) || undefined,
    transactionId: text(values.transactionId) || undefined,
    receivedAccount: text(values.receivedAccount) || undefined,

    irn: text(values.irn) || undefined,
    acknowledgementNumber: text(values.acknowledgementNumber) || undefined,
    acknowledgementDate: text(values.acknowledgementDate) || undefined,
    signedQRCode: text(values.signedQRCode) || undefined,
    qrCodeImage: text(values.qrCodeImage) || undefined,

    notes: text(values.notes) || undefined,
    termsAndConditions: text(values.termsAndConditions) || undefined,
  };
}

// ==========================================================
// API response → Form values
// ==========================================================

export function toInvoiceFormValues(
  invoice: Record<string, unknown>,
): InvoiceFormValues {
  const values: InvoiceFormValues = {
    ...(DEFAULT_VALUES as InvoiceFormValues),
  };

  const destination = values as unknown as Record<string, unknown>;

  for (const key of Object.keys(DEFAULT_VALUES) as Array<
    keyof InvoiceFormValues
  >) {
    if (key === "items") continue;

    // grandTotal replaces the legacy "totalAmount" API field name; accept either.
    const value =
      key === "grandTotal"
        ? (invoice.grandTotal ?? invoice.totalAmount)
        : invoice[key];

    if (value !== null && value !== undefined) {
      destination[key] = value;
    }
  }

const rawItems = Array.isArray(invoice.items) ? invoice.items : [];

values.items = rawItems.map((raw) => {
  const item = raw as Record<string, unknown>;

  return {
    id: text(item.id) || undefined,

    productId: text(item.productId ?? item.itemId),
    productName: text(item.itemName ?? item.product),

    unit: text(item.unit) || "NOS",
    hsnSacCode: text(item.hsnSacCode) || "NA",

     classification:
      String(item.classification ?? "GOODS").toUpperCase() === "SERVICES"
        ? "SERVICES"
        : "GOODS",

    quantity: numberValue(item.quantity),
    rate: numberValue(item.unitPrice ?? item.sellingPrice),

    discountType:
      String(item.discountType ?? "percentage").toLowerCase() === "fixed"
        ? "fixed"
        : "percentage",

    discountValue: numberValue(item.discountValue),

    taxableAmount: numberValue(item.taxableAmount),

    cgst: numberValue(item.cgstAmount ?? item.cgst),
    sgst: numberValue(item.sgstAmount ?? item.sgst),
    igst: numberValue(item.igstAmount ?? item.igst),
    cess: numberValue(item.cessAmount ?? item.cess),

    grandTotal: numberValue(
      item.lineTotal ?? item.grandTotal ?? item.totalAmount,
    ),

    description: text(item.description) || undefined,
  } satisfies InvoiceItemFormValues;
});

return values;
}
 