import type {
  InvoiceStatus,
  InvoiceType,
  PaymentStatus,
} from "./invoice.types";

export interface InvoiceListItem {
  id: string;
  invoiceId: string;

  invoiceNumber: string;
  invoiceDate: string;

  customerId: string;
  customerName: string;

  invoiceType: InvoiceType;

  totalAmount: number;

  paymentStatus: PaymentStatus;
  invoiceStatus: InvoiceStatus;
}

export interface InvoiceListState {
  items: InvoiceListItem[];

  loading: boolean;
  error: string | null;
}