import type {
  API,
  Feature,
  Module,
  Role,
  Submodule,
} from "@/modules/masters/types";

/* ============================================================
 * PERMISSION PAYLOAD
 * ============================================================ */

export interface PermissionPayload {
  moduleIds: Array<string | number>;
  subModuleIds: Array<string | number>;
  featureIds: Array<string | number>;
  apiIds: Array<string | number>;

  moduleNames?: string[];
  subModuleNames?: string[];
  featureNames?: string[];
  apiNames?: string[];

  isAllowed?: boolean;

  tree?: ModuleNode[];
}

/* ============================================================
 * PERMISSION REQUEST
 * ============================================================ */

export type PermissionRequestPayload =
  | PermissionPayload
  | PermissionPayload[];

/* ============================================================
 * API NODE
 * ============================================================ */

export interface ApiNode extends API {
  checked: boolean;

  indeterminate?: boolean;

  expanded?: boolean;

  explicitlySelected?: boolean;

  selectedByAncestor?: boolean;
}

/* ============================================================
 * FEATURE NODE
 * ============================================================ */

export interface FeatureNode extends Feature {
  checked: boolean;

  indeterminate: boolean;

  expanded: boolean;

  explicitlySelected?: boolean;

  selectedByAncestor?: boolean;

  apis: ApiNode[];
}

/* ============================================================
 * SUBMODULE NODE
 * ============================================================ */

export interface SubmoduleNode extends Submodule {
  checked: boolean;

  indeterminate: boolean;

  expanded: boolean;

  explicitlySelected?: boolean;

  selectedByAncestor?: boolean;

  features: FeatureNode[];

  apis: ApiNode[];
}

/* ============================================================
 * MODULE NODE
 * ============================================================ */

export interface ModuleNode extends Module {
  checked: boolean;

  indeterminate: boolean;

  expanded: boolean;

  explicitlySelected?: boolean;

  selectedByAncestor?: boolean;

  submodules: SubmoduleNode[];

  features: FeatureNode[];

  apis: ApiNode[];
}

/* ============================================================
 * NODE TYPE
 * ============================================================ */

export type NodeType =
  | "module"
  | "submodule"
  | "feature"
  | "api";

/* ============================================================
 * TOGGLE IDS
 * ============================================================ */

export interface ToggleIds {
  moduleId: string | number;

  submoduleId?: string | number;

  featureId?: string | number;

  apiId?: string | number;
}

/* ============================================================
 * PENDING PERMISSION
 * ============================================================ */

export interface PendingPermission {
  type: NodeType;

  id: string | number;

  isAllowed: boolean;
}

/* ============================================================
 * PERMISSION SUMMARY
 * ============================================================ */

export interface PermissionSummary {
  totalApis: number;

  allowedApis: number;

  deniedApis: number;
}

/* ============================================================
 * ROLE ACCESS HEADER
 * ============================================================ */

export interface RoleAccessHeaderProps {
  roles: Role[];

  selectedRoleId: string | number | null;

  permissions: PermissionSummary;
}

/* ============================================================
 * ROLE SELECTOR
 * ============================================================ */

export interface RoleSelectorProps {
  roles: Role[];

  selectedRoleId: string | number | null;

  onSelectRole: (
    roleId: string | number
  ) => void;
}

/* ============================================================
 * PERMISSION TREE
 * ============================================================ */

export interface PermissionTreeProps {
  tree: ModuleNode[];

  isLoading: boolean;

  onToggleNode: (
    type: NodeType,
    ids: ToggleIds
  ) => void;

  onToggleExpandModule: (
    moduleId: string | number
  ) => void;

  onToggleExpandSubmodule: (
    moduleId: string | number,
    submoduleId: string | number
  ) => void;

  onToggleExpandFeature: (
    moduleId: string | number,
    submoduleId: string | number | undefined,
    featureId: string | number
  ) => void;
}

/* ============================================================
 * PERMISSION TREE LOGIC
 * ============================================================ */

export interface PermissionTreeLogicProps {
  permissions: PermissionPayload;

  tree: ModuleNode[];

  onToggleNode: (
    type: NodeType,
    ids: ToggleIds
  ) => void;

  onToggleExpandModule: (
    moduleId: string | number
  ) => void;

  onToggleExpandSubmodule: (
    moduleId: string | number,
    submoduleId: string | number
  ) => void;

  onToggleExpandFeature: (
    moduleId: string | number,
    submoduleId: string | number,
    featureId: string | number
  ) => void;
}

/* ============================================================
 * ALIASES
 * ============================================================ */

export type PermissionPayloadType =
  | PermissionPayload
  | PermissionPayload[];

export type ModuleLike =
  | ModuleNode
  | SubmoduleNode
  | FeatureNode;




// import type { API, Feature, Module, Role, Submodule } from '@/modules/masters/types';

// export interface PermissionPayload {
//   moduleIds: Array<string | number>;
//   subModuleIds: Array<string | number>;
//   featureIds: Array<string | number>;
//   apiIds: Array<string | number>;
//   moduleNames?: Array<string>;
//   subModuleNames?: Array<string>;
//   featureNames?: Array<string>;
//   apiNames?: Array<string>;
//   isAllowed?: boolean;
//   tree?: ModuleNode[];
// }

// export type PermissionRequestPayload = PermissionPayload | PermissionPayload[];

// export interface PermissionTreeApi {
//   id?: string | number;
// }

// export interface PermissionTreeFeature {
//   id?: string | number;
//   apis?: PermissionTreeApi[];
// }

// export interface PermissionTreeSubmodule {
//   id?: string | number;
//   features?: PermissionTreeFeature[];
// }

// export interface PermissionTreeModule {
//   id?: string | number;
//   subModules?: PermissionTreeSubmodule[];
// }

// export interface ApiNode extends API {
//   checked: boolean;
// }

// export interface FeatureNode extends Feature {
//   checked: boolean;
//   indeterminate: boolean;
//   expanded: boolean;
//   explicitlySelected?: boolean;
//   selectedByAncestor?: boolean;
//   apis: ApiNode[];
// }

// export interface SubmoduleNode extends Submodule {
//   checked: boolean;
//   indeterminate: boolean;
//   expanded: boolean;
//   explicitlySelected?: boolean;
//   selectedByAncestor?: boolean;
//   features: FeatureNode[];
//   apis: ApiNode[];
// }

// export interface ModuleNode extends Module {
//   checked: boolean;
//   indeterminate: boolean;
//   expanded: boolean;
//   explicitlySelected?: boolean;
//   selectedByAncestor?: boolean;
//   submodules: SubmoduleNode[];
//   features: FeatureNode[];
//   apis: ApiNode[];
// }

// export type NodeType = 'module' | 'submodule' | 'feature' | 'api';

// export interface ToggleIds {
//   moduleId: string | number;
//   submoduleId?: string | number;
//   featureId?: string | number;
//   apiId?: string | number;
// }

// export interface PendingPermission {
//   type: NodeType;
//   id: string | number;
//   isAllowed: boolean;
// }

// export interface PermissionSummary {
//   totalApis: number;
//   allowedApis: number;
//   deniedApis: number;
// }

// export interface RoleAccessHeaderProps {
//   roles: Role[];
//   selectedRoleId: string | number | null;
//   permissions: PermissionSummary;
//   // isSaving: boolean;
//   // onAllowAll: () => void;
//   // onDenyAll: () => void;
//   // onSelectRole: (roleId: string | number) => void;
// }

// export interface RoleSelectorProps {
//   roles: Role[];
//   selectedRoleId: string | number | null;
//   onSelectRole: (roleId: string | number) => void;
// }

// export interface PermissionTreeProps {
//   tree: ModuleNode[];
//   isLoading: boolean;
//   onToggleNode: (type: NodeType, ids: ToggleIds) => void;
//   onToggleExpandModule: (moduleId: string | number) => void;
//   onToggleExpandSubmodule: (moduleId: string | number, submoduleId: string | number) => void;
//   onToggleExpandFeature: (
//     moduleId: string | number,
//     submoduleId: string | number | undefined,
//     featureId: string | number,
//   ) => void;
// }

// export interface PermissionTreeLogicProps {
//   permissions: PermissionPayload;
//   tree: ModuleNode[];
//   onToggleNode: (type: NodeType, ids: ToggleIds) => void;
//   onToggleExpandModule: (moduleId: string | number) => void;
//   onToggleExpandSubmodule: (moduleId: string | number, submoduleId: string | number) => void;
//   onToggleExpandFeature: (
//     moduleId: string | number,
//     submoduleId: string | number,
//     featureId: string | number,
//   ) => void;
// }

// export type PermissionPayloadType = PermissionPayload | PermissionPayload[];
// export type ModuleLike = ModuleNode | SubmoduleNode | FeatureNode;
