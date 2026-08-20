import api from "@/services/api";

import {
  BusinessAddressData,
  BusinessBankData,
  BusinessBranchData,
  BusinessDocumentData,
} from "../setup/validation";

type BackendBusinessResponse<T = unknown> = {
  status: number;
  message: string;
  data: T;
};

const toAddressPayload = (data: BusinessAddressData) => ({
  addressLine1: data.addressLine1,
  addressLine2: data.addressLine2,
  pincode: data.pincode,
  country: data.countryId,
  state: data.stateId,
  city: data.cityId,
  isPrimary: data.isPrimary,
});

export const businessApi = {
  createBusiness(data: Record<string, unknown> & { logo?: File | null }) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'logo' || value === null || value === undefined || value === '') return;
      formData.append(key, String(value));
    });

    if (data.logo instanceof File) {
      formData.append('logo', data.logo);
    }

    return api.post<BackendBusinessResponse>(
      "/business",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
  },

  getBusinesses() {
    return api.get<BackendBusinessResponse>('/business/getAllBusinesses');
  },

  getBusinessById(id: string) {
    return api.get<BackendBusinessResponse>(`/business/getBusinessById/${id}`);
  },

  updateBusiness(id: string, data: Record<string, unknown> & { logo?: File | null }) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'logo' || value === null || value === undefined || value === '') return;
      formData.append(key, String(value));
    });

    if (data.logo instanceof File) {
      formData.append('logo', data.logo);
    }

    return api.put<BackendBusinessResponse>(`/business/updateBusiness/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteBusiness(id: string) {
    return api.delete<BackendBusinessResponse>(`/business/deleteBusiness/${id}`);
  },

  createAddress(tenantId: number | string, data: BusinessAddressData) {
    return api.post('/business/business-addresses', {
      tenantId,
      ...toAddressPayload(data),
    });
  },

  createBank(tenantId: number | string, data: BusinessBankData) {
    return api.post('/business/business-banks', {
      tenantId,
      ...data,
    });
  },

  createBranch(tenantId: number | string, data: BusinessBranchData) {
    const payload: Record<string, unknown> = {
      tenantId,
      branchName: data.branchName ?? null,
      phone: data.phone,
      email: data.email,
      pincode: data.pincode,
      country: data.countryId,
      state: data.stateId,
      city: data.cityId,
    };

    if (data.managerId && data.managerId.trim()) {
      payload.userId = data.managerId;
    }

    return api.post('/business/business-branches/createBranch', payload);
  },

  updateBranch(branchId: string, data: BusinessBranchData) {
    const payload: Record<string, unknown> = {
      branchName: data.branchName ?? null,
      phone: data.phone,
      email: data.email,
      pincode: data.pincode,
      country: data.countryId,
      state: data.stateId,
      city: data.cityId,
    };

    if (data.branchCode) {
      payload.branchCode = data.branchCode;
    }

    if (data.managerId && data.managerId.trim()) {
      payload.userId = data.managerId;
    }

    return api.put(`/business/business-branches/updateBranch/${branchId}`, payload);
  },

  deleteBranch(branchId: string) {
    return api.delete(`/business/business-branches/deleteBranch/${branchId}`);
  },

  uploadDocument(tenantId: number | string, doc: BusinessDocumentData) {
    const form = new FormData();

    form.append('tenantId', String(tenantId));
    form.append('documentType', doc.documentType);

    if (doc.file instanceof File) {
      form.append('file', doc.file);
    }

    if (doc.fileName) {
      form.append('fileName', doc.fileName);
    }

    if (doc.fileUrl) {
      form.append('fileUrl', doc.fileUrl);
    }

    return api.post('/business/business-documents/createDocument', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
