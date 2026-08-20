import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { invoiceItemService } from "../service/invoice-item.service";

import type { InvoiceItemState } from "../types/invoice-item";

// ---------------------------------------------------------
// Initial State
// ---------------------------------------------------------

const initialState: InvoiceItemState = {
  list: [],
  loading: false,
  error: null,
};

// ---------------------------------------------------------
// Fetch Invoice Items
// ---------------------------------------------------------

export const fetchInvoiceItems = createAsyncThunk(
  "invoiceItem/fetchInvoiceItems",
  async (search?: string) => {
    const response = await invoiceItemService.getItems(search);

    return response.data;
  }
);

// ---------------------------------------------------------
// Invoice Item Slice
// ---------------------------------------------------------

const invoiceItemSlice = createSlice({
  name: "invoiceItem",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      // -----------------------------------------------------
      // Pending
      // -----------------------------------------------------
      .addCase(fetchInvoiceItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // -----------------------------------------------------
      // Fulfilled
      // -----------------------------------------------------
      .addCase(fetchInvoiceItems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      // -----------------------------------------------------
      // Rejected
      // -----------------------------------------------------
      .addCase(fetchInvoiceItems.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to fetch invoice items";
      });
  },
});

export default invoiceItemSlice.reducer;