import { brandApi } from "../api/brand.api";

export const brandservice = {
  getBrands(page = 1, limit = 10) {
    return brandApi.getAll(page, limit);
  },

  getBrandById(id: string) {
    return brandApi.getById(id);
  },

  createBrand(data: any) {
    return brandApi.create(data);
  },

  updateBrand(id: string, data: any) {
    return brandApi.update(id, data);
  },

  deleteBrand(id: string) {
    return brandApi.delete(id);
  },

  restoreBrand(id: string) {
    return brandApi.restore(id);
  },
};
