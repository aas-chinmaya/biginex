


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "../types";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  selectedCustomer: Customer | null;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  selectedCustomer: null,
  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    // Set all customers
    setCustomers(state, action: PayloadAction<Customer[]>) {
      state.customers = action.payload;
      state.totalRecords = action.payload.length;
    },

    // Add new customer
    addCustomer(state, action: PayloadAction<Customer>) {
      state.customers.push(action.payload);
      state.totalRecords += 1;
    },

    // Update customer
    updateCustomer(state, action: PayloadAction<Customer>) {
      const index = state.customers.findIndex(
        (customer) => customer.id === action.payload.id
      );
      if (index >= 0) {
        state.customers[index] = action.payload;
      }
    },

    // Remove customer
    removeCustomer(state, action: PayloadAction<string>) {
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload
      );
      state.totalRecords -= 1;
    },

    // Set selected customer
    setSelectedCustomer(state, action: PayloadAction<Customer | null>) {
      state.selectedCustomer = action.payload;
    },

    // Set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Set error
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Set pagination
    setPagination(state, action: PayloadAction<{ page: number; pageSize: number }>) {
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.pageSize;
    },

    // Clear customers
    clearCustomers(state) {
      state.customers = [];
      state.selectedCustomer = null;
      state.error = null;
    },
  },
});

export const {
  setCustomers,
  addCustomer,
  updateCustomer,
  removeCustomer,
  setSelectedCustomer,
  setLoading,
  setError,
  setPagination,
  clearCustomers,
} = customersSlice.actions;

export default customersSlice.reducer;
