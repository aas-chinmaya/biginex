// invoice.types.ts

export type InvoiceType =
  | "B2B"
  | "B2C"
  | "EXPORT"
  | "SEZ";

export type InvoiceStatus =
  | "Draft"
  | "Pending"
  | "Issued"
  | "Cancelled";

export type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Partially Paid"
  | "Unpaid"
  | "Overdue";

export type DiscountType =
  | "fixed"
  | "percentage";