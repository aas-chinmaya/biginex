import api from "@/services/api";

export const subCategoryApi = {
  getAll(page = 1, limit = 10) {
    return api.get("/sub-categories/getall", {
      params: {
        page,
        limit,
      },
    });
  },

  getById(id: string) {
    return api.get(`/sub-categories/getbyid/${id}`);
  },

  create(data: any) {
    return api.post("/sub-categories/create", data);
  },

  update(id: string, data: any) {
    return api.put(`/sub-categories/update/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/sub-categories/delete/${id}`);
  },

//   restore(id: string) {
//     return api.patch(`/subcategories/${id}/restore`);
//   },
};
