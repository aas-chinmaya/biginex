import { businessApi } from "../api/business.api";

export const businessService = {
  async getBusinesses() {
    const response = await businessApi.getBusinesses();
    return response.data?.data ?? [];
  },

  async getBusinessById(id: string) {
    const response = await businessApi.getBusinessById(id);
    return response.data?.data ?? null;
  },

  async updateBusiness(id: string, payload: Record<string, unknown> & { logo?: File | null }) {
    const response = await businessApi.updateBusiness(id, payload);
    return response.data?.data ?? null;
  },

  async deleteBusiness(id: string) {
    const response = await businessApi.deleteBusiness(id);
    return response.data?.data ?? null;
  },

  async createBranch(tenantId: string | number, payload: Record<string, unknown>) {
    const response = await businessApi.createBranch(tenantId, payload as any);
    return response.data?.data ?? null;
  },

  async updateBranch(branchId: string, payload: Record<string, unknown>) {
    const response = await businessApi.updateBranch(branchId, payload as any);
    return response.data?.data ?? null;
  },

  async deleteBranch(branchId: string) {
    const response = await businessApi.deleteBranch(branchId);
    return response.data?.data ?? null;
  },
};
