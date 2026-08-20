import axios from 'axios';
import api from '@/services/api';
import { MASTERS_ENDPOINTS } from '@/modules/masters/endpoint/master.endpoint';
import type { Module, Submodule, Feature, API, Role } from '../types';

// Helper function to extract data from different response structures
const extractData = <T>(response: any): T[] => {
  const candidates = [response, response?.data, response?.result];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate?.modules && Array.isArray(candidate.modules)) return candidate.modules;
    if (candidate?.subModules && Array.isArray(candidate.subModules)) return candidate.subModules;
    if (candidate?.features && Array.isArray(candidate.features)) return candidate.features;
    if (candidate?.apis && Array.isArray(candidate.apis)) return candidate.apis;
    if (candidate?.roles && Array.isArray(candidate.roles)) return candidate.roles;
    if (candidate?.data && Array.isArray(candidate.data)) return candidate.data;
    if (candidate?.items && Array.isArray(candidate.items)) return candidate.items;
    if (candidate?.result && Array.isArray(candidate.result)) return candidate.result;
  }

  return [];
};

// Module API functions
export const getModules = async (search?: string): Promise<Module[]> => {
  try {
    const params = search ? { search } : {};
    const response = await api.get<any>(MASTERS_ENDPOINTS.GET_MODULES, { params });
    return extractData<Module>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch modules');
    }
    throw error;
  }
};

export const createModule = async (moduleData: Module): Promise<Module> => {
  try {
    const response = await api.post<Module>(MASTERS_ENDPOINTS.CREATE_MODULE, moduleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create module');
    }
    throw error;
  }
};

export const updateModule = async (id: string, moduleData: Module): Promise<Module> => {
  try {
    const response = await api.put<Module>(`${MASTERS_ENDPOINTS.UPDATE_MODULE}/${id}`, moduleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update module');
    }
    throw error;
  }
};

export const deleteModule = async (id: string): Promise<void> => {
  try {
    await api.delete(`${MASTERS_ENDPOINTS.DELETE_MODULE}/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete module');
    }
    throw error;
  }
};

// Submodule API functions
export const getSubmodules = async (moduleId?: string, search?: string): Promise<Submodule[]> => {
  try {
    let endpoint = MASTERS_ENDPOINTS.GET_SUBMODULES;
    const params: any = {};
    
    if (moduleId) {
      endpoint = `${MASTERS_ENDPOINTS.GET_SUBMODULES_BY_MODULE}/${moduleId}`;
    }
    if (search) params.search = search;
    
    const response = await api.get<any>(endpoint, { params });
    return extractData<Submodule>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submodules');
    }
    throw error;
  }
};

export const createSubmodule = async (submoduleData: Submodule): Promise<Submodule> => {
  try {
    const response = await api.post<Submodule>(
      MASTERS_ENDPOINTS.CREATE_SUBMODULE,
      submoduleData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create submodule');
    }
    throw error;
  }
};

export const updateSubmodule = async (id: string, submoduleData: Submodule): Promise<Submodule> => {
  try {
    const response = await api.put<Submodule>(
      `${MASTERS_ENDPOINTS.UPDATE_SUBMODULE}/${id}`,
      submoduleData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update submodule');
    }
    throw error;
  }
};

export const deleteSubmodule = async (id: string): Promise<void> => {
  try {
    await api.delete(`${MASTERS_ENDPOINTS.DELETE_SUBMODULE}/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete submodule');
    }
    throw error;
  }
};

// Feature API functions
export const getFeatures = async (search?: string): Promise<Feature[]> => {
  try {
    const params = search ? { search } : {};
    const response = await api.get<any>(MASTERS_ENDPOINTS.GET_FEATURES, { params });
    return extractData<Feature>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch features');
    }
    throw error;
  }
};

export const getFeaturesByModule = async (moduleId: string | number): Promise<Feature[]> => {
  try {
    const response = await api.get<any>(`${MASTERS_ENDPOINTS.GET_FEATURES_BY_MODULE}/${moduleId}`);
    return extractData<Feature>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch features');
    }
    throw error;
  }
};

export const getFeaturesBySubModule = async (subModuleId: string | number): Promise<Feature[]> => {
  try {
    const response = await api.get<any>(`${MASTERS_ENDPOINTS.GET_FEATURES_BY_SUBMODULE}/${subModuleId}`);
    return extractData<Feature>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch features');
    }
    throw error;
  }
};

export const createFeature = async (featureData: Feature): Promise<Feature> => {
  try {
    const response = await api.post<Feature>(MASTERS_ENDPOINTS.CREATE_FEATURE, featureData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create feature');
    }
    throw error;
  }
};

export const updateFeature = async (id: string | number, featureData: Feature): Promise<Feature> => {
  try {
    const response = await api.put<Feature>(`${MASTERS_ENDPOINTS.UPDATE_FEATURE}/${id}`, featureData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update feature');
    }
    throw error;
  }
};

export const deleteFeature = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`${MASTERS_ENDPOINTS.DELETE_FEATURE}/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete feature');
    }
    throw error;
  }
};

// API API functions
export const getApis = async (search?: string): Promise<API[]> => {
  try {
    const params = search ? { search } : {};
    const response = await api.get<any>(MASTERS_ENDPOINTS.GET_APIS, { params });
    return extractData<API>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch APIs');
    }
    throw error;
  }
};

export const getApisByFeature = async (featureId: string | number): Promise<API[]> => {
  try {
    const response = await api.get<any>(`${MASTERS_ENDPOINTS.GET_APIS_BY_FEATURE}/${featureId}`);
    return extractData<API>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch APIs');
    }
    throw error;
  }
};

export const getApisByModule = async (moduleId: string | number): Promise<API[]> => {
  try {
    const response = await api.get<any>(`${MASTERS_ENDPOINTS.GET_APIS_BY_MODULE}/${moduleId}`);
    return extractData<API>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch APIs');
    }
    throw error;
  }
};

export const getApisBySubModule = async (subModuleId: string | number): Promise<API[]> => {
  try {
    const response = await api.get<any>(`${MASTERS_ENDPOINTS.GET_APIS_BY_SUBMODULE}/${subModuleId}`);
    return extractData<API>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch APIs');
    }
    throw error;
  }
};

export const createApi = async (apiData: API): Promise<API> => {
  try {
    const response = await api.post<API>(MASTERS_ENDPOINTS.CREATE_API, apiData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create API');
    }
    throw error;
  }
};

export const updateApi = async (id: string | number, apiData: API): Promise<API> => {
  try {
    const response = await api.put<API>(`${MASTERS_ENDPOINTS.UPDATE_API}/${id}`, apiData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update API');
    }
    throw error;
  }
};

export const deleteApi = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`${MASTERS_ENDPOINTS.DELETE_API}/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete API');
    }
    throw error;
  }
};

// Role API functions
export const getRoles = async (search?: string): Promise<Role[]> => {
  try {
    const params = search ? { search } : {};
    const response = await api.get<any>(MASTERS_ENDPOINTS.GET_ROLES, { params });
    return extractData<Role>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
    throw error;
  }
};

export const createRole = async (roleData: Role): Promise<Role> => {
  try {
    const response = await api.post<Role>(MASTERS_ENDPOINTS.CREATE_ROLE, roleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create role');
    }
    throw error;
  }
};

export const updateRole = async (id: string | number, roleData: Role): Promise<Role> => {
  try {
    const response = await api.put<Role>(`${MASTERS_ENDPOINTS.UPDATE_ROLE}/${id}`, roleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update role');
    }
    throw error;
  }
};

export const deleteRole = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`${MASTERS_ENDPOINTS.DELETE_ROLE}/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete role');
    }
    throw error;
  }
};
