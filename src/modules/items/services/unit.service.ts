import { unitApi } from "../api/unit.api";

export const unitservice = {
  getUnits(page = 1, limit = 10) {
    return unitApi.getAll(page, limit);
  },

  getUnitById(id: string) {
    return unitApi.getById(id);
  },

  createUnit(data: any) {
    return unitApi.create(data);
  },

  updateUnit(id: string, data: any) {
    return unitApi.update(id, data);
  },

  deleteUnit(id: string) {
    return unitApi.delete(id);
  },

  restoreUnit(id: string) {
    return unitApi.restore(id);
  },
};
