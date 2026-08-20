import { taxMasterApi } from "../api/tax-master.api";

export const taxMasterservice = {
  getTaxMasters(page = 1, limit = 10) {
    return taxMasterApi.getAll(page, limit);
  },

  getTaxMasterById(id: string) {
    return taxMasterApi.getById(id);
  },

  createTaxMaster(data: any) {
    return taxMasterApi.create(data);
  },

  updateTaxMaster(id: string, data: any) {
    return taxMasterApi.update(id, data);
  },

  deleteTaxMaster(id: string) {
    return taxMasterApi.delete(id);
  },
};
