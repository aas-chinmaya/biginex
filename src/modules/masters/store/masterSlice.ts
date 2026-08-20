import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Module, Submodule, Feature, API, Role } from '@/modules/masters/types';
import { notify } from '@/lib/toast';
import {
  getModules as getModulesAPI,
  createModule as createModuleAPI,
  updateModule as updateModuleAPI,
  deleteModule as deleteModuleAPI,
  getSubmodules as getSubmodulesAPI,
  createSubmodule as createSubmoduleAPI,
  updateSubmodule as updateSubmoduleAPI,
  deleteSubmodule as deleteSubmoduleAPI,
  getFeatures as getFeaturesAPI,
  getFeaturesByModule as getFeaturesByModuleAPI,
  getFeaturesBySubModule as getFeaturesBySubModuleAPI,
  createFeature as createFeatureAPI,
  updateFeature as updateFeatureAPI,
  deleteFeature as deleteFeatureAPI,
  getApis as getApisAPI,
  getApisByFeature as getApisByFeatureAPI,
  getApisByModule as getApisByModuleAPI,
  getApisBySubModule as getApisBySubModuleAPI,
  createApi as createApiAPI,
  updateApi as updateApiAPI,
  deleteApi as deleteApiAPI,
  getRoles as getRolesAPI,
  createRole as createRoleAPI,
  updateRole as updateRoleAPI,
  deleteRole as deleteRoleAPI,
} from '@/modules/masters/api/master.api';

export interface MastersState {
  // Modules
  modules: Module[];
  modulesLoading: boolean;
  modulesError: string | null;
  
  // Submodules
  submodules: Submodule[];
  submodulesLoading: boolean;
  submodulesError: string | null;
  
  // Features
  features: Feature[];
  featuresLoading: boolean;
  featuresError: string | null;
  
  // APIs
  apis: API[];
  apisLoading: boolean;
  apisError: string | null;
  
  // Roles
  roles: Role[];
  rolesLoading: boolean;
  rolesError: string | null;
  
  // Selected module for submodules
  selectedModuleId: string | null;
  selectedSubModuleId: string | number | null;
  selectedFeatureId: string | number | null;
  
  // General loading states for create/update/delete
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: MastersState = {
  modules: [],
  modulesLoading: false,
  modulesError: null,
  
  submodules: [],
  submodulesLoading: false,
  submodulesError: null,
  
  features: [],
  featuresLoading: false,
  featuresError: null,
  
  apis: [],
  apisLoading: false,
  apisError: null,
  
  roles: [],
  rolesLoading: false,
  rolesError: null,
  
  selectedModuleId: null,
  selectedSubModuleId: null,
  selectedFeatureId: null,
  isLoading: false,
  error: null,
  success: false,
};

// Module thunks
export const fetchModules = createAsyncThunk<
  Module[],
  { search?: string },
  { rejectValue: string }
>(
  'masters/fetchModules',
  async ({ search }, { rejectWithValue }) => {
    try {
      const data = await getModulesAPI(search);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch modules');
    }
  }
);

export const createModule = createAsyncThunk<
  Module,
  Module,
  { rejectValue: string }
>(
  'masters/createModule',
  async (moduleData, { rejectWithValue }) => {
    try {
      const data = await createModuleAPI(moduleData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create module');
    }
  }
);

export const updateModule = createAsyncThunk<
  Module,
  { id: string; data: Module },
  { rejectValue: string }
>(
  'masters/updateModule',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateModuleAPI(id, data);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update module');
    }
  }
);

export const deleteModule = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'masters/deleteModule',
  async (id, { rejectWithValue }) => {
    try {
      await deleteModuleAPI(id);
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete module');
    }
  }
);

// Submodule thunks
export const fetchSubmodules = createAsyncThunk<
  Submodule[],
  { moduleId?: string; search?: string },
  { rejectValue: string }
>(
  'masters/fetchSubmodules',
  async ({ moduleId, search }, { rejectWithValue }) => {
    try {
      const data = await getSubmodulesAPI(moduleId, search);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch submodules');
    }
  }
);

export const createSubmodule = createAsyncThunk<
  Submodule,
  Submodule,
  { rejectValue: string }
>(
  'masters/createSubmodule',
  async (submoduleData, { rejectWithValue }) => {
    try {
      const data = await createSubmoduleAPI(submoduleData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create submodule');
    }
  }
);

export const updateSubmodule = createAsyncThunk<
  Submodule,
  { id: string; data: Submodule },
  { rejectValue: string }
>(
  'masters/updateSubmodule',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateSubmoduleAPI(id, data);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update submodule');
    }
  }
);

export const deleteSubmodule = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'masters/deleteSubmodule',
  async (id, { rejectWithValue }) => {
    try {
      await deleteSubmoduleAPI(id);
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete submodule');
    }
  }
);

// Feature thunks
export const fetchFeatures = createAsyncThunk<
  Feature[],
  { search?: string },
  { rejectValue: string }
>(
  'masters/fetchFeatures',
  async ({ search }, { rejectWithValue }) => {
    try {
      const data = await getFeaturesAPI(search);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch features');
    }
  }
);

export const fetchFeaturesByModule = createAsyncThunk<
  Feature[],
  string | number,
  { rejectValue: string }
>(
  'masters/fetchFeaturesByModule',
  async (moduleId, { rejectWithValue }) => {
    try {
      const data = await getFeaturesByModuleAPI(moduleId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch features');
    }
  }
);

export const fetchFeaturesBySubModule = createAsyncThunk<
  Feature[],
  string | number,
  { rejectValue: string }
>(
  'masters/fetchFeaturesBySubModule',
  async (subModuleId, { rejectWithValue }) => {
    try {
      const data = await getFeaturesBySubModuleAPI(subModuleId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch features');
    }
  }
);

export const createFeature = createAsyncThunk<
  Feature,
  Feature,
  { rejectValue: string }
>(
  'masters/createFeature',
  async (featureData, { rejectWithValue }) => {
    try {
      const data = await createFeatureAPI(featureData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create feature');
    }
  }
);

export const updateFeature = createAsyncThunk<
  Feature,
  { id: string | number; data: Feature },
  { rejectValue: string }
>(
  'masters/updateFeature',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateFeatureAPI(id, data);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update feature');
    }
  }
);

export const deleteFeature = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>(
  'masters/deleteFeature',
  async (id, { rejectWithValue }) => {
    try {
      await deleteFeatureAPI(id);
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete feature');
    }
  }
);


// API thunks
export const fetchApis = createAsyncThunk<
  API[],
  { search?: string },
  { rejectValue: string }
>(
  'masters/fetchApis',
  async ({ search }, { rejectWithValue }) => {
    try {
      const data = await getApisAPI(search);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch APIs');
    }
  }
);

export const fetchApisByFeature = createAsyncThunk<
  API[],
  string | number,
  { rejectValue: string }
>(
  'masters/fetchApisByFeature',
  async (featureId, { rejectWithValue }) => {
    try {
      const data = await getApisByFeatureAPI(featureId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch APIs');
    }
  }
);

export const fetchApisByModule = createAsyncThunk<
  API[],
  string | number,
  { rejectValue: string }
>(
  'masters/fetchApisByModule',
  async (moduleId, { rejectWithValue }) => {
    try {
      const data = await getApisByModuleAPI(moduleId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch APIs');
    }
  }
);

export const fetchApisBySubModule = createAsyncThunk<
  API[],
  string | number,
  { rejectValue: string }
>(
  'masters/fetchApisBySubModule',
  async (subModuleId, { rejectWithValue }) => {
    try {
      const data = await getApisBySubModuleAPI(subModuleId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch APIs');
    }
  }
);

export const createApi = createAsyncThunk<
  API,
  API,
  { rejectValue: string }
>(
  'masters/createApi',
  async (apiData, { rejectWithValue }) => {
    try {
      const data = await createApiAPI(apiData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create API');
    }
  }
);

export const updateApi = createAsyncThunk<
  API,
  { id: string | number; data: API },
  { rejectValue: string }
>(
  'masters/updateApi',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateApiAPI(id, data);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update API');
    }
  }
);

export const deleteApi = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>(
  'masters/deleteApi',
  async (id, { rejectWithValue }) => {
    try {
      await deleteApiAPI(id);
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete API');
    }
  }
);

// Role thunks
export const fetchRoles = createAsyncThunk<
  Role[],
  { search?: string },
  { rejectValue: string }
>(
  'masters/fetchRoles',
  async ({ search }, { rejectWithValue }) => {
    try {
      const data = await getRolesAPI(search);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch roles');
    }
  }
);

export const createRole = createAsyncThunk<
  Role,
  Role,
  { rejectValue: string }
>(
  'masters/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const data = await createRoleAPI(roleData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create role');
    }
  }
);

export const updateRole = createAsyncThunk<
  Role,
  { id: string | number; data: Role },
  { rejectValue: string }
>(
  'masters/updateRole',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updateRoleAPI(id, data);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>(
  'masters/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await deleteRoleAPI(id);
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete role');
    }
  }
);

const mastersSlice = createSlice({
  name: 'masters',
  initialState,
  reducers: {
    selectModule: (state, action) => {
      state.selectedModuleId = action.payload;
    },
    selectSubModule: (state, action) => {
      state.selectedSubModuleId = action.payload;
    },
    selectFeature: (state, action) => {
      state.selectedFeatureId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.modulesError = null;
      state.submodulesError = null;
      state.featuresError = null;
      state.apisError = null;
      state.rolesError = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch modules
    builder
      .addCase(fetchModules.pending, (state) => {
        state.modulesLoading = true;
        state.modulesError = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.modulesLoading = false;
        state.modules = action.payload;
        state.modulesError = null;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.modulesLoading = false;
        state.modulesError = action.payload || 'Failed to fetch modules';
      });

    // Create module
    builder
      .addCase(createModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createModule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modules.push(action.payload);
        state.success = true;
        state.error = null;
        notify.success('Module created successfully');
      })
      .addCase(createModule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create module';
        notify.error(action.payload || 'Failed to create module');
      });

    // Update module
    builder
      .addCase(updateModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.modules.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.modules[index] = action.payload;
        }
        state.success = true;
        state.error = null;
        notify.success('Module updated successfully');
      })
      .addCase(updateModule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update module';
        notify.error(action.payload || 'Failed to update module');
      });

    // Delete module
    builder
      .addCase(deleteModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modules = state.modules.filter((m) => m.id !== action.payload);
        state.submodules = [];
        state.selectedModuleId = null;
        state.success = true;
        state.error = null;
        notify.success('Module deleted successfully');
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete module';
        notify.error(action.payload || 'Failed to delete module');
      });

    // Fetch submodules
    builder
      .addCase(fetchSubmodules.pending, (state) => {
        state.submodulesLoading = true;
        state.submodulesError = null;
      })
      .addCase(fetchSubmodules.fulfilled, (state, action) => {
        state.submodulesLoading = false;
        state.submodules = action.payload;
        state.submodulesError = null;
      })
      .addCase(fetchSubmodules.rejected, (state, action) => {
        state.submodulesLoading = false;
        state.submodulesError = action.payload || 'Failed to fetch submodules';
      });

    // Create submodule
    builder
      .addCase(createSubmodule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubmodule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submodules.push(action.payload);
        state.success = true;
        state.error = null;
        notify.success('Submodule created successfully');
      })
      .addCase(createSubmodule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create submodule';
        notify.error(action.payload || 'Failed to create submodule');
      });

    // Update submodule
    builder
      .addCase(updateSubmodule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubmodule.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.submodules.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.submodules[index] = action.payload;
        }
        state.success = true;
        state.error = null;
        notify.success('Submodule updated successfully');
      })
      .addCase(updateSubmodule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update submodule';
        notify.error(action.payload || 'Failed to update submodule');
      });

    // Delete submodule
    builder
      .addCase(deleteSubmodule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubmodule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submodules = state.submodules.filter((s) => s.id !== action.payload);
        state.success = true;
        state.error = null;
        notify.success('Submodule deleted successfully');
      })
      .addCase(deleteSubmodule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete submodule';
        notify.error(action.payload || 'Failed to delete submodule');
      });

    // Fetch features
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.featuresLoading = true;
        state.featuresError = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.featuresLoading = false;
        state.features = action.payload;
        state.featuresError = null;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.featuresLoading = false;
        state.featuresError = action.payload || 'Failed to fetch features';
      });

    // Fetch features by module
    builder
      .addCase(fetchFeaturesByModule.pending, (state) => {
        state.featuresLoading = true;
        state.featuresError = null;
      })
      .addCase(fetchFeaturesByModule.fulfilled, (state, action) => {
        state.featuresLoading = false;
        state.features = action.payload;
        state.featuresError = null;
      })
      .addCase(fetchFeaturesByModule.rejected, (state, action) => {
        state.featuresLoading = false;
        state.featuresError = action.payload || 'Failed to fetch features';
      });

    // Fetch features by submodule
    builder
      .addCase(fetchFeaturesBySubModule.pending, (state) => {
        state.featuresLoading = true;
        state.featuresError = null;
      })
      .addCase(fetchFeaturesBySubModule.fulfilled, (state, action) => {
        state.featuresLoading = false;
        state.features = action.payload;
        state.featuresError = null;
      })
      .addCase(fetchFeaturesBySubModule.rejected, (state, action) => {
        state.featuresLoading = false;
        state.featuresError = action.payload || 'Failed to fetch features';
      });

    // Create feature
    builder
      .addCase(createFeature.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.features.push(action.payload);
        state.success = true;
        state.error = null;
        notify.success('Feature created successfully');
      })
      .addCase(createFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create feature';
        notify.error(action.payload || 'Failed to create feature');
      });

    // Update feature
    builder
      .addCase(updateFeature.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.features.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.features[index] = action.payload;
        }
        state.success = true;
        state.error = null;
        notify.success('Feature updated successfully');
      })
      .addCase(updateFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update feature';
        notify.error(action.payload || 'Failed to update feature');
      });

    // Delete feature
    builder
      .addCase(deleteFeature.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.features = state.features.filter((f) => f.id !== action.payload);
        state.success = true;
        state.error = null;
        notify.success('Feature deleted successfully');
      })
      .addCase(deleteFeature.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete feature';
        notify.error(action.payload || 'Failed to delete feature');
      });

    // Fetch APIs
    builder
      .addCase(fetchApis.pending, (state) => {
        state.apisLoading = true;
        state.apisError = null;
      })
      .addCase(fetchApis.fulfilled, (state, action) => {
        state.apisLoading = false;
        state.apis = action.payload;
        state.apisError = null;
      })
      .addCase(fetchApis.rejected, (state, action) => {
        state.apisLoading = false;
        state.apisError = action.payload || 'Failed to fetch APIs';
      });

    // Fetch APIs by feature
    builder
      .addCase(fetchApisByFeature.pending, (state) => {
        state.apisLoading = true;
        state.apisError = null;
      })
      .addCase(fetchApisByFeature.fulfilled, (state, action) => {
        state.apisLoading = false;
        state.apis = action.payload;
        state.apisError = null;
      })
      .addCase(fetchApisByFeature.rejected, (state, action) => {
        state.apisLoading = false;
        state.apisError = action.payload || 'Failed to fetch APIs';
      });

    // Fetch APIs by module
    builder
      .addCase(fetchApisByModule.pending, (state) => {
        state.apisLoading = true;
        state.apisError = null;
      })
      .addCase(fetchApisByModule.fulfilled, (state, action) => {
        state.apisLoading = false;
        state.apis = action.payload;
        state.apisError = null;
      })
      .addCase(fetchApisByModule.rejected, (state, action) => {
        state.apisLoading = false;
        state.apisError = action.payload || 'Failed to fetch APIs';
      });

    // Fetch APIs by submodule
    builder
      .addCase(fetchApisBySubModule.pending, (state) => {
        state.apisLoading = true;
        state.apisError = null;
      })
      .addCase(fetchApisBySubModule.fulfilled, (state, action) => {
        state.apisLoading = false;
        state.apis = action.payload;
        state.apisError = null;
      })
      .addCase(fetchApisBySubModule.rejected, (state, action) => {
        state.apisLoading = false;
        state.apisError = action.payload || 'Failed to fetch APIs';
      });

    // Create API
    builder
      .addCase(createApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.apis.push(action.payload);
        state.success = true;
        state.error = null;
        notify.success('API created successfully');
      })
      .addCase(createApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create API';
        notify.error(action.payload || 'Failed to create API');
      });

    // Update API
    builder
      .addCase(updateApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateApi.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.apis.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.apis[index] = action.payload;
        }
        state.success = true;
        state.error = null;
        notify.success('API updated successfully');
      })
      .addCase(updateApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update API';
        notify.error(action.payload || 'Failed to update API');
      });

    // Delete API
    builder
      .addCase(deleteApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.apis = state.apis.filter((a) => a.id !== action.payload);
        state.success = true;
        state.error = null;
        notify.success('API deleted successfully');
      })
      .addCase(deleteApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete API';
        notify.error(action.payload || 'Failed to delete API');
      });

    // Fetch roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload;
        state.rolesError = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload || 'Failed to fetch roles';
      });

    // Create role
    builder
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles.push(action.payload);
        state.success = true;
        state.error = null;
        notify.success('Role created successfully');
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create role';
        notify.error(action.payload || 'Failed to create role');
      });

    // Update role
    builder
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = state.roles.map((r) => (r.id === action.payload.id ? action.payload : r));
        state.success = true;
        state.error = null;
        notify.success('Role updated successfully');
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update role';
        notify.error(action.payload || 'Failed to update role');
      });

    // Delete role
    builder
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload);
        state.success = true;
        state.error = null;
        notify.success('Role deleted successfully');
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete role';
        notify.error(action.payload || 'Failed to delete role');
      });
  },
});

export const { selectModule, selectSubModule, selectFeature, clearError, clearSuccess } = mastersSlice.actions;
export default mastersSlice.reducer;
