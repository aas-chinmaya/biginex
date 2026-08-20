import { vendorApi } from "../api/vendor.api";

export const vendorService = {
  getVendors(params?: { page?: number; limit?: number }) {
    return vendorApi.getAll(params);
  },

  getVendorById(id: string) {
    return vendorApi.getById(id);
  },

  searchVendors(keyword: string) {
    return vendorApi.search(keyword);
  },

  createVendor(data: Record<string, any>) {
    return vendorApi.create(data);
  },

  updateVendor(id: string, data: Record<string, any>) {
    return vendorApi.update(id, data);
  },

  changeVendorStatus(id: string, status: string) {
    return vendorApi.changeStatus(id, status);
  },

  deleteDocument(documentId: string) {
    return vendorApi.deleteDocument(documentId);
  },

  deleteVendor(id: string) {
    return vendorApi.delete(id);
  },

  exportVendors(params?: { page?: number; limit?: number; tenantId?: string }) {
    return vendorApi.exportVendors(params);
  },

  downloadVendorTemplate(params?: { page?: number; limit?: number }) {
    return vendorApi.downloadVendorTemplate(params);
  },

  importVendors(file: File, params?: Record<string, unknown>) {
    return vendorApi.importVendors(file, params);
  },
};

export const vendorservice = vendorService;
