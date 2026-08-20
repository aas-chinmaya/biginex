import api from "@/services/api";

export const variantTypeApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/variant-types/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/variant-types/getby/${id}`);
  },

  create(data: any) {
    return api.post("/variant-types/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/variant-types/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/variant-types/delete/${id}`);
  },
};
