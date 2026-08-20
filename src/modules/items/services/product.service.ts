import { productApi } from "../api/product.api";

export const productservice = {
  getProducts(page = 1, limit = 10) {
    return productApi.getAll(page, limit);
  },

  getProductById(id: string) {
    return productApi.getById(id);
  },

  createProduct(data: any) {
    return productApi.create(data);
  },

  updateProduct(id: string, data: any) {
    return productApi.update(id, data);
  },

  updateProductStatus(id: string, status: boolean) {
    return productApi.updateStatus(id, status);
  },

  deleteProduct(id: string) {
    return productApi.delete(id);
  },
};
