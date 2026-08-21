import { DEFAULT_VALUES } from "../../hooks/use-invoice-form";

import type {
  InvoiceFormValues,
  InvoiceItemFormValues,
} from "../../types/invoice-form.types";

// ==========================================================
// GST STATE CODE MAP
// ==========================================================

export const STATE_CODE_MAP: Record<string, string> = {
  "andhra pradesh": "37",
  "arunachal pradesh": "12",
  assam: "18",
  bihar: "10",
  chhattisgarh: "22",
  goa: "30",
  gujarat: "24",
  haryana: "06",
  "himachal pradesh": "02",
  jharkhand: "20",
  karnataka: "29",
  kerala: "32",
  "madhya pradesh": "23",
  maharashtra: "27",
  manipur: "14",
  meghalaya: "17",
  mizoram: "15",
  nagaland: "13",
  odisha: "21",
  punjab: "03",
  rajasthan: "08",
  sikkim: "11",
  "tamil nadu": "33",
  telangana: "36",
  tripura: "16",
  "uttar pradesh": "09",
  uttarakhand: "05",
  "west bengal": "19",

  "andaman and nicobar islands": "35",
  chandigarh: "04",
  "dadra and nagar haveli and daman and diu": "26",
  delhi: "07",
  "jammu and kashmir": "01",
  ladakh: "38",
  lakshadweep: "31",
  puducherry: "34",
};

// ==========================================================
// STATE CODE
// ==========================================================

export function getStateCode(
  state?: string | null,
  fallbackCode?: string | null,
): string {
  const fallback = String(
    fallbackCode ?? "",
  ).trim();

  if (fallback) {
    return fallback;
  }

  const normalizedState = String(
    state ?? "",
  )
    .trim()
    .toLowerCase();

  if (!normalizedState) {
    return "";
  }

  return STATE_CODE_MAP[
    normalizedState
  ] ?? "";
}

// ==========================================================
// HELPERS
// ==========================================================

const text = (
  value: unknown,
): string => {
  return String(
    value ?? "",
  ).trim();
};

const numberValue = (
  value: unknown,
): number => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

const round = (
  value: number,
): number => {
  return Number(
    value.toFixed(2),
  );
};

const optionalText = (
  value: unknown,
): string | undefined => {
  const result = text(value);

  return result || undefined;
};

// ==========================================================
// REQUIRED CUSTOMER / ITEMS
// ==========================================================

export function invoiceHasRequiredCustomerAndItems(
  values: InvoiceFormValues,
): boolean {
  const hasBuyer =
    Boolean(text(values.customerId)) ||
    Boolean(text(values.buyerName)) ||
    Boolean(
      text(
        values.buyerCompanyName,
      ),
    );

  return hasBuyer;
}

// ==========================================================
// REQUIRED FIELD ERRORS
// ==========================================================
//
// Invoice date = OPTIONAL
// Items = OPTIONAL
//
// Required:
// - Buyer
// - Place of supply
//
// Manual buyer:
// - Billing address
// - Billing city
// - Billing state
// - Billing pincode
// ==========================================================

export function getRequiredFieldErrors(
  values: InvoiceFormValues,
): Record<string, string> {
  const errors: Record<
    string,
    string
  > = {};

  // ========================================================
  // BUYER
  // ========================================================

  const hasCustomer =
    Boolean(text(values.customerId)) ||
    Boolean(text(values.buyerName)) ||
    Boolean(
      text(
        values.buyerCompanyName,
      ),
    );

  if (!hasCustomer) {
    errors.buyerName =
      "Buyer is required";
  }

  // ========================================================
  // PLACE OF SUPPLY
  // ========================================================

  if (
    !text(values.placeOfSupply)
  ) {
    errors.placeOfSupply =
      "Place of supply is required";
  }

  // ========================================================
  // MANUAL CUSTOMER BILLING
  // ========================================================

  if (
    !text(values.customerId)
  ) {
    if (
      !text(
        values.billingAddressLine1,
      )
    ) {
      errors.billingAddressLine1 =
        "Billing address is required";
    }

    if (
      !text(values.billingCity)
    ) {
      errors.billingCity =
        "Billing city is required";
    }

    if (
      !text(values.billingState)
    ) {
      errors.billingState =
        "Billing state is required";
    }

    if (
      !text(values.billingPincode)
    ) {
      errors.billingPincode =
        "Billing pincode is required";
    }
  }

  return errors;
}

// ==========================================================
// FORM → API PAYLOAD
// ==========================================================

export function toInvoicePayload(
  values: InvoiceFormValues,
): Record<string, unknown> {
  // ========================================================
  // STATE CODES
  // ========================================================

  const sellerStateCode =
    text(values.sellerStateCode) ||
    getStateCode(
      values.sellerState,
    );

  const billingStateCode =
    text(values.billingStateCode) ||
    getStateCode(
      values.billingState,
    ) ||
    getStateCode(
      values.placeOfSupply,
    );

  const placeOfSupplyCode =
    text(
      values.placeOfSupplyCode,
    ) ||
    getStateCode(
      values.placeOfSupply,
    ) ||
    billingStateCode;

  // ========================================================
  // GST TYPE
  // ========================================================

  const isIntraStateSupply =
    Boolean(sellerStateCode) &&
    Boolean(placeOfSupplyCode) &&
    sellerStateCode ===
      placeOfSupplyCode;

  // ========================================================
  // ITEMS
  // ========================================================

  const items = (
    values.items ?? []
  ).map(
    (
      item: InvoiceItemFormValues,
      index,
    ) => {
      // ====================================================
      // BASIC VALUES
      // ====================================================

      const quantity =
        numberValue(
          item.quantity,
        );

      const rate =
        numberValue(item.rate);

      const itemSubtotal =
        round(
          quantity * rate,
        );

      // ====================================================
      // DISCOUNT
      // ====================================================

      const discountValue =
        numberValue(
          item.discountValue,
        );

      const discountType =
        String(
          item.discountType ??
            "percentage",
        )
          .trim()
          .toLowerCase();

      const discountAmount =
        discountType === "fixed"
          ? Math.min(
              discountValue,
              itemSubtotal,
            )
          : Math.min(
              round(
                (itemSubtotal *
                  discountValue) /
                  100,
              ),
              itemSubtotal,
            );

      // ====================================================
      // TAXABLE
      // ====================================================

      const taxableAmount =
        round(
          Math.max(
            itemSubtotal -
              discountAmount,
            0,
          ),
        );

      // ====================================================
      // GST RATE
      // ====================================================
      //
      // Read gstRate from the form.
      //
      // If your type does not yet contain gstRate,
      // the fallback safely reads it dynamically.
      // ====================================================

      const rawItem =
        item as unknown as Record<
          string,
          unknown
        >;

      const gstRate =
        round(
          numberValue(
            rawItem.gstRate,
          ),
        );

      // ====================================================
      // CESS
      // ====================================================

      const cess =
        round(
          numberValue(
            rawItem.cess,
          ),
        );

      // ====================================================
      // GST CALCULATION
      // ====================================================

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (
        gstRate > 0 &&
        taxableAmount > 0
      ) {
        const totalGST =
          round(
            (taxableAmount *
              gstRate) /
              100,
          );

        if (
          isIntraStateSupply
        ) {
          // ================================================
          // INTRA STATE
          // CGST + SGST
          // ================================================

          cgst =
            round(
              totalGST / 2,
            );

          sgst =
            round(
              totalGST - cgst,
            );
        } else {
          // ================================================
          // INTER STATE
          // IGST
          // ================================================

          igst =
            totalGST;
        }
      }

      // ====================================================
      // LINE TOTAL
      // ====================================================

      const lineTotal =
        round(
          taxableAmount +
            cgst +
            sgst +
            igst +
            cess,
        );

      // ====================================================
      // ITEM
      // ====================================================

      return {
        id:
          optionalText(
            rawItem.id,
          ),

        productId:
          optionalText(
            rawItem.productId,
          ),

        itemId:
          optionalText(
            rawItem.productId ??
              rawItem.itemId,
          ),

        itemName:
          text(
            rawItem.productName ??
              rawItem.itemName ??
              rawItem.product,
          ),

        product:
          text(
            rawItem.productName ??
              rawItem.itemName ??
              rawItem.product,
          ),

        itemCode:
          text(
            rawItem.itemCode,
          ) ||
          text(
            rawItem.productId,
          ) ||
          "NA",

        unit:
          text(
            rawItem.unit,
          ) || "NOS",

        hsnSacCode:
          text(
            rawItem.hsnSacCode,
          ) || "NA",

        classification:
          String(
            rawItem.classification ??
              "GOODS",
          ).toUpperCase() ===
          "SERVICES"
            ? "SERVICES"
            : "GOODS",

        quantity,

        unitPrice:
          rate,

        sellingPrice:
          rate,

        discountType:
          discountType ===
          "fixed"
            ? "FIXED"
            : "PERCENTAGE",

        discountValue,

        discountAmount:
          round(
            discountAmount,
          ),

        gstRate,

        taxableAmount,

        cgstAmount:
          cgst,

        sgstAmount:
          sgst,

        igstAmount:
          igst,

        cessAmount:
          cess,

        lineNumber:
          index + 1,

        lineTotal,

        description:
          optionalText(
            rawItem.description,
          ),
      };
    },
  );

  // ========================================================
  // TOTALS
  // ========================================================

  const subtotal =
    round(
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.quantity,
          ) *
            numberValue(
              item.unitPrice,
            ),
        0,
      ),
    );

  const discountAmount =
    round(
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.discountAmount,
          ),
        0,
      ),
    );

  const taxableAmount =
    round(
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.taxableAmount,
          ),
        0,
      ),
    );

  const cgstAmount =
    round(
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.cgstAmount,
          ),
        0,
      ),
    );

  const sgstAmount =
    round(
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.sgstAmount,
          ),
        0,
      ),
    );

  const igstAmount =
    round(
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.igstAmount,
          ),
        0,
      ),
    );

  const cessAmount =
    round(
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.cessAmount,
          ),
        0,
      ),
    );

  // ========================================================
  // CALCULATED TOTAL
  // ========================================================

  const calculatedTotal =
    round(
      taxableAmount +
        cgstAmount +
        sgstAmount +
        igstAmount +
        cessAmount,
    );

  const roundOffAmount =
    round(
      numberValue(
        values.roundOffAmount,
      ),
    );

  const grandTotal =
    round(
      calculatedTotal +
        roundOffAmount,
    );

  // ========================================================
  // PAYMENT
  // ========================================================

  const paidAmount =
    round(
      numberValue(
        values.paidAmount,
      ),
    );

  const pendingAmount =
    round(
      Math.max(
        grandTotal -
          paidAmount,
        0,
      ),
    );

  // ========================================================
  // SHIPPING
  // ========================================================

  const shippingAddress =
    values.sameAsBilling
      ? {
          shippingAddressLine1:
            text(
              values.billingAddressLine1,
            ),

          shippingAddressLine2:
            text(
              values.billingAddressLine2,
            ),

          shippingCity:
            text(
              values.billingCity,
            ),

          shippingState:
            text(
              values.billingState,
            ),

          shippingStateCode:
            billingStateCode,

          shippingPincode:
            text(
              values.billingPincode,
            ),

          shippingCountry:
            text(
              values.billingCountry,
            ),
        }
      : {
          shippingAddressLine1:
            text(
              values.shippingAddressLine1,
            ),

          shippingAddressLine2:
            text(
              values.shippingAddressLine2,
            ),

          shippingCity:
            text(
              values.shippingCity,
            ),

          shippingState:
            text(
              values.shippingState,
            ),

          shippingStateCode:
            text(
              values.shippingStateCode,
            ) ||
            getStateCode(
              values.shippingState,
            ),

          shippingPincode:
            text(
              values.shippingPincode,
            ),

          shippingCountry:
            text(
              values.shippingCountry,
            ),
        };

  // ========================================================
  // FINAL PAYLOAD
  // ========================================================

  return {
    // ======================================================
    // CONTEXT
    // ======================================================

    businessId:
      optionalText(
        values.businessId,
      ),

    branchId:
      optionalText(
        values.branchId,
      ),

    createdBy:
      optionalText(
        values.createdBy,
      ),

    // ======================================================
    // INVOICE
    // ======================================================

    invoiceNumber:
      optionalText(
        values.invoiceNumber,
      ),

    invoiceDate:
      optionalText(
        values.invoiceDate,
      ),

    dueDate:
      optionalText(
        values.dueDate,
      ),

   

    invoiceType:
      optionalText(
        values.invoiceType,
      ),

    invoiceStatus:
      optionalText(
        values.invoiceStatus,
      ),

    invoiceSource:
      optionalText(
        values.invoiceSource,
      ),

    // ======================================================
    // SELLER
    // ======================================================

    sellerLegalName:
      optionalText(
        values.sellerLegalName,
      ),

    sellerTradeName:
      optionalText(
        values.sellerTradeName,
      ),

    sellerGSTIN:
      optionalText(
        values.sellerGSTIN,
      ),

    sellerPAN:
      optionalText(
        values.sellerPAN,
      ),

    sellerPhone:
      optionalText(
        values.sellerPhone,
      ),

    sellerEmail:
      optionalText(
        values.sellerEmail,
      ),

    sellerAddressLine1:
      optionalText(
        values.sellerAddressLine1,
      ),

    sellerAddressLine2:
      optionalText(
        values.sellerAddressLine2,
      ),

    sellerCity:
      optionalText(
        values.sellerCity,
      ),

    sellerState:
      optionalText(
        values.sellerState,
      ),

    sellerStateCode:
      optionalText(
        sellerStateCode,
      ),

    sellerPincode:
      optionalText(
        values.sellerPincode,
      ),

    sellerCountry:
      optionalText(
        values.sellerCountry,
      ),

    // ======================================================
    // BUYER
    // ======================================================

    customerId:
      optionalText(
        values.customerId,
      ),

    buyerName:
      optionalText(
        values.buyerName,
      ),

    buyerCompanyName:
      optionalText(
        values.buyerCompanyName,
      ),

    buyerGSTIN:
      optionalText(
        values.buyerGSTIN,
      ),

    buyerPAN:
      optionalText(
        values.buyerPAN,
      ),

    buyerPhone:
      optionalText(
        values.buyerPhone,
      ),

    buyerEmail:
      optionalText(
        values.buyerEmail,
      ),

    buyerType:
      optionalText(
        values.buyerType,
      ),

    buyerContactPerson:
      optionalText(
        values.buyerContactPerson,
      ),

    buyerRevCharge:
      optionalText(
        values.buyerRevCharge,
      ),

    // ======================================================
    // BILLING
    // ======================================================

    billingAddressLine1:
      optionalText(
        values.billingAddressLine1,
      ),

    billingAddressLine2:
      optionalText(
        values.billingAddressLine2,
      ),

    billingCity:
      optionalText(
        values.billingCity,
      ),

    billingState:
      optionalText(
        values.billingState,
      ),

    billingStateCode:
      optionalText(
        billingStateCode,
      ),

    billingPincode:
      optionalText(
        values.billingPincode,
      ),

    billingCountry:
      optionalText(
        values.billingCountry,
      ),

    // ======================================================
    // SHIPPING
    // ======================================================

    ...shippingAddress,

    sameAsBilling:
      Boolean(
        values.sameAsBilling,
      ),

    // ======================================================
    // TAX
    // ======================================================

    placeOfSupply:
      optionalText(
        values.placeOfSupply,
      ),

    placeOfSupplyCode:
      optionalText(
        placeOfSupplyCode,
      ),

    taxType:
      optionalText(
        values.taxType,
      ),

    reverseCharge:
      Boolean(
        values.reverseCharge,
      ),

    isExport:
      Boolean(
        values.isExport,
      ),

    isSEZ:
      Boolean(
        values.isSEZ,
      ),

    currency:
      optionalText(
        values.currency,
      ),

    exchangeRate:
      numberValue(
        values.exchangeRate,
      ),

    // ======================================================
    // ITEMS
    // ======================================================

    items,

    totalItems:
      items.length,

    totalQuantity:
      items.reduce(
        (sum, item) =>
          sum +
          numberValue(
            item.quantity,
          ),
        0,
      ),

    // ======================================================
    // TOTALS
    // ======================================================

    subtotal,

    discountAmount,

    taxableAmount,

    cgstAmount,

    sgstAmount,

    igstAmount,

    cessAmount,

    roundOffAmount,

    grandTotal,

    // ======================================================
    // PAYMENT
    // ======================================================

    paymentStatus:
      optionalText(
        values.paymentStatus,
      ),

    paymentMethod:
      optionalText(
        values.paymentMethod,
      ),

    paidAmount,

    pendingAmount,

    paymentDate:
      optionalText(
        values.paymentDate,
      ),

    transactionId:
      optionalText(
        values.transactionId,
      ),

    receivedAccount:
      optionalText(
        values.receivedAccount,
      ),

    // ======================================================
    // E-INVOICE
    // ======================================================

    irn:
      optionalText(
        values.irn,
      ),

    acknowledgementNumber:
      optionalText(
        values.acknowledgementNumber,
      ),

    acknowledgementDate:
      optionalText(
        values.acknowledgementDate,
      ),

    signedQRCode:
      optionalText(
        values.signedQRCode,
      ),

    qrCodeImage:
      optionalText(
        values.qrCodeImage,
      ),

    // ======================================================
    // ADDITIONAL
    // ======================================================

    notes:
      optionalText(
        values.notes,
      ),

    termsAndConditions:
      optionalText(
        values.termsAndConditions,
      ),
  };
}

// ==========================================================
// API RESPONSE → FORM VALUES
// ==========================================================

export function toInvoiceFormValues(
  invoice: Record<string, unknown>,
): InvoiceFormValues {
  const values = {
    ...(DEFAULT_VALUES as InvoiceFormValues),
  };

  const destination =
    values as unknown as Record<
      string,
      unknown
    >;

  // ========================================================
  // NORMAL FIELDS
  // ========================================================

  for (const key of Object.keys(
    DEFAULT_VALUES,
  ) as Array<
    keyof InvoiceFormValues
  >) {
    if (key === "items") {
      continue;
    }

    const value =
      key === "grandTotal"
        ? invoice.grandTotal ??
          invoice.totalAmount
        : invoice[key];

    if (
      value !== null &&
      value !== undefined
    ) {
      destination[key] =
        value;
    }
  }

  // ========================================================
  // ITEMS
  // ========================================================

  const rawItems =
    Array.isArray(
      invoice.items,
    )
      ? invoice.items
      : [];

  values.items =
    rawItems.map(
      (
        raw,
      ) => {
        const item =
          raw as Record<
            string,
            unknown
          >;

        return {
        

          productId:
            text(
              item.productId ??
                item.itemId,
            ),

          productName:
            text(
              item.itemName ??
                item.product ??
                item.productName,
            ),

          itemCode:
            text(
              item.itemCode ??
                item.code ??
                item.productId ??
                item.itemId,
            ) || "NA",

          unit:
            text(item.unit) ||
            "NOS",

          hsnSacCode:
            text(
              item.hsnSacCode,
            ) || "NA",

          classification:
            String(
              item.classification ??
                "GOODS",
            ).toUpperCase() ===
            "SERVICES"
              ? "SERVICES"
              : "GOODS",

          quantity:
            numberValue(
              item.quantity,
            ),

          rate:
            numberValue(
              item.unitPrice ??
                item.sellingPrice ??
                item.rate,
            ),

          // ==================================================
          // GST RATE
          // ==================================================

          gstRate:
            numberValue(
              item.gstRate,
            ),

          discountType:
            String(
              item.discountType ??
                "percentage",
            ).toLowerCase() ===
            "fixed"
              ? "fixed"
              : "percentage",

          discountValue:
            numberValue(
              item.discountValue,
            ),

          taxableAmount:
            numberValue(
              item.taxableAmount,
            ),

          cgst:
            numberValue(
              item.cgstAmount ??
                item.cgst,
            ),

          sgst:
            numberValue(
              item.sgstAmount ??
                item.sgst,
            ),

          igst:
            numberValue(
              item.igstAmount ??
                item.igst,
            ),

          cess:
            numberValue(
              item.cessAmount ??
                item.cess,
            ),

          grandTotal:
            numberValue(
              item.lineTotal ??
                item.grandTotal ??
                item.totalAmount,
            ),

          description:
            text(
              item.description,
            ) || undefined,
        } satisfies InvoiceItemFormValues;
      },
    );

  return values;
}