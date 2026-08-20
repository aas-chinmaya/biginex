import api from "@/services/api";

export const productApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/products/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/products/getbyid/${id}`);
  },

  create(data: any) {
    return api.post("/products/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/products/updatebyid/${id}`, data);
  },

  updateStatus(id: string, status: boolean) {
    return api.put(`/products/updatebyid/${id}`, { status });
  },

  delete(id: string) {
    return api.delete(`/products/deletebyid/${id}`);
  },
};
