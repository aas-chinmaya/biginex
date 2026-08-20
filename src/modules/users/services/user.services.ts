import {
  deleteUser as deleteUserAPI,
  getAllUsers,
  registerUser,
  updateUser as updateUserAPI,
} from "../api/user.api";

import type {
  CreateUserPayload,
  GetUsersParams,
  UpdateUserPayload,
  UserListResponse,
  UserResponse,
  DeleteUserResponse,
} from "../types";

/* ==================================================
 * USER SERVICE
 * ================================================== */

export const userService = {
  /* ==================================================
   * GET ALL USERS
   * ================================================== */

  getUsers: async (
    params?: GetUsersParams
  ): Promise<UserListResponse> => {
    try {
      const result = await getAllUsers(params);

      return result;
    } catch (error) {
      console.error(
        "[UserService] GET USERS ERROR:",
        error
      );

      throw error;
    }
  },

  /* ==================================================
   * CREATE USER
   * ================================================== */

  createUser: async (
    body: CreateUserPayload
  ): Promise<UserResponse> => {
    try {
      const result = await registerUser(body);
      return result;
    } catch (error) {
      console.error(
        "[UserService] CREATE USER ERROR:",
        error
      );

      throw error;
    }
  },

  /* ==================================================
   * UPDATE USER
   * ================================================== */

  updateUser: async (
    userId: number | string,
    body: UpdateUserPayload
  ): Promise<UserResponse> => {
    try {
      const result = await updateUserAPI(
        userId,
        body
      );
      return result;
    } catch (error) {
      console.error(
        "[UserService] UPDATE USER ERROR:",
        error
      );

      throw error;
    }
  },

  /* ==================================================
   * DELETE USER
   * ================================================== */

  deleteUser: async (
    userId: number | string
  ): Promise<DeleteUserResponse> => {
    try {
      const result = await deleteUserAPI(userId);
      return result;
    } catch (error) {
      console.error(
        "[UserService] DELETE USER ERROR:",
        error
      );

      throw error;
    }
  },
};




// import { deleteUser, getAllUsers, registerUser, updateUser } from "../api/user.api";
// import type { CreateUserPayload, UpdateUserPayload } from "../types";

// export const userService = {
//   getUsers: async (params?: { page?: number; limit?: number; search?: string; all?: boolean }) => {
//     return getAllUsers(params);
//   },

//   createUser: async (body: CreateUserPayload) => {
//     return registerUser(body);
//   },

//   updateUser: async (userId: number | string, body: UpdateUserPayload) => {
//     return updateUser(userId, body);
//   },

//   deleteUser: async (userId: number | string) => {
//     return deleteUser(userId);
//   },
// };
