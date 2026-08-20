import api from "@/services/api";

export const taxMasterApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/taxes/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/taxes/getbyid/${id}`);
  },

  create(data: any) {
    return api.post("/taxes/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/taxes/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/taxes/delete/${id}`);
  },
};
