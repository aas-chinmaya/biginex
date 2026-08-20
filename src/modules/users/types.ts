/* ==================================================
 * ROLE
 * ================================================== */

export interface UserRole {
  id: string;
  name: string;
  code?: string;
}

/* ==================================================
 * USER
 * ================================================== */

export interface User {
  id: string;

  fullName: string;

  email: string;

  contact: string;

  role?: UserRole | null;

  isDeleted: boolean;

  createdAt: string;

  updatedAt?: string | null;

  createdBy?: string | null;

  updatedBy?: string | null;
}

/* ==================================================
 * GET USERS PARAMS
 * ================================================== */

export interface GetUsersParams {
  page?: number;

  limit?: number;

  search?: string;

  all?: boolean;
}

/* ==================================================
 * GET USERS RESPONSE
 * ================================================== */

export interface UserListResponse {
  success: boolean;

  message: string;

  data: User[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

/* ==================================================
 * CREATE USER PAYLOAD
 * ================================================== */

export interface CreateUserPayload {
  fullName: string;

  email: string;

  contact: string;

  roleId?: string;

  password?: string;
}

/* ==================================================
 * UPDATE USER PAYLOAD
 * ================================================== */

export interface UpdateUserPayload {
  fullName?: string;

  email?: string;

  contact?: string;

  roleId?: string;

  password?: string;
}

/* ==================================================
 * CREATE / UPDATE USER RESPONSE
 * ================================================== */

export interface UserResponse {
  success: boolean;

  message: string;

  data: User;
}

/* ==================================================
 * DELETE USER RESPONSE
 * ================================================== */

export interface DeleteUserResponse {
  success: boolean;

  message: string;

  data?: unknown;
}





// export interface User {
//   id: number;
//   fullName: string;
//   email: string;
//   contact: string;
//   roleId?: number;
//   role?: {
//     id?: number;
//     name?: string;
//   };
//   isDeleted?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   password?: string;
// }

// export interface CreateUserPayload {
//   fullName: string;
//   email: string;
//   password: string;
//   role: string;
//   contact: string;
// }

// export interface UpdateUserPayload {
//   fullName?: string;
//   email?: string;
//   role?: string;
//   contact?: string;
// }

// export interface UserListResponse {
//   status: number;
//   message: string;
//   total: number;
//   page: number | null;
//   limit: number | null;
//   totalPages: number | null;
//   users: User[];
// }
