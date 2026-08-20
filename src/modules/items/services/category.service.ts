import { categoryApi } from "../api/category.api";

export const categoryservice = {
  getCategories(page = 1, limit = 10) {
    return categoryApi.getAll(page, limit);
  },

  getCategoryById(id: string) {
    return categoryApi.getById(id);
  },

  createCategory(data: any) {
    return categoryApi.create(data);
  },

  updateCategory(id: string, data: any) {
    return categoryApi.update(id, data);
  },

  deleteCategory(id: string) {
    return categoryApi.delete(id);
  },

  restoreCategory(id: string) {
    return categoryApi.restore(id);
  },
};
