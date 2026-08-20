import api from "@/services/api";

export const variantValueApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/variant-values/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/variant-values/getbyid/${id}`);
  },

  create(data: any) {
    return api.post("/variant-values/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/variant-values/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/variant-values/delete/${id}`);
  },
};
