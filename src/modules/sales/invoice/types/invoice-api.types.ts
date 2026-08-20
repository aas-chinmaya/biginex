import type {
  DiscountType,
  InvoiceType,
} from "./invoice.types";

export interface InvoiceItemPayload {
  productId: string;

  quantity: number;
  rate: number;

  discountType: DiscountType;
  discountValue: number;
}

export interface CreateDraftPayload {
  invoiceType: InvoiceType;

  invoiceNumber?: string;
  invoiceDate?: string;

  customerId?: string;

  items: InvoiceItemPayload[];

  notes?: string;
  terms?: string;
}

export interface UpdateDraftPayload {
  invoiceType?: InvoiceType;

  invoiceNumber?: string;
  invoiceDate?: string;

  customerId?: string;

  items?: InvoiceItemPayload[];

  notes?: string;
  terms?: string;
}

export interface FinalizeDraftPayload {
  invoiceDate?: string;
  customerId?: string;

  items?: InvoiceItemPayload[];

  notes?: string;
  terms?: string;
}

export interface CreateInvoicePayload {
  invoiceType: InvoiceType;

  invoiceNumber?: string;
  invoiceDate: string;

  customerId: string;

  items: InvoiceItemPayload[];

  notes?: string;
  terms?: string;
}