// Masters endpoints
export const MASTERS_ENDPOINTS = {
  // Module endpoints
  GET_MODULES: '/modules/fetchModules',
  CREATE_MODULE: '/modules/createModule',
  UPDATE_MODULE: '/modules/updateModule',
  DELETE_MODULE: '/modules/deleteModule',
  
  // Submodule endpoints
  GET_SUBMODULES: '/submodules/fetchSubModules',
  CREATE_SUBMODULE: '/submodules/createSubModule',
  GET_SUBMODULES_BY_MODULE: '/submodules/getSubModulesByModule',
  UPDATE_SUBMODULE: '/submodules/updateSubModule',
  DELETE_SUBMODULE: '/submodules/deleteSubModule',

  // Feature endpoints
  CREATE_FEATURE: '/features/createFeature',
  GET_FEATURES: '/features/getAllFeatures',
  GET_FEATURES_BY_MODULE: '/features/getFeaturesByModule',
  GET_FEATURES_BY_SUBMODULE: '/features/getFeaturesBySubModule',
  UPDATE_FEATURE: '/features/updateFeature',
  DELETE_FEATURE: '/features/deleteFeature',

  // API endpoints
  CREATE_API: '/apis/createApi',
  GET_APIS: '/apis/getAllApis',
  GET_APIS_BY_FEATURE: '/apis/getApisByFeature',
  GET_APIS_BY_MODULE: '/apis/getApisByModule',
  GET_APIS_BY_SUBMODULE: '/apis/getApisBySubModule',
  UPDATE_API: '/apis/updateApi',
  DELETE_API: '/apis/deleteApi',

  // Role endpoints
  CREATE_ROLE: '/roles/createRole',
  GET_ROLES: '/roles/getAllRoles',
  UPDATE_ROLE: '/roles/UpdateRole',
  DELETE_ROLE: '/roles/DeleteRole',
};
