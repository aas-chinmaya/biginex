



// import api from "@/services/api";
// import { CUSTOMER_ENDPOINTS } from "../endpoint/customers.endpoint";

// export const customerApi = {
//   // Fetch all customers
//   getAll() {
//     return api.get(CUSTOMER_ENDPOINTS.CUSTOMERS);
//   },

//   // Fetch paginated customers (optional, if backend supports)
//   getAllPaginated(page: number = 1, pageSize: number = 10) {
//     return api.get(CUSTOMER_ENDPOINTS.CUSTOMERS, {
//       params: { page, pageSize },
//     });
//   },

//   // Fetch customer by ID
//   getById(id: string) {
//     return api.get(CUSTOMER_ENDPOINTS.CUSTOMER(id));
//   },

//   // Create new customer
//   create(data: any) {
//     return api.post(CUSTOMER_ENDPOINTS.CREATE_CUSTOMERS, data);
//   },

//   // Update customer
//   update(id: string, data: any) {
//     return api.put(CUSTOMER_ENDPOINTS.CUSTOMER(id), data);
//   },

//   // Delete customer
//   delete(id: string) {
//     return api.delete(CUSTOMER_ENDPOINTS.CUSTOMER(id));
//   },
// };






import api from "@/services/api";
import { CUSTOMER_ENDPOINTS } from "../endpoint/customers.endpoint";

export const customerApi = {
  // Create new customer
  create(data: any) {
    return api.post(CUSTOMER_ENDPOINTS.CREATE, data);
  },

  // Fetch all customers
  getAll() {
    return api.get(CUSTOMER_ENDPOINTS.FETCH_ALL);
  },

  // Fetch paginated customers (optional, if backend supports pagination via query params)
  getAllPaginated(page: number = 1, pageSize: number = 10) {
    return api.get(CUSTOMER_ENDPOINTS.FETCH_ALL, {
      params: { page, pageSize },
    });
  },

  // Fetch customer by ID
  getById(id: string) {
    return api.get(CUSTOMER_ENDPOINTS.FETCH_BY_ID(id));
  },

  // Update customer
  update(id: string, data: any) {
    return api.patch(CUSTOMER_ENDPOINTS.UPDATE(id), data);
  },

  // Delete customer
  delete(id: string) {
    return api.delete(CUSTOMER_ENDPOINTS.DELETE(id));
  },
};
