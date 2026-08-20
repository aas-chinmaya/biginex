import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { Vendor } from "../types";
import { vendorApi } from "../api/vendor.api";

interface VendorState {
  vendors: Vendor[];
  currentVendor: Vendor | null;
  loading: boolean;
  error: string | null;
  importing: boolean;
  exporting: boolean;
  downloadingTemplate: boolean;
  importResult: string | null;
  exportResult: string | null;
  progress: number;
  sectionsSaved: Record<string, boolean>;
}

const initialState: VendorState = {
  vendors: [],
  currentVendor: null,
  loading: false,
  error: null,
  importing: false,
  exporting: false,
  downloadingTemplate: false,
  importResult: null,
  exportResult: null,
  progress: 0,
  sectionsSaved: {
    basic: false,
    contact: false,
    address: false,
    bank: false,
    gst: false,
    purchase: false,
    documents: false,
  },
};

const SECTIONS = [
  "basic",
  "contact",
  "address",
  "bank",
  "gst",
  "purchase",
  "documents",
];

const calcProgress = (sections: Record<string, boolean>) => {
  const total = SECTIONS.length;
  const done = SECTIONS.reduce((acc, k) => acc + (sections[k] ? 1 : 0), 0);
  return Math.round((done / total) * 100);
};

// Async thunks for step-wise saving
export const createBasicInformation = createAsyncThunk(
  "vendors/createBasicInformation",
  async (payload: Record<string, any>, { rejectWithValue }) => {
    try {
      const res = await vendorApi.createBasicInformation(payload);
      return res?.data?.data ?? res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const saveContact = createAsyncThunk(
  "vendors/saveContact",
  async ({ vendorId, data }: { vendorId?: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      if (!vendorId) return rejectWithValue("Missing vendorId");
      const res = await vendorApi.saveContact(vendorId, data);
      return res?.data?.data ?? res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const saveAddress = createAsyncThunk(
  "vendors/saveAddress",
  async ({ vendorId, data }: { vendorId?: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      if (!vendorId) return rejectWithValue("Missing vendorId");
      const res = await vendorApi.saveAddress(vendorId, data);
      return res?.data?.data ?? res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const saveBanking = createAsyncThunk(
  "vendors/saveBanking",
  async ({ vendorId, data }: { vendorId?: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      if (!vendorId) return rejectWithValue("Missing vendorId");
      const res = await vendorApi.saveBanking(vendorId, data);
      return res?.data?.data ?? res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const saveGSTTax = createAsyncThunk(
  "vendors/saveGSTTax",
  async ({ vendorId, data }: { vendorId?: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      if (!vendorId) return rejectWithValue("Missing vendorId");
      const res = await vendorApi.saveGSTTax(vendorId, data);
      return res?.data?.data ?? res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const savePurchase = createAsyncThunk(
  "vendors/savePurchase",
  async ({ vendorId, data }: { vendorId?: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      if (!vendorId) return rejectWithValue("Missing vendorId");
      const res = await vendorApi.savePurchase(vendorId, data);
      return res?.data?.data ?? res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const uploadVendorDocument = createAsyncThunk(
  "vendors/uploadVendorDocument",
  async ({ vendorId, data }: { vendorId: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      if (!vendorId) return rejectWithValue("Missing vendorId");
      // data expected to be FormData
      const res = await vendorApi.uploadDocuments(vendorId, data as FormData);
      return res?.data?.data ?? res?.data ?? null;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    setVendors(state, action: PayloadAction<Vendor[]>) {
      state.vendors = action.payload;
    },

    setCurrentVendor(state, action: PayloadAction<Vendor | null>) {
      state.currentVendor = action.payload;
    },

    setVendorLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setVendorError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    clearVendorError(state) {
      state.error = null;
    },

    setVendorImporting(state, action: PayloadAction<boolean>) {
      state.importing = action.payload;
    },

    setVendorExporting(state, action: PayloadAction<boolean>) {
      state.exporting = action.payload;
    },

    setVendorTemplateDownloading(state, action: PayloadAction<boolean>) {
      state.downloadingTemplate = action.payload;
    },

    setVendorImportResult(state, action: PayloadAction<string | null>) {
      state.importResult = action.payload;
    },

    setVendorExportResult(state, action: PayloadAction<string | null>) {
      state.exportResult = action.payload;
    },

    addVendor(state, action: PayloadAction<Vendor>) {
      state.vendors.unshift(action.payload);
    },

    updateVendor(state, action: PayloadAction<Vendor>) {
      state.vendors = state.vendors.map((vendor) =>
        vendor.id === action.payload.id ? action.payload : vendor
      );

      if (state.currentVendor?.id === action.payload.id) {
        state.currentVendor = action.payload;
      }
    },

    removeVendor(state, action: PayloadAction<string>) {
      state.vendors = state.vendors.filter((vendor) => vendor.id !== action.payload);

      if (state.currentVendor?.id === action.payload) {
        state.currentVendor = null;
      }
    },
    markSectionSaved(state, action: PayloadAction<string>) {
      const section = action.payload;
      state.sectionsSaved[section] = true;
      state.progress = calcProgress(state.sectionsSaved);
    },
    resetProgress(state) {
      state.progress = 0;
      Object.keys(state.sectionsSaved).forEach((k) => {
        state.sectionsSaved[k] = false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBasicInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBasicInformation.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.currentVendor = action.payload;
          state.vendors.unshift(action.payload);
          state.sectionsSaved.basic = true;
          state.progress = calcProgress(state.sectionsSaved);
        }
      })
      .addCase(createBasicInformation.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? String(action.payload);
      })

      .addCase(saveContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveContact.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.currentVendor = action.payload;
          state.sectionsSaved.contact = true;
          state.progress = calcProgress(state.sectionsSaved);
        }
      })
      .addCase(saveContact.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? String(action.payload);
      })

      .addCase(saveAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.currentVendor = action.payload;
          state.sectionsSaved.address = true;
          state.progress = calcProgress(state.sectionsSaved);
        }
      })
      .addCase(saveAddress.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? String(action.payload);
      })

      .addCase(saveBanking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBanking.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.currentVendor = action.payload;
          state.sectionsSaved.bank = true;
          state.progress = calcProgress(state.sectionsSaved);
        }
      })
      .addCase(saveBanking.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? String(action.payload);
      })

      .addCase(saveGSTTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveGSTTax.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.currentVendor = action.payload;
          state.sectionsSaved.gst = true;
          state.progress = calcProgress(state.sectionsSaved);
        }
      })
      .addCase(saveGSTTax.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? String(action.payload);
      })

      .addCase(savePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePurchase.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.currentVendor = action.payload;
          state.sectionsSaved.purchase = true;
          state.progress = calcProgress(state.sectionsSaved);
        }
      })
      .addCase(savePurchase.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? String(action.payload);
      })

      .addCase(uploadVendorDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVendorDocument.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload) {
          state.currentVendor = action.payload;
          state.sectionsSaved.documents = true;
          state.progress = calcProgress(state.sectionsSaved);
        }
      })
      .addCase(uploadVendorDocument.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload ?? String(action.payload);
      });
  },
});

export const {
  setVendors,
  setCurrentVendor,
  setVendorLoading,
  setVendorError,
  clearVendorError,
  setVendorImporting,
  setVendorExporting,
  setVendorTemplateDownloading,
  setVendorImportResult,
  setVendorExportResult,
  addVendor,
  updateVendor,
  removeVendor,
  markSectionSaved,
  resetProgress,
} = vendorSlice.actions;

export default vendorSlice.reducer;
