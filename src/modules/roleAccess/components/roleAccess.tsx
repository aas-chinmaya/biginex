"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import RoleSelector from "@/modules/roleAccess/components/RoleSelector";
import RoleAccessHeader from "@/modules/roleAccess/components/RoleAccessHeader";
import { notify } from "@/lib/toast";

import type { AppDispatch, RootState } from "@/store/store";
import type {
  ModuleNode,
  PermissionPayload,
} from "@/modules/roleAccess/types";
import type {
  NodeType,
  PendingPermission,
  PermissionSummary,
  ToggleIds,
} from "@/modules/roleAccess/types";

import {
  assignRolePermissions,
  loadRoleAccess,
  loadRolePermissions,
} from "@/modules/roleAccess/store/roleAccessSlice";

import {
  allowAllTree,
  applyPermissionsToTree,
  buildPermissionSummary,
  clearTreeSelection,
  collectPermissions,
  filterTree,
  findNodeChecked,
  toggleExpandFeature as toggleExpandFeatureNode,
  toggleExpandModule as toggleExpandModuleNode,
  toggleExpandSubmodule as toggleExpandSubmoduleNode,
  toggleNodeInTree,
} from "@/modules/roleAccess/utils/treeUtils";

import PermissionTree from "./PermissionTree";

export default function RoleAccessPage() {
  const dispatch = useDispatch<AppDispatch>();

  /* -------------------------------------------------------------------------- */
  /*                                  REDUX                                     */
  /* -------------------------------------------------------------------------- */

  const { user } = useSelector((state: RootState) => state.auth);

  const {
    roles,
    accessTree,
    isLoading,
    isSaving,
  } = useSelector(
    (state: RootState) => state.roleAccess
  );

  /* -------------------------------------------------------------------------- */
  /*                                  STATE                                     */
  /* -------------------------------------------------------------------------- */

  const [selectedRoleId, setSelectedRoleId] = useState<
    string | number | null
  >(null);

  const [hasLoadedPermissionsForRole, setHasLoadedPermissionsForRole] =
    useState<string | null>(null);

  const [treeData, setTreeData] = useState<ModuleNode[]>([]);

  const [baseTree, setBaseTree] = useState<ModuleNode[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [pendingPermissions, setPendingPermissions] = useState<
    PendingPermission[]
  >([]);

  /* -------------------------------------------------------------------------- */
  /*                         MAP PERMISSIONS TO TREE                             */
  /* -------------------------------------------------------------------------- */

  const mapPermissionsToTree = useCallback(
    (
      tree: ModuleNode[],
      permissions: PermissionPayload
    ): ModuleNode[] => {
      return applyPermissionsToTree(tree, permissions);
    },
    []
  );

  /* -------------------------------------------------------------------------- */
  /*                         LOAD ROLE ACCESS                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    const loadAccess = async () => {
      try {
        const result = await dispatch(
          loadRoleAccess()
        ).unwrap();

        if (cancelled) {
          return;
        }

        console.log(
          "✅ Role access loaded:",
          result
        );

        /*
         * Find logged-in user's role.
         */
        const loggedInRole = String(
          user?.role ?? ""
        )
          .trim()
          .toLowerCase();

        const matchedRole = result.roles?.find(
          (role) =>
            String(role.name)
              .trim()
              .toLowerCase() === loggedInRole
        );

        /*
         * If logged-in role is not found,
         * use the first available role.
         */
        const resolvedRole =
          matchedRole ?? result.roles?.[0];

        const safeRoleId =
          resolvedRole?.id != null
            ? String(resolvedRole.id).trim()
            : "";

        if (!safeRoleId) {
          console.error(
            "❌ No valid role ID found:",
            result.roles
          );

          notify.error(
            "No valid role found."
          );

          return;
        }

        console.log(
          "✅ Selected role:",
          resolvedRole
        );

        /*
         * Set selected role.
         *
         * IMPORTANT:
         * We do NOT call loadRolePermissions()
         * here.
         *
         * The separate selectedRoleId effect
         * will handle permissions.
         */
        setSelectedRoleId(safeRoleId);

        setHasLoadedPermissionsForRole(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "❌ loadRoleAccess failed:",
          error
        );

        notify.error(
          "Unable to load role access data."
        );
      }
    };

    loadAccess();

    return () => {
      cancelled = true;
    };
  }, [dispatch, user?.role]);

  /* -------------------------------------------------------------------------- */
  /*                         SET BASE TREE                                      */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!accessTree || accessTree.length === 0) {
      return;
    }

    console.log(
      "🌳 Access tree loaded:",
      accessTree
    );

    /*
     * Store a clean/base copy of the tree.
     *
     * This tree is used when the permissions API
     * does not return its own tree.
     */
    setBaseTree(accessTree);

    /*
     * Only initialize treeData if there is
     * currently no tree.
     *
     * IMPORTANT:
     * Don't overwrite treeData every time
     * accessTree changes after permissions
     * have already been applied.
     */
    setTreeData((currentTree) => {
      if (currentTree.length === 0) {
        return accessTree;
      }

      return currentTree;
    });
  }, [accessTree]);

  /* -------------------------------------------------------------------------- */
  /*                         LOAD ROLE PERMISSIONS                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!selectedRoleId) {
      return;
    }

    const normalizedRoleId =
      String(selectedRoleId);

    /*
     * Don't load the same role twice.
     */
    if (
      hasLoadedPermissionsForRole ===
      normalizedRoleId
    ) {
      return;
    }

    let cancelled = false;

    const loadPermissions = async () => {
      try {
        console.log(
          "🔵 Loading permissions for role:",
          normalizedRoleId
        );

        const permissions = await dispatch(
          loadRolePermissions(
            normalizedRoleId
          )
        ).unwrap();

        if (cancelled) {
          return;
        }

        console.log(
          "✅ Permissions response:",
          permissions
        );

        /*
         * Determine which tree should be used.
         *
         * If API returns a tree, use it.
         * Otherwise use the base access tree.
         */
        const permissionTree =
          permissions?.tree &&
          permissions.tree.length > 0
            ? permissions.tree
            : baseTree;

        if (
          !permissionTree ||
          permissionTree.length === 0
        ) {
          console.warn(
            "⚠️ Permission tree is empty."
          );

          setTreeData([]);

          setHasLoadedPermissionsForRole(
            normalizedRoleId
          );

          return;
        }

        /*
         * Apply permissions to the tree.
         */
        const updatedTree =
          mapPermissionsToTree(
            permissionTree,
            permissions
          );

        console.log(
          "🌳 Permission tree after mapping:",
          updatedTree
        );

        setTreeData(updatedTree);

        /*
         * Mark this role as loaded.
         */
        setHasLoadedPermissionsForRole(
          normalizedRoleId
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "❌ loadRolePermissions failed:",
          error
        );

        notify.error(
          "Unable to load permissions for selected role."
        );
      }
    };

    loadPermissions();

    return () => {
      cancelled = true;
    };
  }, [
    selectedRoleId,
    dispatch,
    baseTree,
    mapPermissionsToTree,
    hasLoadedPermissionsForRole,
  ]);

  /* -------------------------------------------------------------------------- */
  /*                         RESET PENDING CHANGES                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setPendingPermissions([]);
  }, [selectedRoleId]);

  /* -------------------------------------------------------------------------- */
  /*                         TOGGLE NODE                                        */
  /* -------------------------------------------------------------------------- */

  const toggleNode = (
    type: NodeType,
    ids: ToggleIds
  ) => {
    const currentChecked = findNodeChecked(
      treeData,
      type,
      ids
    );

    if (currentChecked === null) {
      return;
    }

    const newChecked = !currentChecked;

    const targetId =
      ids.apiId ??
      ids.featureId ??
      ids.submoduleId ??
      ids.moduleId;

    if (targetId == null) {
      return;
    }

    setPendingPermissions((prev) => {
      const filtered = prev.filter(
        (permission) =>
          !(
            permission.type === type &&
            String(permission.id) ===
              String(targetId)
          )
      );

      return [
        ...filtered,
        {
          type,
          id: targetId,
          isAllowed: newChecked,
        },
      ];
    });

    setTreeData((currentTree) =>
      toggleNodeInTree(
        currentTree,
        type,
        ids,
        newChecked
      )
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                         EXPAND MODULE                                      */
  /* -------------------------------------------------------------------------- */

  const toggleExpandModule = (
    moduleId: string | number
  ) => {
    setTreeData((current) =>
      toggleExpandModuleNode(
        current,
        moduleId
      )
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                         EXPAND SUBMODULE                                   */
  /* -------------------------------------------------------------------------- */

  const toggleExpandSubmodule = (
    moduleId: string | number,
    submoduleId: string | number
  ) => {
    setTreeData((current) =>
      toggleExpandSubmoduleNode(
        current,
        moduleId,
        submoduleId
      )
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                         EXPAND FEATURE                                     */
  /* -------------------------------------------------------------------------- */

  const toggleExpandFeature = (
    moduleId: string | number,
    submoduleId: string | number | undefined,
    featureId: string | number
  ) => {
    setTreeData((current) =>
      toggleExpandFeatureNode(
        current,
        moduleId,
        submoduleId,
        featureId
      )
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                         CLEAR SELECTION                                    */
  /* -------------------------------------------------------------------------- */

  const clearSelection = () => {
    setTreeData((current) =>
      clearTreeSelection(current)
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                         ALLOW ALL                                          */
  /* -------------------------------------------------------------------------- */

  const allowAll = () => {
    setTreeData((current) =>
      allowAllTree(current)
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                         DENY ALL                                           */
  /* -------------------------------------------------------------------------- */

  const denyAll = () => {
    clearSelection();
  };

  /* -------------------------------------------------------------------------- */
  /*                         PERMISSION SUMMARY                                 */
  /* -------------------------------------------------------------------------- */

  const permissions = useMemo<PermissionSummary>(
    () =>
      buildPermissionSummary(treeData),
    [treeData]
  );

  /* -------------------------------------------------------------------------- */
  /*                         FILTER TREE                                        */
  /* -------------------------------------------------------------------------- */

  const filteredTree = useMemo(
    () =>
      filterTree(
        treeData,
        searchQuery
      ),
    [treeData, searchQuery]
  );

  /* -------------------------------------------------------------------------- */
  /*                         SELECT ROLE                                        */
  /* -------------------------------------------------------------------------- */

  const handleSelectRole = (
    roleId: string | number
  ) => {
    const normalizedRoleId =
      String(roleId);

    console.log(
      "🔄 Changing role:",
      normalizedRoleId
    );

    /*
     * Reset loaded state first.
     */
    setHasLoadedPermissionsForRole(null);

    /*
     * Clear old pending changes.
     */
    setPendingPermissions([]);

    /*
     * Set new role.
     */
    setSelectedRoleId(
      normalizedRoleId
    );

    /*
     * Don't manually call loadRolePermissions here.
     *
     * The selectedRoleId useEffect handles it.
     */
  };

  /* -------------------------------------------------------------------------- */
  /*                         SAVE PERMISSIONS                                   */
  /* -------------------------------------------------------------------------- */

  const handleSave = async () => {
    if (!selectedRoleId) {
      notify.error(
        "Select a role before saving permissions."
      );

      return;
    }

    try {
      const payload =
        collectPermissions(
          pendingPermissions
        );

      const hasPayloadData =
        Array.isArray(payload)
          ? payload.length > 0
          : Boolean(
              payload.moduleIds?.length ||
              payload.subModuleIds?.length ||
              payload.featureIds?.length ||
              payload.apiIds?.length
            );

      if (!hasPayloadData) {
        notify.custom(
          "No permission changes to save."
        );

        return;
      }

      console.log(
        "💾 Saving permissions:",
        {
          roleId: String(
            selectedRoleId
          ),
          permissions: payload,
        }
      );

      await dispatch(
        assignRolePermissions({
          roleId: String(
            selectedRoleId
          ),
          permissions: payload,
        })
      ).unwrap();

      /*
       * Clear pending changes after
       * successful save.
       */
      setPendingPermissions([]);

      /*
       * Keep current tree as-is.
       */
      notify.success(
        "Permissions updated successfully."
      );
    } catch (error) {
      console.error(
        "❌ Save permissions failed:",
        error
      );

      notify.error(
        "Unable to save permissions."
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  UI                                        */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto space-y-6">
        {/* ------------------------------------------------------------------ */}
        {/* HEADER                                                             */}
        {/* ------------------------------------------------------------------ */}

        <RoleAccessHeader
          roles={roles}
          selectedRoleId={selectedRoleId}
          permissions={permissions}
        />

        {/* ------------------------------------------------------------------ */}
        {/* TOOLBAR                                                            */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* SEARCH */}

          <div className="flex min-w-[280px] max-w-[550px] w-full items-center">
            <label
              htmlFor="permission-search"
              className="sr-only"
            >
              Search permissions
            </label>

            <div className="relative w-full">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="permission-search"
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search modules, submodules, features, APIs..."
                className="w-full rounded-2xl border border-black bg-white py-2 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap items-center gap-3">
            {/* ROLE SELECTOR */}

            <div className="min-w-[180px]">
              <RoleSelector
                roles={roles}
                selectedRoleId={
                  selectedRoleId
                }
                onSelectRole={
                  handleSelectRole
                }
              />
            </div>

            {/* ALLOW ALL */}

            <button
              type="button"
              onClick={allowAll}
              disabled={
                !selectedRoleId ||
                isLoading
              }
              className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Allow all
            </button>

            {/* DENY ALL */}

            <button
              type="button"
              onClick={denyAll}
              disabled={
                !selectedRoleId ||
                isLoading
              }
              className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Deny all
            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              disabled={
                isSaving ||
                !selectedRoleId
              }
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : "Save Permissions"}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PERMISSION TREE                                                    */}
        {/* ------------------------------------------------------------------ */}

        <PermissionTree
          tree={filteredTree}
          isLoading={
            isLoading ||
            (!!selectedRoleId &&
              hasLoadedPermissionsForRole !==
                String(selectedRoleId))
          }
          onToggleNode={toggleNode}
          onToggleExpandModule={
            toggleExpandModule
          }
          onToggleExpandSubmodule={
            toggleExpandSubmodule
          }
          onToggleExpandFeature={
            toggleExpandFeature
          }
        />
      </div>
    </div>
  );
}





// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Search } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import RoleSelector from "@/modules/roleAccess/components/RoleSelector";
// import RoleAccessHeader from "@/modules/roleAccess/components/RoleAccessHeader";
// import { notify } from "@/lib/toast";
// import type { AppDispatch, RootState } from "@/store/store";
// import type { ModuleNode, PermissionPayload, PermissionRequestPayload } from "@/modules/roleAccess/types";
// import type { NodeType, PendingPermission, PermissionSummary, ToggleIds } from "@/modules/roleAccess/types";
// import {
//   assignRolePermissions,
//   loadRoleAccess,
//   loadRolePermissions,
// } from "@/modules/roleAccess/store/roleAccessSlice";
// import {
//   allowAllTree,
//   applyPermissionsToTree,
//   buildPermissionSummary,
//   clearTreeSelection,
//   collectPermissions,
//   filterTree,
//   findNodeChecked,
//   toggleExpandFeature as toggleExpandFeatureNode,
//   toggleExpandModule as toggleExpandModuleNode,
//   toggleExpandSubmodule as toggleExpandSubmoduleNode,
//   toggleNodeInTree,
// } from "@/modules/roleAccess/utils/treeUtils";
// import PermissionTree from "./PermissionTree";

// export default function RoleAccessPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { roles, accessTree, isLoading, isSaving } = useSelector(
//     (state: RootState) => state.roleAccess,
//   );
//   const [hasLoadedPermissionsForRole, setHasLoadedPermissionsForRole] = useState<string | number | null>(null);
//   const [treeData, setTreeData] = useState<ModuleNode[]>([]);
//   const [baseTree, setBaseTreeState] = useState<ModuleNode[]>([]);
//   const [selectedRoleId, setSelectedRoleId] = useState<string | number | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [pendingPermissions, setPendingPermissions] = useState<PendingPermission[]>([]);

//   useEffect(() => {
//     let cancelled = false;

//     dispatch(loadRoleAccess())
//       .unwrap()
//       .then((result) => {
//         if (cancelled) return;

//         const loggedInRole = String(user?.role ?? "").trim().toLowerCase();
//         const matchedRole = result.roles.find(
//           (role) => String(role.name).trim().toLowerCase() === loggedInRole,
//         );
//         const resolvedRole = matchedRole ?? result.roles[0];
//         const safeRoleId = resolvedRole?.id != null ? String(resolvedRole.id).trim() : "";

//         if (!safeRoleId) {
//           return;
//         }

//         setSelectedRoleId(safeRoleId);
//         setHasLoadedPermissionsForRole(null);
//         dispatch(loadRolePermissions(safeRoleId));
//       })
//       .catch(() => {
//         if (!cancelled) {
//           notify.error("Unable to load role access data.");
//         }
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [dispatch, user?.role]);

//   useEffect(() => {
//     if (accessTree.length === 0) return;
//     setBaseTreeState(accessTree);
//     setTreeData(accessTree);
//   }, [accessTree]);

//   useEffect(() => {
//     setPendingPermissions([]);
//   }, [selectedRoleId]);

//   const mapPermissionsToTree = useCallback((tree: ModuleNode[], permissions: PermissionPayload): ModuleNode[] => {
//     return applyPermissionsToTree(tree, permissions);
//   }, []);

//   useEffect(() => {
//     if (!selectedRoleId) return;
//     if (String(hasLoadedPermissionsForRole) === String(selectedRoleId)) return;

//     const loadPermissions = async () => {
//       try {
//         const permissions = await dispatch(loadRolePermissions(String(selectedRoleId))).unwrap();
//         const permissionTree = permissions.tree && permissions.tree.length > 0 ? permissions.tree : baseTree;
//         setTreeData(mapPermissionsToTree(permissionTree, permissions));
//         setHasLoadedPermissionsForRole(String(selectedRoleId));
//       } catch {
//         notify.error("Unable to load permissions for selected role.");
//       }
//     };

//     loadPermissions();
//   }, [selectedRoleId, baseTree, dispatch, mapPermissionsToTree, hasLoadedPermissionsForRole]);

//   const toggleNode = (type: NodeType, ids: ToggleIds) => {
//     const currentChecked = findNodeChecked(treeData, type, ids);
//     if (currentChecked === null) return;

//     const newChecked = !currentChecked;
//     const targetId = ids.apiId ?? ids.featureId ?? ids.submoduleId ?? ids.moduleId;

//     setPendingPermissions((prev) => {
//       const filtered = prev.filter((permission) => !(permission.type === type && String(permission.id) === String(targetId)));
//       return [...filtered, { type, id: targetId, isAllowed: newChecked }];
//     });

//     setTreeData((currentTree) => toggleNodeInTree(currentTree, type, ids, newChecked));
//   };

//   const toggleExpandModule = (moduleId: string | number) => {
//     setTreeData((current) => toggleExpandModuleNode(current, moduleId));
//   };

//   const toggleExpandSubmodule = (moduleId: string | number, submoduleId: string | number) => {
//     setTreeData((current) => toggleExpandSubmoduleNode(current, moduleId, submoduleId));
//   };

//   const toggleExpandFeature = (
//     moduleId: string | number,
//     submoduleId: string | number | undefined,
//     featureId: string | number,
//   ) => {
//     setTreeData((current) => toggleExpandFeatureNode(current, moduleId, submoduleId, featureId));
//   };

//   const clearSelection = () => {
//     setTreeData((current) => clearTreeSelection(current));
//   };

//   const allowAll = () => {
//     setTreeData((current) => allowAllTree(current));
//   };

//   const denyAll = () => {
//     clearSelection();
//   };

//   const permissions = useMemo<PermissionSummary>(() => buildPermissionSummary(treeData), [treeData]);

//   const filteredTree = useMemo(() => filterTree(treeData, searchQuery), [treeData, searchQuery]);

//   const handleSelectRole = (roleId: string | number) => {
//     const normalizedRoleId = String(roleId);
//     setSelectedRoleId(normalizedRoleId);
//     setHasLoadedPermissionsForRole(null);
//   };

//   const handleSave = async () => {
//     if (!selectedRoleId) {
//       notify.error("Select a role before saving permissions.");
//       return;
//     }

//     try {
//       const payload = collectPermissions(pendingPermissions);
//       const hasPayloadData = Array.isArray(payload)
//         ? payload.length > 0
//         : Boolean(
//           payload.moduleIds?.length ||
//           payload.subModuleIds?.length ||
//           payload.featureIds?.length ||
//           payload.apiIds?.length,
//         );

//       if (!hasPayloadData) {
//         notify.custom("No permission changes to save.");
//         return;
//       }

//       await dispatch(assignRolePermissions({ roleId: String(selectedRoleId), permissions: payload })).unwrap();

//       setPendingPermissions([]);
//       notify.success("Permissions updated successfully.");
//     } catch {
//       notify.error("Unable to save permissions.");
//     }
//   };

//   return (
//     <div className="min-h-screen text-slate-900">
//       <div className="mx-auto space-y-6">
//         <RoleAccessHeader
//           roles={roles}
//           selectedRoleId={selectedRoleId}
//           permissions={permissions}

//         />

//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="flex min-w-[280px] max-w-[550px] w-full items-center">
//             <label
//               htmlFor="permission-search"
//               className="sr-only"
//             >
//               Search permissions
//             </label>

//             <div className="relative w-full">

//               <Search
//                 size={18}
//                 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 id="permission-search"
//                 type="search"
//                 value={searchQuery}
//                 onChange={(event) =>
//                   setSearchQuery(event.target.value)
//                 }
//                 placeholder="Search modules, submodules, features, APIs..."
//                 className="w-full rounded-2xl border border-black bg-white py-2 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400"
//               />

//             </div>
//           </div>


//           <div className="flex flex-wrap items-center gap-3">
//             <div className="min-w-[180px] ">
//               <RoleSelector roles={roles} selectedRoleId={selectedRoleId} onSelectRole={handleSelectRole} />
//             </div>
//             <button
//               type="button"
//               onClick={allowAll}
//               className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
//             >
//               Allow all
//             </button>
//             <button
//               type="button"
//               onClick={denyAll}
//               className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
//             >
//               Deny all
//             </button>
//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving}
//               className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {isSaving ? 'Saving...' : 'Save Permissions'}
//             </button>
//           </div>
//         </div>

//         <PermissionTree
//           tree={filteredTree}
//           isLoading={isLoading}
//           onToggleNode={toggleNode}
//           onToggleExpandModule={toggleExpandModule}
//           onToggleExpandSubmodule={toggleExpandSubmodule}
//           onToggleExpandFeature={toggleExpandFeature}
//         />
//       </div>
//     </div>
//   );
// }
