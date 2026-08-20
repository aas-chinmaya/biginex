import { subCategoryApi } from "../api/sub-category.api";

export const subCategoryservice = {
  getSubCategories(page = 1, limit = 10) {
    return subCategoryApi.getAll(page, limit);
  },

  getSubCategoryById(id: string) {
    return subCategoryApi.getById(id);
  },

  createSubCategory(data: any) {
    return subCategoryApi.create(data);
  },

  updateSubCategory(id: string, data: any) {
    return subCategoryApi.update(id, data);
  },

  deleteSubCategory(id: string) {
    return subCategoryApi.delete(id);
  },

//   restoreSubCategory(id: string) {
//     return subCategoryApi.restore(id);
//   },
};
