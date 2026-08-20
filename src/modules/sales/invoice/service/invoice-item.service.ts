import { invoiceItemApi } from "../api/invoice-item.api";

export const invoiceItemService = {
  // ---------------------------------------------------------
  // Invoice Item Services
  // ---------------------------------------------------------

  getItems(search?: string) {
    return invoiceItemApi.getItems(search);
  },
};