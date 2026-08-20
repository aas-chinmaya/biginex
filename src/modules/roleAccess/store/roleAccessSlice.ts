import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  assignRolePermissionsService,
  editRolePermissionsService,
  loadRoleAccessService,
  loadRolePermissionsService,
} from "@/modules/roleAccess/services/roleAccess.service";

import type { Role } from "@/modules/masters/types";

import type {
  ModuleNode,
  PermissionPayload,
  PermissionRequestPayload,
} from "@/modules/roleAccess/types";

export interface RoleAccessState {
  roles: Role[];

  accessTree: ModuleNode[];

  baseTree: ModuleNode[];

  permissions: PermissionPayload | null;

  selectedRoleId: string | number | null;

  loadedRoleId: string | number | null;

  permissionsLoaded: boolean;

  isLoading: boolean;

  isSaving: boolean;

  error: string | null;

  success: boolean;
}

const initialState: RoleAccessState = {
  roles: [],

  accessTree: [],

  baseTree: [],

  permissions: null,

  selectedRoleId: null,

  loadedRoleId: null,

  permissionsLoaded: false,

  isLoading: false,

  isSaving: false,

  error: null,

  success: false,
};

/* ============================================================
 * LOAD ROLE ACCESS
 * ============================================================ */

export const loadRoleAccess = createAsyncThunk<
  { roles: Role[] },
  void,
  { rejectValue: string }
>(
  "roleAccess/loadRoleAccess",
  async (_, { rejectWithValue }) => {
    try {
      const result = await loadRoleAccessService();

      console.log(
        "ROLE ACCESS SERVICE RESULT:",
        result
      );

      return {
        roles: result,
      };
    } catch (error: any) {
      console.error(
        "LOAD ROLE ACCESS ERROR:",
        error
      );

      return rejectWithValue(
        error?.message ||
          "Failed to load role access data"
      );
    }
  }
);

/* ============================================================
 * LOAD ROLE PERMISSIONS
 * ============================================================ */

export const loadRolePermissions = createAsyncThunk<
  PermissionPayload,
  string | number,
  { rejectValue: string }
>(
  "roleAccess/loadRolePermissions",
  async (
    roleId,
    { rejectWithValue }
  ) => {
    try {
      console.log(
        "LOADING ROLE PERMISSIONS:",
        roleId
      );

      const result =
        await loadRolePermissionsService(
          roleId
        );

      console.log(
        "ROLE PERMISSIONS SERVICE RESULT:",
        result
      );

      /*
       * IMPORTANT
       *
       * Support both:
       *
       * 1. Direct response
       *
       * {
       *   moduleIds: [],
       *   ...
       * }
       *
       * 2. Wrapped response
       *
       * {
       *   success: true,
       *   data: {
       *      moduleIds: [],
       *      ...
       *   }
       * }
       */

      const response: any = result;

      const permissions =
        response?.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
          ? response.data
          : response;

      console.log(
        "NORMALIZED ROLE PERMISSIONS:",
        permissions
      );

      if (
        !permissions ||
        typeof permissions !== "object"
      ) {
        return rejectWithValue(
          "Invalid permissions response"
        );
      }

      return {
        moduleIds:
          permissions.moduleIds ?? [],

        subModuleIds:
          permissions.subModuleIds ?? [],

        featureIds:
          permissions.featureIds ?? [],

        apiIds:
          permissions.apiIds ?? [],

        moduleNames:
          permissions.moduleNames ?? [],

        subModuleNames:
          permissions.subModuleNames ?? [],

        featureNames:
          permissions.featureNames ?? [],

        apiNames:
          permissions.apiNames ?? [],

        isAllowed:
          permissions.isAllowed,

        tree:
          Array.isArray(
            permissions.tree
          )
            ? permissions.tree
            : undefined,
      };
    } catch (error: any) {
      console.error(
        "LOAD ROLE PERMISSIONS ERROR:",
        error
      );

      return rejectWithValue(
        error?.message ||
          "Failed to load role permissions"
      );
    }
  }
);

/* ============================================================
 * ASSIGN ROLE PERMISSIONS
 * ============================================================ */

export const assignRolePermissions =
  createAsyncThunk<
    void,
    {
      roleId: string | number;
      permissions: PermissionRequestPayload;
    },
    { rejectValue: string }
  >(
    "roleAccess/assignRolePermissions",
    async (
      { roleId, permissions },
      { rejectWithValue }
    ) => {
      try {
        await assignRolePermissionsService(
          roleId,
          permissions
        );
      } catch (error: any) {
        console.error(
          "ASSIGN ROLE PERMISSIONS ERROR:",
          error
        );

        return rejectWithValue(
          error?.message ||
            "Failed to assign permissions"
        );
      }
    }
  );

/* ============================================================
 * EDIT ROLE PERMISSIONS
 * ============================================================ */

export const editRolePermissions =
  createAsyncThunk<
    void,
    {
      roleId: string | number;
      permissions: PermissionRequestPayload;
    },
    { rejectValue: string }
  >(
    "roleAccess/editRolePermissions",
    async (
      { roleId, permissions },
      { rejectWithValue }
    ) => {
      try {
        await editRolePermissionsService(
          roleId,
          permissions
        );
      } catch (error: any) {
        console.error(
          "EDIT ROLE PERMISSIONS ERROR:",
          error
        );

        return rejectWithValue(
          error?.message ||
            "Failed to edit permissions"
        );
      }
    }
  );

/* ============================================================
 * SLICE
 * ============================================================ */

const roleAccessSlice =
  createSlice({
    name: "roleAccess",

    initialState,

    reducers: {
      clearRoleAccessError(
        state
      ) {
        state.error = null;
        state.success = false;
      },

      setAccessTree(
        state,
        action: PayloadAction<ModuleNode[]>
      ) {
        state.accessTree =
          action.payload;
      },

      setBaseTree(
        state,
        action: PayloadAction<ModuleNode[]>
      ) {
        state.baseTree =
          action.payload;
      },

      setPermissionsLoaded(
        state,
        action: PayloadAction<boolean>
      ) {
        state.permissionsLoaded =
          action.payload;
      },

      setPermissions(
        state,
        action: PayloadAction<
          PermissionPayload | null
        >
      ) {
        state.permissions =
          action.payload;
      },

      setSelectedRoleId(
        state,
        action: PayloadAction<
          string | number | null
        >
      ) {
        state.selectedRoleId =
          action.payload;

        /*
         * Every time role changes,
         * permissions must be loaded again.
         */

        state.loadedRoleId = null;

        state.permissionsLoaded =
          false;

        state.permissions = null;

        state.error = null;
      },
    },

    extraReducers: (
      builder
    ) => {
      /* ========================================================
       * LOAD ROLE ACCESS
       * ======================================================== */

      builder
        .addCase(
          loadRoleAccess.pending,
          (state) => {
            state.isLoading = true;
            state.error = null;
            state.success = false;
          }
        )

        .addCase(
          loadRoleAccess.fulfilled,
          (
            state,
            action
          ) => {
            state.isLoading = false;

            state.roles =
              action.payload.roles;

            state.error = null;
          }
        )

        .addCase(
          loadRoleAccess.rejected,
          (
            state,
            action
          ) => {
            state.isLoading = false;

            state.error =
              action.payload ||
              "Failed to load role access data";
          }
        );

      /* ========================================================
       * LOAD ROLE PERMISSIONS
       * ======================================================== */

      builder
        .addCase(
          loadRolePermissions.pending,
          (
            state,
            action
          ) => {
            state.isLoading = true;

            state.error = null;

            state.success = false;

            /*
             * IMPORTANT:
             *
             * Don't mark permissions as loaded
             * before API succeeds.
             */

            state.permissionsLoaded =
              false;

            state.selectedRoleId =
              action.meta.arg;
          }
        )

        .addCase(
          loadRolePermissions.fulfilled,
          (
            state,
            action
          ) => {
            state.isLoading = false;

            state.error = null;

            state.success = true;

            state.permissionsLoaded =
              true;

            state.loadedRoleId =
              action.meta.arg;

            state.permissions =
              action.payload;

            /*
             * Only replace accessTree if the
             * permission API actually returned
             * a valid tree.
             */

            if (
              Array.isArray(
                action.payload.tree
              ) &&
              action.payload.tree.length > 0
            ) {
              state.accessTree =
                action.payload.tree;

              state.baseTree =
                action.payload.tree;
            }
          }
        )

        .addCase(
          loadRolePermissions.rejected,
          (
            state,
            action
          ) => {
            state.isLoading = false;

            state.permissionsLoaded =
              false;

            state.success = false;

            state.loadedRoleId = null;

            state.error =
              action.payload ||
              "Failed to load role permissions";
          }
        );

      /* ========================================================
       * ASSIGN
       * ======================================================== */

      builder
        .addCase(
          assignRolePermissions.pending,
          (state) => {
            state.isSaving = true;

            state.error = null;

            state.success = false;
          }
        )

        .addCase(
          assignRolePermissions.fulfilled,
          (state) => {
            state.isSaving = false;

            state.success = true;

            /*
             * Force reload next time if necessary.
             */

            state.loadedRoleId = null;
          }
        )

        .addCase(
          assignRolePermissions.rejected,
          (
            state,
            action
          ) => {
            state.isSaving = false;

            state.success = false;

            state.error =
              action.payload ||
              "Failed to assign permissions";
          }
        );

      /* ========================================================
       * EDIT
       * ======================================================== */

      builder
        .addCase(
          editRolePermissions.pending,
          (state) => {
            state.isSaving = true;

            state.error = null;

            state.success = false;
          }
        )

        .addCase(
          editRolePermissions.fulfilled,
          (state) => {
            state.isSaving = false;

            state.success = true;

            state.loadedRoleId = null;
          }
        )

        .addCase(
          editRolePermissions.rejected,
          (
            state,
            action
          ) => {
            state.isSaving = false;

            state.success = false;

            state.error =
              action.payload ||
              "Failed to edit permissions";
          }
        );
    },
  });

export const {
  clearRoleAccessError,
  setAccessTree,
  setBaseTree,
  setPermissionsLoaded,
  setPermissions,
  setSelectedRoleId,
} =
  roleAccessSlice.actions;

export default roleAccessSlice.reducer;





// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import {
//   assignRolePermissionsService,
//   editRolePermissionsService,
//   loadRoleAccessService,
//   loadRolePermissionsService,
// } from '@/modules/roleAccess/services/roleAccess.service';
// import type { Role } from '@/modules/masters/types';
// import type { ModuleNode, PermissionPayload, PermissionRequestPayload } from '@/modules/roleAccess/types';
// import type { RootState } from '@/store/store';

// export interface RoleAccessState {
//   roles: Role[];
//   accessTree: ModuleNode[];
//   baseTree: ModuleNode[];
//   permissions: PermissionPayload | null;
//   selectedRoleId: string | number | null;
//   loadedRoleId: string | number | null;
//   permissionsLoaded: boolean;
//   isLoading: boolean;
//   isSaving: boolean;
//   error: string | null;
//   success: boolean;
// }

// const initialState: RoleAccessState = {
//   roles: [],
//   accessTree: [],
//   baseTree: [],
//   permissions: null,
//   selectedRoleId: null,
//   loadedRoleId: null,
//   permissionsLoaded: false,
//   isLoading: false,
//   isSaving: false,
//   error: null,
//   success: false,
// };

// export const loadRoleAccess = createAsyncThunk<
//   { roles: Role[] },
//   void,
//   { rejectValue: string }
// >('roleAccess/loadRoleAccess', async (_, { rejectWithValue }) => {
//   try {
//     const roles = await loadRoleAccessService();
//     return { roles };
//   } catch (error) {
//     if (error instanceof Error) {
//       return rejectWithValue(error.message);
//     }
//     return rejectWithValue('Failed to load role access data');
//   }
// });

// export const loadRolePermissions = createAsyncThunk<
//   PermissionPayload,
//   string | number,
//   { rejectValue: string }
// >(
//   'roleAccess/loadRolePermissions',
//   async (roleId, { rejectWithValue }) => {
//     try {
//       return await loadRolePermissionsService(roleId);
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('Failed to load role permissions');
//     }
//   },
//   {
//     condition: (roleId, { getState }) => {
//       const state = (getState() as RootState).roleAccess;
//       return String(state.loadedRoleId) !== String(roleId);
//     },
//   },
// );

// export const assignRolePermissions = createAsyncThunk<
//   void,
//   { roleId: string | number; permissions: PermissionRequestPayload },
//   { rejectValue: string }
// >('roleAccess/assignRolePermissions', async ({ roleId, permissions }, { rejectWithValue }) => {
//   try {
//     return await assignRolePermissionsService(roleId, permissions);
//   } catch (error) {
//     if (error instanceof Error) {
//       return rejectWithValue(error.message);
//     }
//     return rejectWithValue('Failed to assign permissions');
//   }
// });

// export const editRolePermissions = createAsyncThunk<
//   void,
//   { roleId: string | number; permissions: PermissionRequestPayload },
//   { rejectValue: string }
// >('roleAccess/editRolePermissions', async ({ roleId, permissions }, { rejectWithValue }) => {
//   try {
//     return await editRolePermissionsService(roleId, permissions);
//   } catch (error) {
//     if (error instanceof Error) {
//       return rejectWithValue(error.message);
//     }
//     return rejectWithValue('Failed to edit permissions');
//   }
// });

// const roleAccessSlice = createSlice({
//   name: 'roleAccess',
//   initialState,
//   reducers: {
//     clearRoleAccessError(state) {
//       state.error = null;
//       state.success = false;
//     },
//     setAccessTree(state, action: PayloadAction<ModuleNode[]>) {
//       state.accessTree = action.payload;
//     },
//     setBaseTree(state, action: PayloadAction<ModuleNode[]>) {
//       state.baseTree = action.payload;
//     },
//     setPermissionsLoaded(state, action: PayloadAction<boolean>) {
//       state.permissionsLoaded = action.payload;
//     },
//     setPermissions(state, action: PayloadAction<PermissionPayload | null>) {
//       state.permissions = action.payload;
//     },
//     setSelectedRoleId(state, action: PayloadAction<string | number | null>) {
//       state.selectedRoleId = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loadRoleAccess.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(loadRoleAccess.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.roles = action.payload.roles;
//       })
//       .addCase(loadRoleAccess.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Failed to load role access data';
//       })
//       .addCase(loadRolePermissions.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(loadRolePermissions.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.loadedRoleId = action.meta.arg;
//         state.permissionsLoaded = true;
//         state.permissions = action.payload;
//         state.accessTree = action.payload.tree ?? state.accessTree;
//         state.baseTree = action.payload.tree ?? state.baseTree;
//         state.success = true;
//       })
//       .addCase(loadRolePermissions.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Failed to load role permissions';
//       })
//       .addCase(assignRolePermissions.pending, (state) => {
//         state.isSaving = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(assignRolePermissions.fulfilled, (state) => {
//         state.isSaving = false;
//         state.success = true;
//         state.permissionsLoaded = true;
//       })
//       .addCase(assignRolePermissions.rejected, (state, action) => {
//         state.isSaving = false;
//         state.error = action.payload || 'Failed to assign permissions';
//       })
//       .addCase(editRolePermissions.pending, (state) => {
//         state.isSaving = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(editRolePermissions.fulfilled, (state) => {
//         state.isSaving = false;
//         state.success = true;
//         state.permissionsLoaded = true;
//       })
//       .addCase(editRolePermissions.rejected, (state, action) => {
//         state.isSaving = false;
//         state.error = action.payload || 'Failed to edit permissions';
//       });
//   },
// });

// export const {
//   clearRoleAccessError,
//   setAccessTree,
//   setBaseTree,
//   setPermissionsLoaded,
//   setPermissions,
//   setSelectedRoleId,
// } = roleAccessSlice.actions;

// export default roleAccessSlice.reducer;
