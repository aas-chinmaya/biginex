import { variantTypeApi } from "../api/variant-type.api";

export const variantTypeservice = {
  getVariantTypes(page = 1, limit = 10) {
    return variantTypeApi.getAll(page, limit);
  },

  getVariantTypeById(id: string) {
    return variantTypeApi.getById(id);
  },

  createVariantType(data: any) {
    return variantTypeApi.create(data);
  },

  updateVariantType(id: string, data: any) {
    return variantTypeApi.update(id, data);
  },

  deleteVariantType(id: string) {
    return variantTypeApi.delete(id);
  },
};
