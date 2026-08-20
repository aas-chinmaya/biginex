import type { Role } from '@/modules/masters/types';
import type { PermissionPayload, PermissionRequestPayload } from '@/modules/roleAccess/types';
import {
  assignPermissions,
  editPermissions,
  fetchRolePermissions,
  fetchRolesList,
  revokePermission,
} from '@/modules/roleAccess/api/roleAccess.api';

export const loadRoleAccessService = async (): Promise<Role[]> => {
  return fetchRolesList();
};

export const loadRolePermissionsService = async (roleId: string | number): Promise<PermissionPayload> => {
  return fetchRolePermissions(roleId);
};

export const assignRolePermissionsService = async (
  roleId: string | number,
  permissions: PermissionRequestPayload,
): Promise<void> => {
  await assignPermissions(roleId, permissions);
};

export const editRolePermissionsService = async (
  roleId: string | number,
  permissions: PermissionRequestPayload,
): Promise<void> => {
  await editPermissions(roleId, permissions);
};

export const revokeRolePermissionService = async (
  roleId: string | number,
  apiId: string | number,
): Promise<void> => {
  await revokePermission(roleId, apiId);
};
