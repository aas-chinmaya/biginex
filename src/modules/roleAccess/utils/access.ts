/**
 * ============================================================
 * ROLE ACCESS / PERMISSION UTILITIES
 * ============================================================
 *
 * Permission hierarchy:
 *
 * Module
 *   ├── Submodule
 *   │     ├── Feature
 *   │     │     └── API
 *   │     └── API
 *   ├── Feature
 *   └── API
 *
 * IMPORTANT:
 *
 * This file uses the SAME tree types from:
 *
 * @/modules/roleAccess/types
 *
 * Do NOT create another PermissionNode interface here.
 */

import type {
  ApiNode,
  FeatureNode,
  ModuleNode,
  PermissionPayload,
  SubmoduleNode,
} from "@/modules/roleAccess/types";

/* ============================================================
 * SIDEBAR TYPES
 * ============================================================ */

export interface SidebarChild {
  title: string;
  href: string;
  icon?: any;
  badge?: string | number;
}

export interface SidebarItem {
  title: string;
  href?: string;
  icon?: any;
  badge?: string | number;
  children?: SidebarChild[];
}

/* ============================================================
 * TREE NODE TYPE
 * ============================================================ */

type PermissionTreeNode =
  | ModuleNode
  | SubmoduleNode
  | FeatureNode
  | ApiNode;

/* ============================================================
 * NODE TYPE
 * ============================================================ */

type PermissionNodeType =
  | "module"
  | "subModule"
  | "feature"
  | "api";

/* ============================================================
 * SUPER ADMIN
 * ============================================================ */

export const isSuperAdminRole = (
  role?: string | null,
): boolean => {
  return (
    String(role ?? "")
      .trim()
      .toUpperCase()
      .replace(/[\s_-]+/g, "") === "SUPERADMIN"
  );
};

/* ============================================================
 * STRING NORMALIZATION
 * ============================================================ */

const normalizeName = (
  value?: string | null,
): string => {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

/* ============================================================
 * ROUTE NORMALIZATION
 * ============================================================ */

const normalizeRoute = (
  route?: string | null,
): string => {
  if (!route) {
    return "";
  }

  let normalized = String(route).trim();

  if (!normalized) {
    return "";
  }

  // Remove query string.
  normalized = normalized.split("?")[0];

  // Remove hash.
  normalized = normalized.split("#")[0];

  // Convert backslashes to slashes.
  normalized = normalized.replace(/\\/g, "/");

  // Remove duplicate slashes.
  normalized = normalized.replace(/\/+/g, "/");

  // Add leading slash.
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  // Remove trailing slash except root.
  if (
    normalized.length > 1 &&
    normalized.endsWith("/")
  ) {
    normalized = normalized.slice(0, -1);
  }

  return normalized.toLowerCase();
};

/* ============================================================
 * ROUTE SEGMENT NORMALIZATION
 * ============================================================ */

const normalizeRouteSegment = (
  segment: string,
): string => {
  const value = segment
    .trim()
    .toLowerCase();

  if (!value) {
    return "";
  }

  /*
   * categories -> category
   */
  if (value.endsWith("ies")) {
    return `${value.slice(0, -3)}y`;
  }

  /*
   * items -> item
   */
  if (
    value.endsWith("s") &&
    !value.endsWith("ss")
  ) {
    return value.slice(0, -1);
  }

  return value;
};

/* ============================================================
 * GET ROUTE SEGMENTS
 * ============================================================ */

const getRouteSegments = (
  route?: string | null,
): string[] => {
  const normalized =
    normalizeRoute(route);

  if (
    !normalized ||
    normalized === "/"
  ) {
    return [];
  }

  return normalized
    .split("/")
    .filter(Boolean)
    .map(normalizeRouteSegment);
};

/* ============================================================
 * ROUTE EQUALITY
 * ============================================================ */

const routesEquivalent = (
  first?: string | null,
  second?: string | null,
): boolean => {
  const firstSegments =
    getRouteSegments(first);

  const secondSegments =
    getRouteSegments(second);

  if (
    firstSegments.length !==
    secondSegments.length
  ) {
    return false;
  }

  return firstSegments.every(
    (segment, index) =>
      segment === secondSegments[index],
  );
};

/* ============================================================
 * ROUTE PREFIX MATCH
 * ============================================================ */

const routeStartsWith = (
  parentRoute?: string | null,
  childRoute?: string | null,
): boolean => {
  const parentSegments =
    getRouteSegments(parentRoute);

  const childSegments =
    getRouteSegments(childRoute);

  if (!parentSegments.length) {
    return false;
  }

  if (
    childSegments.length <
    parentSegments.length
  ) {
    return false;
  }

  return parentSegments.every(
    (segment, index) =>
      segment === childSegments[index],
  );
};

/* ============================================================
 * GET NODE ROUTE
 * ============================================================ */

const getNodeRoute = (
  node?: PermissionTreeNode | null,
): string => {
  return normalizeRoute(
    node?.route,
  );
};

/* ============================================================
 * RESOLVE CHILD ROUTE
 * ============================================================ */

const resolveChildRoute = (
  parentRoute: string,
  childRoute?: string | null,
): string => {
  const parent =
    normalizeRoute(parentRoute);

  const child =
    String(childRoute ?? "").trim();

  if (!child) {
    return parent;
  }

  /*
   * Absolute child route.
   *
   * /items + /products
   * => /products
   */
  if (child.startsWith("/")) {
    return normalizeRoute(child);
  }

  /*
   * Relative child route.
   *
   * /items + all-items
   * => /items/all-items
   */
  if (!parent) {
    return normalizeRoute(child);
  }

  return normalizeRoute(
    `${parent}/${child}`,
  );
};

/* ============================================================
 * GET ROUTE CANDIDATES
 * ============================================================ */

const getRouteCandidates = (
  node: PermissionTreeNode,
  parentRoute?: string,
): string[] => {
  const candidates =
    new Set<string>();

  const nodeRoute =
    getNodeRoute(node);

  /*
   * Direct route.
   */
  if (nodeRoute) {
    candidates.add(nodeRoute);
  }

  /*
   * Relative child route.
   *
   * Example:
   *
   * module:
   * /item
   *
   * submodule:
   * all-item
   *
   * candidate:
   * /item/all-item
   */
  if (
    parentRoute &&
    node.route
  ) {
    candidates.add(
      resolveChildRoute(
        parentRoute,
        node.route,
      ),
    );
  }

  return Array.from(candidates);
};

/* ============================================================
 * NODE ROUTE MATCH
 * ============================================================ */

const nodeMatchesRoute = (
  node: PermissionTreeNode,
  requestedRoute: string,
  parentRoute?: string,
): boolean => {
  const requested =
    normalizeRoute(requestedRoute);

  if (!requested) {
    return false;
  }

  const candidates =
    getRouteCandidates(
      node,
      parentRoute,
    );

  return candidates.some(
    (candidate) =>
      routesEquivalent(
        candidate,
        requested,
      ) ||
      routeStartsWith(
        candidate,
        requested,
      ),
  );
};

/* ============================================================
 * PERMISSION SETS
 * ============================================================ */

interface PermissionSets {
  moduleIds: Set<string>;
  subModuleIds: Set<string>;
  featureIds: Set<string>;
  apiIds: Set<string>;

  moduleNames: Set<string>;
  subModuleNames: Set<string>;
  featureNames: Set<string>;
  apiNames: Set<string>;
}

/* ============================================================
 * CREATE ID SET
 * ============================================================ */

const createIdSet = (
  values?: Array<
    string | number | null | undefined
  >,
): Set<string> => {
  return new Set(
    (values ?? [])
      .filter(
        (
          value,
        ): value is string | number =>
          value !== null &&
          value !== undefined &&
          value !== "",
      )
      .map((value) =>
        String(value),
      ),
  );
};

/* ============================================================
 * CREATE NAME SET
 * ============================================================ */

const createNameSet = (
  values?: Array<
    string | null | undefined
  >,
): Set<string> => {
  return new Set(
    (values ?? [])
      .filter(Boolean)
      .map(normalizeName),
  );
};

/* ============================================================
 * BUILD PERMISSION SETS
 * ============================================================ */

const buildPermissionSets = (
  permissions?:
    | PermissionPayload
    | PermissionPayload[]
    | null,
): PermissionSets => {
  /*
   * Normalize:
   *
   * PermissionPayload
   *
   * OR
   *
   * PermissionPayload[]
   */
  const normalized: PermissionPayload = {
    moduleIds: [],
    subModuleIds: [],
    featureIds: [],
    apiIds: [],

    moduleNames: [],
    subModuleNames: [],
    featureNames: [],
    apiNames: [],
  };

  if (Array.isArray(permissions)) {
    for (
      const permission of permissions
    ) {
      normalized.moduleIds.push(
        ...(permission.moduleIds ?? []),
      );

      normalized.subModuleIds.push(
        ...(permission.subModuleIds ?? []),
      );

      normalized.featureIds.push(
        ...(permission.featureIds ?? []),
      );

      normalized.apiIds.push(
        ...(permission.apiIds ?? []),
      );

      normalized.moduleNames?.push(
        ...(permission.moduleNames ?? []),
      );

      normalized.subModuleNames?.push(
        ...(permission.subModuleNames ?? []),
      );

      normalized.featureNames?.push(
        ...(permission.featureNames ?? []),
      );

      normalized.apiNames?.push(
        ...(permission.apiNames ?? []),
      );
    }
  } else if (permissions) {
    normalized.moduleIds.push(
      ...(permissions.moduleIds ?? []),
    );

    normalized.subModuleIds.push(
      ...(permissions.subModuleIds ?? []),
    );

    normalized.featureIds.push(
      ...(permissions.featureIds ?? []),
    );

    normalized.apiIds.push(
      ...(permissions.apiIds ?? []),
    );

    normalized.moduleNames?.push(
      ...(permissions.moduleNames ?? []),
    );

    normalized.subModuleNames?.push(
      ...(permissions.subModuleNames ?? []),
    );

    normalized.featureNames?.push(
      ...(permissions.featureNames ?? []),
    );

    normalized.apiNames?.push(
      ...(permissions.apiNames ?? []),
    );
  }

  return {
    moduleIds: createIdSet(
      normalized.moduleIds,
    ),

    subModuleIds: createIdSet(
      normalized.subModuleIds,
    ),

    featureIds: createIdSet(
      normalized.featureIds,
    ),

    apiIds: createIdSet(
      normalized.apiIds,
    ),

    moduleNames: createNameSet(
      normalized.moduleNames,
    ),

    subModuleNames: createNameSet(
      normalized.subModuleNames,
    ),

    featureNames: createNameSet(
      normalized.featureNames,
    ),

    apiNames: createNameSet(
      normalized.apiNames,
    ),
  };
};

/* ============================================================
 * GET NODE ID
 * ============================================================ */

const getNodeId = (
  node: PermissionTreeNode,
): string => {
  if (
    node.id === null ||
    node.id === undefined
  ) {
    return "";
  }

  return String(node.id);
};

/* ============================================================
 * GET NODE NAME
 * ============================================================ */

const getNodeName = (
  node: PermissionTreeNode,
): string => {
  return normalizeName(
    node.name,
  );
};

/* ============================================================
 * GET CHECKED STATE
 * ============================================================ */

const getNodeChecked = (
  node: PermissionTreeNode,
): boolean => {
  /*
   * All your ModuleNode,
   * SubmoduleNode and FeatureNode
   * have checked.
   *
   * API may also inherit the relevant
   * master property depending on your API type.
   */
  if (
    "checked" in node &&
    typeof node.checked === "boolean"
  ) {
    return node.checked;
  }

  return false;
};

/* ============================================================
 * CHECK NODE ALLOWED
 * ============================================================ */

const isNodeAllowed = (
  node: PermissionTreeNode,
  permissions: PermissionSets,
  type: PermissionNodeType,
): boolean => {
  /*
   * ----------------------------------------------------------
   * 1. Current tree state
   * ----------------------------------------------------------
   *
   * applyPermissionsToTree() should already populate
   * checked correctly.
   */
  if (getNodeChecked(node)) {
    return true;
  }

  /*
   * ----------------------------------------------------------
   * 2. ID based permission
   * ----------------------------------------------------------
   */

  const nodeId =
    getNodeId(node);

  if (nodeId) {
    if (
      type === "module" &&
      permissions.moduleIds.has(nodeId)
    ) {
      return true;
    }

    if (
      type === "subModule" &&
      permissions.subModuleIds.has(nodeId)
    ) {
      return true;
    }

    if (
      type === "feature" &&
      permissions.featureIds.has(nodeId)
    ) {
      return true;
    }

    if (
      type === "api" &&
      permissions.apiIds.has(nodeId)
    ) {
      return true;
    }
  }

  /*
   * ----------------------------------------------------------
   * 3. Name based permission
   * ----------------------------------------------------------
   */

  const nodeName =
    getNodeName(node);

  if (nodeName) {
    if (
      type === "module" &&
      permissions.moduleNames.has(
        nodeName,
      )
    ) {
      return true;
    }

    if (
      type === "subModule" &&
      permissions.subModuleNames.has(
        nodeName,
      )
    ) {
      return true;
    }

    if (
      type === "feature" &&
      permissions.featureNames.has(
        nodeName,
      )
    ) {
      return true;
    }

    if (
      type === "api" &&
      permissions.apiNames.has(
        nodeName,
      )
    ) {
      return true;
    }
  }

  return false;
};

/* ============================================================
 * CHECK ACCESSIBLE DESCENDANT
 * ============================================================ */

const hasAccessibleDescendant = (
  node: PermissionTreeNode,
  requestedRoute: string,
  permissions: PermissionSets,
  parentRoute?: string,
  type: PermissionNodeType = "module",
): boolean => {
  /*
   * ----------------------------------------------------------
   * Check current node
   * ----------------------------------------------------------
   */

  if (
    nodeMatchesRoute(
      node,
      requestedRoute,
      parentRoute,
    )
  ) {
    if (
      isNodeAllowed(
        node,
        permissions,
        type,
      )
    ) {
      return true;
    }
  }

  /*
   * ----------------------------------------------------------
   * Build current route
   * ----------------------------------------------------------
   */

  const currentRoute =
    node.route
      ? resolveChildRoute(
          parentRoute ?? "",
          node.route,
        )
      : parentRoute ?? "";

  /* ==========================================================
   * SUBMODULES
   * ========================================================== */

  if (
    "submodules" in node &&
    Array.isArray(
      node.submodules,
    )
  ) {
    for (
      const submodule of
      node.submodules
    ) {
      if (
        hasAccessibleDescendant(
          submodule,
          requestedRoute,
          permissions,
          currentRoute,
          "subModule",
        )
      ) {
        return true;
      }
    }
  }

  /* ==========================================================
   * FEATURES
   * ========================================================== */

  if (
    "features" in node &&
    Array.isArray(
      node.features,
    )
  ) {
    for (
      const feature of
      node.features
    ) {
      if (
        hasAccessibleDescendant(
          feature,
          requestedRoute,
          permissions,
          currentRoute,
          "feature",
        )
      ) {
        return true;
      }
    }
  }

  /* ==========================================================
   * APIS
   * ========================================================== */

  if (
    "apis" in node &&
    Array.isArray(
      node.apis,
    )
  ) {
    for (
      const api of
      node.apis
    ) {
      if (
        hasAccessibleDescendant(
          api,
          requestedRoute,
          permissions,
          currentRoute,
          "api",
        )
      ) {
        return true;
      }
    }
  }

  return false;
};

/* ============================================================
 * FIND ROUTE NODE
 * ============================================================ */

const findRouteNode = (
  tree: ModuleNode[],
  requestedRoute: string,
): PermissionTreeNode | null => {
  const walk = (
    nodes: PermissionTreeNode[],
    parentRoute?: string,
  ): PermissionTreeNode | null => {
    for (
      const node of nodes
    ) {
      /*
       * Current node.
       */
      if (
        nodeMatchesRoute(
          node,
          requestedRoute,
          parentRoute,
        )
      ) {
        return node;
      }

      /*
       * Current route.
       */
      const currentRoute =
        node.route
          ? resolveChildRoute(
              parentRoute ?? "",
              node.route,
            )
          : parentRoute ?? "";

      /*
       * --------------------------------------------------------
       * Submodules
       * --------------------------------------------------------
       */

      if (
        "submodules" in node &&
        Array.isArray(
          node.submodules,
        )
      ) {
        const result =
          walk(
            node.submodules,
            currentRoute,
          );

        if (result) {
          return result;
        }
      }

      /*
       * --------------------------------------------------------
       * Features
       * --------------------------------------------------------
       */

      if (
        "features" in node &&
        Array.isArray(
          node.features,
        )
      ) {
        const result =
          walk(
            node.features,
            currentRoute,
          );

        if (result) {
          return result;
        }
      }

      /*
       * --------------------------------------------------------
       * APIs
       * --------------------------------------------------------
       */

      if (
        "apis" in node &&
        Array.isArray(
          node.apis,
        )
      ) {
        const result =
          walk(
            node.apis,
            currentRoute,
          );

        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  return walk(tree);
};

/* ============================================================
 * GET ROUTE NODE TYPE
 * ============================================================ */

const getRouteNodeType = (
  node: PermissionTreeNode,
): PermissionNodeType => {
  /*
   * Module has submodules.
   */
  if (
    "submodules" in node
  ) {
    return "module";
  }

  /*
   * Submodule has features.
   */
  if (
    "features" in node
  ) {
    return "subModule";
  }

  /*
   * Feature has APIs.
   */
  if (
    "apis" in node
  ) {
    return "feature";
  }

  /*
   * Leaf node = API.
   */
  return "api";
};

/* ============================================================
 * MAIN ROUTE ACCESS CHECK
 * ============================================================ */

export const hasAccessToRoute = (
  tree: ModuleNode[],
  pathname: string,
  permissions?:
    | PermissionPayload
    | PermissionPayload[]
    | null,
  userRole?: string | null,
): boolean => {
  /*
   * ----------------------------------------------------------
   * SUPER ADMIN
   * ----------------------------------------------------------
   */

  if (
    isSuperAdminRole(userRole)
  ) {
    return true;
  }

  /*
   * ----------------------------------------------------------
   * Normalize pathname
   * ----------------------------------------------------------
   */

  const normalizedPath =
    normalizeRoute(pathname);

  /*
   * ----------------------------------------------------------
   * Root/dashboard
   * ----------------------------------------------------------
   */

  if (
    normalizedPath === "/" ||
    normalizedPath === "/dashboard"
  ) {
    return true;
  }

  /*
   * ----------------------------------------------------------
   * Empty tree
   * ----------------------------------------------------------
   */

  if (
    !Array.isArray(tree) ||
    tree.length === 0
  ) {
    return false;
  }

  /*
   * ----------------------------------------------------------
   * Permission sets
   * ----------------------------------------------------------
   */

  const permissionSets =
    buildPermissionSets(
      permissions,
    );

  /*
   * ----------------------------------------------------------
   * Find route node
   * ----------------------------------------------------------
   */

  const routeNode =
    findRouteNode(
      tree,
      normalizedPath,
    );

  /*
   * ----------------------------------------------------------
   * Exact route node
   * ----------------------------------------------------------
   */

  if (routeNode) {
    const nodeType =
      getRouteNodeType(
        routeNode,
      );

    if (
      isNodeAllowed(
        routeNode,
        permissionSets,
        nodeType,
      )
    ) {
      return true;
    }
  }

  /*
   * ----------------------------------------------------------
   * Check hierarchy
   * ----------------------------------------------------------
   *
   * A parent route is accessible when at least one
   * child permission is accessible.
   */

  for (
    const module of tree
  ) {
    if (
      hasAccessibleDescendant(
        module,
        normalizedPath,
        permissionSets,
        undefined,
        "module",
      )
    ) {
      return true;
    }
  }

  return false;
};

/* ============================================================
 * FILTER SIDEBAR
 * ============================================================ */

export const filterSidebarItems = (
  items: SidebarItem[],
  accessTree: ModuleNode[],
  permissions?:
    | PermissionPayload
    | PermissionPayload[]
    | null,
  userRole?: string | null,
): SidebarItem[] => {
  /*
   * SUPER ADMIN gets everything.
   */
  if (
    isSuperAdminRole(userRole)
  ) {
    return items;
  }

  if (!Array.isArray(items)) {
    return [];
  }

  return items.reduce<
    SidebarItem[]
  >(
    (result, item) => {
      /*
       * --------------------------------------------------------
       * Parent with children
       * --------------------------------------------------------
       */

      if (
        Array.isArray(
          item.children,
        ) &&
        item.children.length > 0
      ) {
        const visibleChildren =
          item.children.filter(
            (child) =>
              hasAccessToRoute(
                accessTree,
                child.href,
                permissions,
                userRole,
              ),
          );

        /*
         * Parent itself may have permission.
         */
        const parentAccessible =
          item.href
            ? hasAccessToRoute(
                accessTree,
                item.href,
                permissions,
                userRole,
              )
            : false;

        /*
         * Keep parent if:
         *
         * - child is accessible
         * OR
         * - parent is accessible
         */
        if (
          visibleChildren.length >
            0 ||
          parentAccessible
        ) {
          result.push({
            ...item,
            children:
              visibleChildren,
          });
        }

        return result;
      }

      /*
       * --------------------------------------------------------
       * No href
       * --------------------------------------------------------
       */

      if (!item.href) {
        return result;
      }

      /*
       * --------------------------------------------------------
       * Normal sidebar item
       * --------------------------------------------------------
       */

      if (
        hasAccessToRoute(
          accessTree,
          item.href,
          permissions,
          userRole,
        )
      ) {
        result.push(item);
      }

      return result;
    },
    [],
  );
};

/* ============================================================
 * DEBUG ROUTE ACCESS
 * ============================================================ */

export const debugRouteAccess = (
  tree: ModuleNode[],
  pathname: string,
  permissions?:
    | PermissionPayload
    | PermissionPayload[]
    | null,
  userRole?: string | null,
): boolean => {
  const result =
    hasAccessToRoute(
      tree,
      pathname,
      permissions,
      userRole,
    );

  console.log(
    "[ACCESS DEBUG]",
    {
      userRole,
      pathname,
      result,
      tree,
      permissions,
    },
  );

  return result;
};









// import type { ModuleNode, PermissionPayload, SubmoduleNode, FeatureNode, ApiNode } from '@/modules/roleAccess/types';
// import type { SidebarItem } from '@/config/sidebar';

// const normalizeRoute = (value?: string | null) =>
//   (value ?? '')
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/\/+/g, '/');

// const normalizeName = (value?: string | null) =>
//   (value ?? '')
//     .trim()
//     .toLowerCase()
//     .replace(/[_\s-]+/g, ' ')
//     .replace(/\s+/g, ' ');

// const hasId = (value?: string | number | null) => value !== undefined && value !== null && value !== '';

// const getAccessibleValues = (permissions?: PermissionPayload | null) => ({
//   moduleIds: new Set((permissions?.moduleIds ?? []).map(String)),
//   subModuleIds: new Set((permissions?.subModuleIds ?? []).map(String)),
//   featureIds: new Set((permissions?.featureIds ?? []).map(String)),
//   apiIds: new Set((permissions?.apiIds ?? []).map(String)),
//   moduleNames: new Set((permissions?.moduleNames ?? []).map((item) => normalizeName(item))),
//   subModuleNames: new Set((permissions?.subModuleNames ?? []).map((item) => normalizeName(item))),
//   featureNames: new Set((permissions?.featureNames ?? []).map((item) => normalizeName(item))),
//   apiNames: new Set((permissions?.apiNames ?? []).map((item) => normalizeName(item))),
// });

// const isNodeAllowed = (
//   nodeType: 'module' | 'submodule' | 'feature' | 'api',
//   node: { id?: string | number; name?: string; route?: string },
//   permissions?: PermissionPayload | null,
// ): boolean => {
//   if (!permissions) {
//     return true;
//   }

//   const values = getAccessibleValues(permissions);
//   const normalizedName = normalizeName(node.name);

//   if (nodeType === 'api') {
//     if (hasId(node.id) && values.apiIds.has(String(node.id))) {
//       return true;
//     }

//     return normalizedName.length > 0 && values.apiNames.has(normalizedName);
//   }

//   if (nodeType === 'feature') {
//     if (hasId(node.id) && values.featureIds.has(String(node.id))) {
//       return true;
//     }

//     return normalizedName.length > 0 && values.featureNames.has(normalizedName);
//   }

//   if (nodeType === 'submodule') {
//     if (hasId(node.id) && values.subModuleIds.has(String(node.id))) {
//       return true;
//     }

//     return normalizedName.length > 0 && values.subModuleNames.has(normalizedName);
//   }

//   if (hasId(node.id) && values.moduleIds.has(String(node.id))) {
//     return true;
//   }

//   return normalizedName.length > 0 && values.moduleNames.has(normalizedName);
// };

// const nodeMatchesRoute = (node: { route?: string }, pathname: string) => {
//   const normalizedPath = normalizeRoute(pathname);
//   const normalizedRoute = normalizeRoute(node.route);

//   if (!normalizedRoute) {
//     return false;
//   }

//   return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
// };

// const hasAccessibleDescendant = (
//   tree: ModuleNode[],
//   pathname: string,
//   permissions?: PermissionPayload | null,
// ): boolean => {
//   for (const module of tree) {
//     if (nodeMatchesRoute(module, pathname) && isNodeAllowed('module', module, permissions)) {
//       return true;
//     }

//     for (const feature of module.features ?? []) {
//       if (nodeMatchesRoute(feature, pathname) && isNodeAllowed('feature', feature, permissions)) {
//         return true;
//       }

//       for (const api of feature.apis ?? []) {
//         if (nodeMatchesRoute(api, pathname) && isNodeAllowed('api', api, permissions)) {
//           return true;
//         }
//       }
//     }

//     for (const api of module.apis ?? []) {
//       if (nodeMatchesRoute(api, pathname) && isNodeAllowed('api', api, permissions)) {
//         return true;
//       }
//     }

//     for (const submodule of module.submodules ?? []) {
//       if (nodeMatchesRoute(submodule, pathname) && isNodeAllowed('submodule', submodule, permissions)) {
//         return true;
//       }

//       for (const feature of submodule.features ?? []) {
//         if (nodeMatchesRoute(feature, pathname) && isNodeAllowed('feature', feature, permissions)) {
//           return true;
//         }

//         for (const api of feature.apis ?? []) {
//           if (nodeMatchesRoute(api, pathname) && isNodeAllowed('api', api, permissions)) {
//             return true;
//           }
//         }
//       }

//       for (const api of submodule.apis ?? []) {
//         if (nodeMatchesRoute(api, pathname) && isNodeAllowed('api', api, permissions)) {
//           return true;
//         }
//       }
//     }
//   }

//   return false;
// };

// export const isSuperAdminRole = (role?: string | null): boolean => {
//   const normalized = String(role ?? '').trim().toLowerCase();
//   return normalized === 'superadmin' || normalized === 'super admin' || normalized === 'super_admin' || normalized.includes('superadmin');
// };

// const hasAllowedAncestor = (
//   tree: ModuleNode[],
//   pathname: string,
//   permissions?: PermissionPayload | null,
// ): boolean => {
//   for (const module of tree) {
//     if (nodeMatchesRoute(module, pathname)) {
//       return isNodeAllowed('module', module, permissions) || hasAllowedDescendant(module, permissions);
//     }

//     for (const feature of module.features ?? []) {
//       if (nodeMatchesRoute(feature, pathname)) {
//         return isNodeAllowed('feature', feature, permissions) || hasAllowedDescendantInFeature(feature, permissions);
//       }
//     }

//     for (const api of module.apis ?? []) {
//       if (nodeMatchesRoute(api, pathname)) {
//         return isNodeAllowed('api', api, permissions);
//       }
//     }

//     for (const submodule of module.submodules ?? []) {
//       if (nodeMatchesRoute(submodule, pathname)) {
//         return isNodeAllowed('submodule', submodule, permissions) || hasAllowedDescendantInSubmodule(submodule, permissions);
//       }

//       for (const feature of submodule.features ?? []) {
//         if (nodeMatchesRoute(feature, pathname)) {
//           return isNodeAllowed('feature', feature, permissions) || hasAllowedDescendantInFeature(feature, permissions);
//         }
//       }

//       for (const api of submodule.apis ?? []) {
//         if (nodeMatchesRoute(api, pathname)) {
//           return isNodeAllowed('api', api, permissions);
//         }
//       }
//     }
//   }

//   return false;
// };

// const hasAllowedDescendant = (module: ModuleNode, permissions?: PermissionPayload | null): boolean => {
//   for (const feature of module.features ?? []) {
//     if (isNodeAllowed('feature', feature, permissions)) {
//       return true;
//     }

//     for (const api of feature.apis ?? []) {
//       if (isNodeAllowed('api', api, permissions)) {
//         return true;
//       }
//     }
//   }

//   for (const api of module.apis ?? []) {
//     if (isNodeAllowed('api', api, permissions)) {
//       return true;
//     }
//   }

//   for (const submodule of module.submodules ?? []) {
//     if (isNodeAllowed('submodule', submodule, permissions)) {
//       return true;
//     }

//     for (const feature of submodule.features ?? []) {
//       if (isNodeAllowed('feature', feature, permissions)) {
//         return true;
//       }

//       for (const api of feature.apis ?? []) {
//         if (isNodeAllowed('api', api, permissions)) {
//           return true;
//         }
//       }
//     }

//     for (const api of submodule.apis ?? []) {
//       if (isNodeAllowed('api', api, permissions)) {
//         return true;
//       }
//     }
//   }

//   return false;
// };

// const hasAllowedDescendantInSubmodule = (submodule: SubmoduleNode, permissions?: PermissionPayload | null): boolean => {
//   for (const feature of submodule.features ?? []) {
//     if (isNodeAllowed('feature', feature, permissions)) {
//       return true;
//     }

//     for (const api of feature.apis ?? []) {
//       if (isNodeAllowed('api', api, permissions)) {
//         return true;
//       }
//     }
//   }

//   for (const api of submodule.apis ?? []) {
//     if (isNodeAllowed('api', api, permissions)) {
//       return true;
//     }
//   }

//   return false;
// };

// const hasAllowedDescendantInFeature = (feature: FeatureNode, permissions?: PermissionPayload | null): boolean => {
//   for (const api of feature.apis ?? []) {
//     if (isNodeAllowed('api', api, permissions)) {
//       return true;
//     }
//   }

//   return false;
// };

// export const hasAccessToRoute = (
//   tree: ModuleNode[],
//   pathname: string,
//   permissions?: PermissionPayload | null,
//   userRole?: string | null,
// ): boolean => {
//   if (isSuperAdminRole(userRole)) {
//     return true;
//   }

//   if (!tree.length) {
//     return true;
//   }

//   if (!permissions) {
//     return true;
//   }

//   if (permissions?.moduleIds?.length === 0 && permissions?.subModuleIds?.length === 0 && permissions?.featureIds?.length === 0 && permissions?.apiIds?.length === 0) {
//     return false;
//   }

//   const directMatch = hasAccessibleDescendant(tree, pathname, permissions);

//   if (directMatch) {
//     return true;
//   }

//   return hasAllowedAncestor(tree, pathname, permissions);
// };

// export const hasAccessToFeature = (
//   tree: ModuleNode[],
//   route?: string,
//   permissions?: PermissionPayload | null,
//   featureName?: string,
//   userRole?: string | null,
// ): boolean => {
//   if (isSuperAdminRole(userRole)) {
//     return true;
//   }

//   if (!tree.length || !permissions) {
//     return true;
//   }

//   const normalizedRoute = normalizeRoute(route);
//   const normalizedName = normalizeRoute(featureName);

//   const matchesNode = (node: { name?: string; route?: string }, targetRoute?: string, targetName?: string) => {
//     const routeMatches = targetRoute ? normalizeRoute(node.route) === targetRoute : false;
//     const nameMatches = targetName ? normalizeRoute(node.name) === targetName : false;
//     return routeMatches || nameMatches;
//   };

//   for (const module of tree) {
//     for (const feature of module.features ?? []) {
//       if (matchesNode(feature, normalizedRoute, normalizedName)) {
//         return isNodeAllowed('feature', feature, permissions);
//       }

//       for (const api of feature.apis ?? []) {
//         if (matchesNode(api, normalizedRoute, normalizedName)) {
//           return isNodeAllowed('api', api, permissions);
//         }
//       }
//     }

//     for (const api of module.apis ?? []) {
//       if (matchesNode(api, normalizedRoute, normalizedName)) {
//         return isNodeAllowed('api', api, permissions);
//       }
//     }

//     for (const submodule of module.submodules ?? []) {
//       if (matchesNode(submodule, normalizedRoute, normalizedName)) {
//         return isNodeAllowed('submodule', submodule, permissions);
//       }

//       for (const feature of submodule.features ?? []) {
//         if (matchesNode(feature, normalizedRoute, normalizedName)) {
//           return isNodeAllowed('feature', feature, permissions);
//         }

//         for (const api of feature.apis ?? []) {
//           if (matchesNode(api, normalizedRoute, normalizedName)) {
//             return isNodeAllowed('api', api, permissions);
//           }
//         }
//       }

//       for (const api of submodule.apis ?? []) {
//         if (matchesNode(api, normalizedRoute, normalizedName)) {
//           return isNodeAllowed('api', api, permissions);
//         }
//       }
//     }
//   }

//   return false;
// };

// export const filterSidebarItems = (
//   items: SidebarItem[],
//   tree: ModuleNode[],
//   permissions?: PermissionPayload | null,
//   userRole?: string | null,
// ): SidebarItem[] => {
//   if (isSuperAdminRole(userRole)) {
//     return items;
//   }

//   return items.reduce<SidebarItem[]>((acc, item) => {
//     if (item.children?.length) {
//       const visibleChildren = item.children.filter((child) => hasAccessToRoute(tree, child.href, permissions));
//       if (visibleChildren.length > 0) {
//         acc.push({ ...item, children: visibleChildren });
//       }
//       return acc;
//     }

//     if (item.href && hasAccessToRoute(tree, item.href, permissions)) {
//       acc.push(item);
//     }

//     return acc;
//   }, []);
// };

// export const getNodeAccessLabel = (node: { checked?: boolean; indeterminate?: boolean }) => {
//   if (node.checked) {
//     return 'allowed';
//   }

//   if (node.indeterminate) {
//     return 'partial';
//   }

//   return 'denied';
// };
