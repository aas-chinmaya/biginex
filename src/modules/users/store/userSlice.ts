import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "@/modules/users/services/user.services";
import type {
  CreateUserPayload,
  GetUsersParams,
  UpdateUserPayload,
  User,
} from "@/modules/users/types";

/* ==================================================
 * USERS STATE
 * ================================================== */

export interface UsersState {
  users: User[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: boolean;
}

/* ==================================================
 * INITIAL STATE
 * ================================================== */

const initialState: UsersState = {
  users: [],
  isLoading: false,
  isSaving: false,
  error: null,
  success: false,
};

/* ==================================================
 * FETCH USERS
 * ================================================== */

export const fetchUsers = createAsyncThunk<
  User[],
  GetUsersParams | undefined,
  { rejectValue: string }
>(
  "users/fetchUsers",

  async (params, { rejectWithValue }) => {
    try {

      const result =
        await userService.getUsers(params);

      return result?.data ?? [];
    } catch (error) {
      console.error(
        "[Users] Fetch users error:",
        error
      );

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        "Failed to fetch users"
      );
    }
  }
);

/* ==================================================
 * CREATE USER
 * ================================================== */

export const createUser = createAsyncThunk<
  User,
  CreateUserPayload,
  { rejectValue: string }
>(
  "users/createUser",

  async (payload, { rejectWithValue }) => {
    try {

      const result =
        await userService.createUser(payload);

      if (result?.data) {
        return result.data;
      }

      throw new Error(
        "User was not returned by the server"
      );
    } catch (error) {
      console.error(
        "[Users] Create user error:",
        error
      );

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        "Failed to create user"
      );
    }
  }
);

/* ==================================================
 * UPDATE USER
 * ================================================== */

export const updateUser = createAsyncThunk<
  User,
  {
    userId: number | string;
    payload: UpdateUserPayload;
  },
  { rejectValue: string }
>(
  "users/updateUser",

  async (
    { userId, payload },
    { rejectWithValue }
  ) => {
    try {
      const result =
        await userService.updateUser(
          userId,
          payload
        );

      if (result?.data) {
        return result.data;
      }

      throw new Error(
        "Updated user was not returned by the server"
      );
    } catch (error) {
      console.error(
        "[Users] Update user error:",
        error
      );

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        "Failed to update user"
      );
    }
  }
);

/* ==================================================
 * DELETE USER
 * ================================================== */

export const deleteUser = createAsyncThunk<
  string,
  number | string,
  { rejectValue: string }
>(
  "users/deleteUser",

  async (
    userId,
    { rejectWithValue }
  ) => {
    try {
      const result =
        await userService.deleteUser(userId);

      return String(userId);
    } catch (error) {
      console.error(
        "[Users] Delete user error:",
        error
      );

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        "Failed to delete user"
      );
    }
  }
);

/* ==================================================
 * USERS SLICE
 * ================================================== */

const userSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    /* ----------------------------------------------
     * CLEAR ERROR / SUCCESS
     * ---------------------------------------------- */

    clearUsersState(state) {
      state.error = null;
      state.success = false;
    },

    /* ----------------------------------------------
     * CLEAR USERS
     * ---------------------------------------------- */

    clearUsers(state) {
      state.users = [];
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ==================================================
       * FETCH USERS
       * ================================================== */

      .addCase(
        fetchUsers.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.users = action.payload;
          state.error = null;
        }
      )

      .addCase(
        fetchUsers.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.payload ||
            "Failed to fetch users";
        }
      )

      /* ==================================================
       * CREATE USER
       * ================================================== */

      .addCase(
        createUser.pending,
        (state) => {
          state.isSaving = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        createUser.fulfilled,
        (state, action) => {
          state.isSaving = false;
          state.users.unshift(
            action.payload
          );

          state.success = true;
          state.error = null;
        }
      )

      .addCase(
        createUser.rejected,
        (state, action) => {
          state.isSaving = false;
          state.success = false;

          state.error =
            action.payload ||
            "Failed to create user";
        }
      )

      /* ==================================================
       * UPDATE USER
       * ================================================== */

      .addCase(
        updateUser.pending,
        (state) => {
          state.isSaving = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        updateUser.fulfilled,
        (state, action) => {
          state.isSaving = false;
          const index =
            state.users.findIndex(
              (user) =>
                String(user.id) ===
                String(action.payload.id)
            );
          if (index !== -1) {
            state.users[index] =
              action.payload;
          }

          state.success = true;
          state.error = null;
        }
      )

      .addCase(
        updateUser.rejected,
        (state, action) => {
          state.isSaving = false;
          state.success = false;

          state.error =
            action.payload ||
            "Failed to update user";
        }
      )

      /* ==================================================
       * DELETE USER
       * ================================================== */

      .addCase(
        deleteUser.pending,
        (state) => {
          state.isSaving = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        deleteUser.fulfilled,
        (state, action) => {
          state.isSaving = false;
          state.users =
            state.users.filter(
              (user) =>
                String(user.id) !==
                String(action.payload)
            );

          state.success = true;
          state.error = null;
        }
      )

      .addCase(
        deleteUser.rejected,
        (state, action) => {
          state.isSaving = false;
          state.success = false;

          state.error =
            action.payload ||
            "Failed to delete user";
        }
      );
  },
});

/* ==================================================
 * ACTIONS
 * ================================================== */

export const {
  clearUsersState,
  clearUsers,
} = userSlice.actions;

/* ==================================================
 * REDUCER
 * ================================================== */

export default userSlice.reducer;








// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { userService } from "@/modules/users/services/user.services";
// import type { CreateUserPayload, UpdateUserPayload, User } from "@/modules/users/types";

// export interface UsersState {
//   users: User[];
//   isLoading: boolean;
//   isSaving: boolean;
//   error: string | null;
//   success: boolean;
// }

// const initialState: UsersState = {
//   users: [],
//   isLoading: false,
//   isSaving: false,
//   error: null,
//   success: false,
// };

// export const fetchUsers = createAsyncThunk<User[], { search?: string; all?: boolean; page?: number; limit?: number }, { rejectValue: string }>(
//   "users/fetchUsers",
//   async (params, { rejectWithValue }) => {
//     try {
//       const result = await userService.getUsers(params);
//       return result.users || [];
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("Failed to fetch users");
//     }
//   }
// );

// export const createUser = createAsyncThunk<User, CreateUserPayload, { rejectValue: string }>(
//   "users/createUser",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const result = await userService.createUser(payload);
//       return result.user || result;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("Failed to create user");
//     }
//   }
// );

// export const updateUser = createAsyncThunk<User, { userId: number | string; payload: UpdateUserPayload }, { rejectValue: string }>(
//   "users/updateUser",
//   async ({ userId, payload }, { rejectWithValue }) => {
//     try {
//       const result = await userService.updateUser(userId, payload);
//       return result.user || result;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("Failed to update user");
//     }
//   }
// );

// export const deleteUser = createAsyncThunk<string, number | string, { rejectValue: string }>(
//   "users/deleteUser",
//   async (userId, { rejectWithValue }) => {
//     try {
//       await userService.deleteUser(userId);
//       return String(userId);
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue("Failed to delete user");
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {
//     clearUsersState(state) {
//       state.error = null;
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || "Failed to fetch users";
//       })
//       .addCase(createUser.pending, (state) => {
//         state.isSaving = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(createUser.fulfilled, (state, action) => {
//         state.isSaving = false;
//         state.users.unshift(action.payload);
//         state.success = true;
//       })
//       .addCase(createUser.rejected, (state, action) => {
//         state.isSaving = false;
//         state.error = action.payload || "Failed to create user";
//       })
//       .addCase(updateUser.pending, (state) => {
//         state.isSaving = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(updateUser.fulfilled, (state, action) => {
//         state.isSaving = false;
//         state.users = state.users.map((user) =>
//           user.id === action.payload.id ? action.payload : user
//         );
//         state.success = true;
//       })
//       .addCase(updateUser.rejected, (state, action) => {
//         state.isSaving = false;
//         state.error = action.payload || "Failed to update user";
//       })
//       .addCase(deleteUser.pending, (state) => {
//         state.isSaving = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.isSaving = false;
//         state.users = state.users.filter((user) => String(user.id) !== action.payload);
//         state.success = true;
//       })
//       .addCase(deleteUser.rejected, (state, action) => {
//         state.isSaving = false;
//         state.error = action.payload || "Failed to delete user";
//       });
//   },
// });

// export const { clearUsersState } = userSlice.actions;
// export default userSlice.reducer;
