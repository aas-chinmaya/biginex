import { variantValueApi } from "../api/variant-value.api";

export const variantValueservice = {
  getVariantValues(page = 1, limit = 10) {
    return variantValueApi.getAll(page, limit);
  },

  getVariantValueById(id: string) {
    return variantValueApi.getById(id);
  },

  createVariantValue(data: any) {
    return variantValueApi.create(data);
  },

  updateVariantValue(id: string, data: any) {
    return variantValueApi.update(id, data);
  },

  deleteVariantValue(id: string) {
    return variantValueApi.delete(id);
  },
};
