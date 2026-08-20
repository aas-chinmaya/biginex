import api from "@/services/api";

export const categoryApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/categories/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/categories/getby/${id}`);
  },

  create(data: any) {
    return api.post("/categories/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/categories/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/categories/delete/${id}`);
  },

  // restore(id: string) {
  //   return api.patch(`/categories/${id}/restore`);
  // },
};
