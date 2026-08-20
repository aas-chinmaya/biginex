import api from "@/services/api";

export const unitApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/units/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/units/getby/${id}`);
  },

  create(data: any) {
    return api.post("/units/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/units/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/units/delete/${id}`);
  },

  restore(id: string) {
    return api.patch(`/units/${id}/restore`);
  },
};
