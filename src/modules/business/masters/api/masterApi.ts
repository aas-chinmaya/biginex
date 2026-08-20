import axios from "axios";

import api from "@/services/api";

type ApiResult<T> = {
  status: number;
  message?: string;
  data?: T;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const unwrapData = <T>(response: ApiResult<T> | undefined, fallback: T): T => {
  if (!response) return fallback;
  if (typeof response.status === "number" && response.status >= 400) {
    throw new Error(response.message || "Request failed");
  }

  return response.data ?? fallback;
};

export const categoryMasterApi = {
  list: async () => {
    const { data } = await api.get<ApiResult<any[]>>("/categories/getAllCategories");
    return unwrapData(data, []);
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post<ApiResult<any>>("/categories/createCategory", payload);
    return unwrapData(data, null);
  },
  update: async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResult<any>>(`/categories/updateCategory/${id}`, payload);
    return unwrapData(data, null);
  },
  remove: async (id: string | number) => {
    const { data } = await api.delete<ApiResult<null>>(`/categories/deleteCategory/${id}`);
    return unwrapData(data, null);
  },
  getErrorMessage,
};

export const currencyMasterApi = {
  list: async () => {
    const { data } = await api.get<ApiResult<any[]>>("/currencies/getAllCurrencies");
    return unwrapData(data, []);
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post<ApiResult<any>>("/currencies/createCurrency", payload);
    return unwrapData(data, null);
  },
  update: async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResult<any>>(`/currencies/updateCurrency/${id}`, payload);
    return unwrapData(data, null);
  },
  remove: async (id: string | number) => {
    const { data } = await api.delete<ApiResult<null>>(`/currencies/deleteCurrency/${id}`);
    return unwrapData(data, null);
  },
  getErrorMessage,
};

export const subCategoryMasterApi = {
  list: async () => {
    const { data } = await api.get<ApiResult<any[]>>("/subcategories/getAllSubCategories");
    return unwrapData(data, []);
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post<ApiResult<any>>("/subcategories/addSubCategory", payload);
    return unwrapData(data, null);
  },
  update: async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResult<any>>(`/subcategories/updateSubCategory/${id}`, payload);
    return unwrapData(data, null);
  },
  remove: async (id: string | number) => {
    const { data } = await api.delete<ApiResult<null>>(`/subcategories/deleteSubCategory/${id}`);
    return unwrapData(data, null);
  },
  getErrorMessage,
};

export const registrationTypeMasterApi = {
  list: async () => {
    const { data } = await api.get<ApiResult<any[]>>("/registration-types/getAllRegistrationTypes");
    return unwrapData(data, []);
  },
  create: async (payload: Record<string, unknown>) => {
    const nameValue = typeof payload.registrationName === "string"
      ? payload.registrationName
      : typeof payload.name === "string"
        ? payload.name
        : "";

    const body = {
      name: nameValue,
      description: payload.description,
    };
    const { data } = await api.post<ApiResult<any>>("/registration-types/createRegistrationType", body);
    return unwrapData(data, null);
  },
  update: async (id: string | number, payload: Record<string, unknown>) => {
    const nameValue = typeof payload.registrationName === "string"
      ? payload.registrationName
      : typeof payload.name === "string"
        ? payload.name
        : undefined;

    const body: Record<string, unknown> = {};
    if (typeof nameValue === "string") body.name = nameValue;
    if ("description" in payload) body.description = payload.description;
    if ("status" in payload) body.status = payload.status;
    const { data } = await api.put<ApiResult<any>>(`/registration-types/updateRegistrationType/${id}`, body);
    return unwrapData(data, null);
  },
  remove: async (id: string | number) => {
    const { data } = await api.delete<ApiResult<null>>(`/registration-types/deleteRegistrationType/${id}`);
    return unwrapData(data, null);
  },
  getErrorMessage,
};

export const industryMasterApi = {
  list: async () => {
    const { data } = await api.get<ApiResult<any[]>>("/industries/getAllIndustries");
    return unwrapData(data, []);
  },
  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post<ApiResult<any>>("/industries/createIndustry", payload);
    return unwrapData(data, null);
  },
  update: async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResult<any>>(`/industries/updateIndustry/${id}`, payload);
    return unwrapData(data, null);
  },
  remove: async (id: string | number) => {
    const { data } = await api.delete<ApiResult<null>>(`/industries/deleteIndustry/${id}`);
    return unwrapData(data, null);
  },
  getErrorMessage,
};

export { getErrorMessage };
