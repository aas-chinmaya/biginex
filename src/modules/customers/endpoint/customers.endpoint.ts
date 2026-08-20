// export const CUSTOMER_ENDPOINTS = {
//   CUSTOMERS: "/customers/fetch",
//   CREATE_CUSTOMERS: "/customers/create",
// };



// Customer API Endpoints
export const CUSTOMER_ENDPOINTS = {
  // Create a new customer
  CREATE: "/customers/create",

  // Fetch all customers
  FETCH_ALL: "/customers/fetch",

  // Fetch customer by ID
  FETCH_BY_ID: (id: string) => `/customers/fetch/${id}`,

  // Update customer
  UPDATE: (id: string) => `/customers/update/${id}`,

  // Delete customer
  DELETE: (id: string) => `/customers/delete/${id}`,
};
