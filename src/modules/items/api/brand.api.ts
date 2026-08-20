import api from "@/services/api";

export const brandApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/brands/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/brands/getbyid/${id}`);
  },

  create(data: any) {
    return api.post("/brands/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/brands/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/brands/delete/${id}`);
  },
};
