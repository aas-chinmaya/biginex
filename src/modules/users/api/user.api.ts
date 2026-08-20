import api from "@/services/api";
import { USER_ENDPOINTS } from "../endpoint/user.endpoint";

import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserListResponse,
} from "../types";

/* ==================================================
 * REGISTER USER
 * ================================================== */

export const registerUser = async (
  body: CreateUserPayload
) => {
  try {
    const response = await api.post(
      USER_ENDPOINTS.REGISTER,
      body
    );

    return response.data;
  } catch (error) {
    console.error(
      "[Users API] REGISTER ERROR:",
      error
    );

    throw error;
  }
};

/* ==================================================
 * GET ALL USERS
 * ================================================== */

export const getAllUsers = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    all?: boolean;
  }
): Promise<UserListResponse> => {
  try {
    const response = await api.get(
      USER_ENDPOINTS.GET_USERS,
      {
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "[Users API] GET USERS ERROR:",
      error
    );

    throw error;
  }
};

/* ==================================================
 * UPDATE USER
 * ================================================== */

export const updateUser = async (
  userId: number | string,
  body: UpdateUserPayload
) => {
  try {
    const response = await api.put(
      `${USER_ENDPOINTS.UPDATE_USER}/${userId}`,
      body
    );

    return response.data;
  } catch (error) {
    console.error(
      "[Users API] UPDATE USER ERROR:",
      error
    );

    throw error;
  }
};

/* ==================================================
 * DELETE USER
 * ================================================== */

export const deleteUser = async (
  userId: number | string
) => {
  try {
    const response = await api.delete(
      `${USER_ENDPOINTS.DELETE_USER}/${userId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "[Users API] DELETE USER ERROR:",
      error
    );

    throw error;
  }
};








// import api from "@/services/api";
// import { USER_ENDPOINTS } from "../endpoint/user.endpoint";
// import type {
//   CreateUserPayload,
//   UpdateUserPayload,
//   UserListResponse,
// } from "../types";

// export const registerUser = async (body: CreateUserPayload) => {
//   const { data } = await api.post(USER_ENDPOINTS.REGISTER, body);
//   return data;
// };

// export const getAllUsers = async (params?: {
//   page?: number;
//   limit?: number;
//   search?: string;
//   all?: boolean;
// }) => {
//   const { data } = await api.get<UserListResponse>(USER_ENDPOINTS.GET_USERS, { params });
//   return data;
// };

// export const updateUser = async (userId: number | string, body: UpdateUserPayload) => {
//   const { data } = await api.put(`${USER_ENDPOINTS.UPDATE_USER}/${userId}`, body);
//   return data;
// };

// export const deleteUser = async (userId: number | string) => {
//   const { data } = await api.delete(`${USER_ENDPOINTS.DELETE_USER}/${userId}`);
//   return data;
// };
