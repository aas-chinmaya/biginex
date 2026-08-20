import Api from '@/services/api';
import {
  getApis,
  getFeatures,
  getModules,
  getRoles,
  getSubmodules,
} from '@/modules/masters/api/master.api';
import { ROLE_ACCESS_ENDPOINTS } from '@/modules/roleAccess/endPoint/roleAccess.endpoint';
import type { ModuleNode, PermissionPayload, PermissionRequestPayload, PermissionTreeModule } from '@/modules/roleAccess/types';
import type { Role } from '@/modules/masters/types';

const buildAllowedTree = (modules: PermissionTreeModule[]): ModuleNode[] => {
  return (modules ?? []).map((module: any) => ({
    ...module,
    checked: Boolean(module?.isAllowed),
    indeterminate: false,
    expanded: false,
    explicitlySelected: Boolean(module?.isAllowed),
    selectedByAncestor: false,
    features: (Array.isArray(module?.features) ? module.features : []).map((feature: any) => ({
      ...feature,
      checked: Boolean(feature?.isAllowed),
      indeterminate: false,
      expanded: false,
      explicitlySelected: Boolean(feature?.isAllowed),
      selectedByAncestor: false,
      apis: (Array.isArray(feature?.apis) ? feature.apis : []).map((api: any) => ({
        ...api,
        checked: Boolean(api?.isAllowed),
      })),
    })),
    apis: (Array.isArray(module?.apis) ? module.apis : []).map((api: any) => ({
      ...api,
      checked: Boolean(api?.isAllowed),
    })),
    submodules: (Array.isArray(module?.subModules) ? module.subModules : []).map((submodule: any) => ({
      ...submodule,
      checked: Boolean(submodule?.isAllowed),
      indeterminate: false,
      expanded: false,
      explicitlySelected: Boolean(submodule?.isAllowed),
      selectedByAncestor: false,
      features: (Array.isArray(submodule?.features) ? submodule.features : []).map((feature: any) => ({
        ...feature,
        checked: Boolean(feature?.isAllowed),
        indeterminate: false,
        expanded: false,
        explicitlySelected: Boolean(feature?.isAllowed),
        selectedByAncestor: false,
        apis: (Array.isArray(feature?.apis) ? feature.apis : []).map((api: any) => ({
          ...api,
          checked: Boolean(api?.isAllowed),
        })),
      })),
      apis: (Array.isArray(submodule?.apis) ? submodule.apis : []).map((api: any) => ({
        ...api,
        checked: Boolean(api?.isAllowed),
      })),
    })),
  })) as ModuleNode[];
};

const normalizePermissionResponse = (response: any): PermissionPayload => {
  const payload = response?.data ?? response;

  if (
    payload?.moduleIds !== undefined &&
    payload?.subModuleIds !== undefined &&
    payload?.featureIds !== undefined &&
    payload?.apiIds !== undefined
  ) {
    return {
      ...(payload as PermissionPayload),
      moduleNames: payload?.moduleNames ?? [],
      subModuleNames: payload?.subModuleNames ?? [],
      featureNames: payload?.featureNames ?? [],
      apiNames: payload?.apiNames ?? [],
      isAllowed: payload?.isAllowed ?? true,
    };
  }

  const modules: PermissionTreeModule[] = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  const tree = buildAllowedTree(modules);

  const moduleIds: Array<string | number> = [];
  const subModuleIds: Array<string | number> = [];
  const featureIds: Array<string | number> = [];
  const apiIds: Array<string | number> = [];
  const moduleNames: string[] = [];
  const subModuleNames: string[] = [];
  const featureNames: string[] = [];
  const apiNames: string[] = [];

  tree.forEach((module) => {
    if (module.name) moduleNames.push(module.name);
    if (module.checked && module.id != null) {
      moduleIds.push(module.id);
    }

    module.submodules.forEach((submodule) => {
      if (submodule.name) subModuleNames.push(submodule.name);
      if (submodule.checked && submodule.id != null) {
        subModuleIds.push(submodule.id);
      }

      submodule.features.forEach((feature) => {
        if (feature.name) featureNames.push(feature.name);
        if (feature.checked && feature.id != null) {
          featureIds.push(feature.id);
        }

        feature.apis.forEach((api) => {
          if (api.name) apiNames.push(api.name);
          if (api.checked && api.id != null) {
            apiIds.push(api.id);
          }
        });
      });

      submodule.apis.forEach((api) => {
        if (api.name) apiNames.push(api.name);
        if (api.checked && api.id != null) {
          apiIds.push(api.id);
        }
      });
    });

    module.features.forEach((feature) => {
      if (feature.name) featureNames.push(feature.name);
      if (feature.checked && feature.id != null) {
        featureIds.push(feature.id);
      }

      feature.apis.forEach((api) => {
        if (api.name) apiNames.push(api.name);
        if (api.checked && api.id != null) {
          apiIds.push(api.id);
        }
      });
    });

    module.apis.forEach((api) => {
      if (api.name) apiNames.push(api.name);
      if (api.checked && api.id != null) {
        apiIds.push(api.id);
      }
    });
  });

  return {
    moduleIds,
    subModuleIds,
    featureIds,
    apiIds,
    moduleNames,
    subModuleNames,
    featureNames,
    apiNames,
    isAllowed: payload?.isAllowed ?? true,
    tree,
  };
};

const buildPermissionTree = async (): Promise<ModuleNode[]> => {
  const [modules, submodules, features, apis] = await Promise.all([
    getModules(),
    getSubmodules(),
    getFeatures(),
    getApis(),
  ]);

  const moduleMap = new Map<string, any>();
  const submoduleMap = new Map<string, any>();
  const featureMap = new Map<string, any>();

  const addModule = (moduleLike: any) => {
    if (!moduleLike?.id) return;

    const moduleId = String(moduleLike.id);
    if (!moduleMap.has(moduleId)) {
      moduleMap.set(moduleId, {
        id: moduleId,
        name: moduleLike.name ?? `Module ${moduleId}`,
        route: moduleLike.route ?? '',
        description: moduleLike.description ?? '',
        priority: Number(moduleLike.priority ?? 0),
        checked: false,
        indeterminate: false,
        expanded: false,
        explicitlySelected: false,
        selectedByAncestor: false,
        features: [],
        apis: [],
        submodules: [],
      });
      return;
    }

    const existing = moduleMap.get(moduleId);
    if (!existing.name && moduleLike.name) existing.name = moduleLike.name;
    if (!existing.route && moduleLike.route) existing.route = moduleLike.route;
    if (!existing.description && moduleLike.description) existing.description = moduleLike.description;
    if (!existing.priority && moduleLike.priority != null) existing.priority = Number(moduleLike.priority);
  };

  const addSubmodule = (submoduleLike: any) => {
    if (!submoduleLike?.id) return;

    const submoduleId = String(submoduleLike.id);
    if (!submoduleMap.has(submoduleId)) {
      submoduleMap.set(submoduleId, {
        id: submoduleId,
        name: submoduleLike.name ?? `Submodule ${submoduleId}`,
        route: submoduleLike.route ?? '',
        description: submoduleLike.description ?? '',
        priority: Number(submoduleLike.priority ?? 0),
        moduleId: submoduleLike.moduleId ?? '',
        checked: false,
        indeterminate: false,
        expanded: false,
        features: [],
        apis: [],
      });
      return;
    }

    const existing = submoduleMap.get(submoduleId);
    if (!existing.name && submoduleLike.name) existing.name = submoduleLike.name;
    if (!existing.route && submoduleLike.route) existing.route = submoduleLike.route;
    if (!existing.description && submoduleLike.description) existing.description = submoduleLike.description;
    if (!existing.priority && submoduleLike.priority != null) existing.priority = Number(submoduleLike.priority);
    if (!existing.moduleId && submoduleLike.moduleId) existing.moduleId = submoduleLike.moduleId;
  };

  const addFeature = (featureLike: any) => {
    if (!featureLike?.id) return;

    const featureId = String(featureLike.id);
    if (!featureMap.has(featureId)) {
      featureMap.set(featureId, {
        id: featureId,
        name: featureLike.name ?? `Feature ${featureId}`,
        route: featureLike.route ?? '',
        description: featureLike.description ?? '',
        priority: Number(featureLike.priority ?? 0),
        moduleId: featureLike.moduleId ?? '',
        subModuleId: featureLike.subModuleId ?? '',
        checked: false,
        indeterminate: false,
        expanded: false,
        explicitlySelected: false,
        selectedByAncestor: false,
        apis: [],
      });
      return;
    }

    const existing = featureMap.get(featureId);
    if (!existing.name && featureLike.name) existing.name = featureLike.name;
    if (!existing.route && featureLike.route) existing.route = featureLike.route;
    if (!existing.description && featureLike.description) existing.description = featureLike.description;
    if (!existing.priority && featureLike.priority != null) existing.priority = Number(featureLike.priority);
    if (!existing.moduleId && featureLike.moduleId) existing.moduleId = featureLike.moduleId;
    if (!existing.subModuleId && featureLike.subModuleId) existing.subModuleId = featureLike.subModuleId;
  };

  modules.forEach(addModule);
  submodules.forEach(addSubmodule);
  features.forEach(addFeature);

  apis.forEach((api: any) => {
    const moduleId = api.moduleId ?? api.module?.id ?? api.feature?.module?.id ?? api.feature?.moduleId;
    if (moduleId != null && moduleId !== '') {
      addModule({
        id: moduleId,
        name: api.module?.name ?? api.feature?.module?.name ?? '',
        route: api.module?.route ?? api.feature?.module?.route ?? '',
        description: api.module?.description ?? api.feature?.module?.description ?? '',
        priority: api.module?.priority ?? api.feature?.module?.priority ?? 0,
      });
    }

    const subModuleId = api.subModuleId ?? api.subModule?.id ?? api.feature?.subModule?.id ?? null;
    if (subModuleId != null && subModuleId !== '') {
      addSubmodule({
        id: subModuleId,
        moduleId,
        name: api.subModule?.name ?? api.feature?.subModule?.name ?? '',
        route: api.subModule?.route ?? api.feature?.subModule?.route ?? '',
        description: api.subModule?.description ?? api.feature?.subModule?.description ?? '',
        priority: api.subModule?.priority ?? api.feature?.subModule?.priority ?? 0,
      });
    }

    const featureId = api.featureId ?? api.feature?.id ?? null;
    if (featureId != null && featureId !== '') {
      addFeature({
        id: featureId,
        moduleId,
        subModuleId,
        name: api.feature?.name ?? '',
        route: api.feature?.route ?? '',
        description: api.feature?.description ?? '',
        priority: api.feature?.priority ?? 0,
      });
    }
  });

  return Array.from(moduleMap.values()).map((module: any) => {
    const moduleFeatures = Array.from(featureMap.values())
      .filter(
        (feature: any) =>
          String(feature.moduleId) === String(module.id) &&
          (!feature.subModuleId || String(feature.subModuleId) === '')
      )
      .map((feature: any) => ({
        ...feature,
        checked: false,
        indeterminate: false,
        expanded: false,
        explicitlySelected: false,
        selectedByAncestor: false,
        apis: apis
          .filter((api: any) => {
            const featureId = api.featureId ?? api.feature?.id;
            return String(featureId) === String(feature.id);
          })
          .map((api: any) => ({
            ...api,
            checked: false,
          })),
      }));

    const moduleApis = apis
      .filter((api: any) => {
        const normalizedModuleId = api.moduleId ?? api.module?.id ?? api.feature?.module?.id ?? api.feature?.moduleId;
        const normalizedFeatureId = api.featureId ?? api.feature?.id;
        const normalizedSubModuleId = api.subModuleId ?? api.subModule?.id ?? api.feature?.subModule?.id;
        return (
          String(normalizedModuleId) === String(module.id) &&
          (!normalizedSubModuleId || String(normalizedSubModuleId) === '') &&
          (!normalizedFeatureId || String(normalizedFeatureId) === '')
        );
      })
      .map((api: any) => ({
        ...api,
        checked: false,
      }));

    const submoduleNodes = Array.from(submoduleMap.values())
      .filter((submodule: any) => String(submodule.moduleId) === String(module.id))
      .map((submodule: any) => ({
        ...submodule,
        checked: false,
        indeterminate: false,
        expanded: false,
        features: Array.from(featureMap.values())
          .filter((feature: any) => String(feature.subModuleId) === String(submodule.id))
          .map((feature: any) => ({
            ...feature,
            checked: false,
            indeterminate: false,
            expanded: false,
            explicitlySelected: false,
            selectedByAncestor: false,
            apis: apis
              .filter((api: any) => {
                const featureId = api.featureId ?? api.feature?.id;
                return String(featureId) === String(feature.id);
              })
              .map((api: any) => ({
                ...api,
                checked: false,
              })),
          })),
        apis: apis
          .filter((api: any) => {
            const normalizedSubModuleId = api.subModuleId ?? api.subModule?.id ?? api.feature?.subModule?.id;
            const normalizedFeatureId = api.featureId ?? api.feature?.id;
            return (
              String(normalizedSubModuleId) === String(submodule.id) &&
              (!normalizedFeatureId || String(normalizedFeatureId) === '')
            );
          })
          .map((api: any) => ({
            ...api,
            checked: false,
          })),
      }));

    return {
      ...module,
      checked: false,
      indeterminate: false,
      expanded: false,
      explicitlySelected: false,
      selectedByAncestor: false,
      features: moduleFeatures,
      apis: moduleApis,
      submodules: submoduleNodes,
    };
  });
};

export const fetchAccessTree = async (): Promise<ModuleNode[]> => {
  return buildPermissionTree();
};

export const fetchRolePermissions = async (roleId: string | number): Promise<PermissionPayload> => {
  const response = await Api.get(
    `${ROLE_ACCESS_ENDPOINTS.GET_PERMISSIONS}/${roleId}`
  );
  return normalizePermissionResponse(response.data);
};

export const assignPermissions = async (
  roleId: string | number,
  permissions: PermissionRequestPayload
): Promise<void> => {
  await Api.post(`${ROLE_ACCESS_ENDPOINTS.ASSIGN_PERMISSIONS}/${roleId}`, permissions, {
    withCredentials: true,
  });
};

export const editPermissions = async (
  roleId: string | number,
  permissions: PermissionRequestPayload
): Promise<void> => {
  await Api.put(`${ROLE_ACCESS_ENDPOINTS.EDIT_PERMISSIONS}/${roleId}`, permissions, {
    withCredentials: true,
  });
};

export const revokePermission = async (roleId: string | number, apiId: string | number): Promise<void> => {
  await Api.delete(
    `${ROLE_ACCESS_ENDPOINTS.REVOKE_PERMISSION}/${roleId}/${apiId}`,
    {
      withCredentials: true,
    }
  );
};

export const fetchRolesList = async (): Promise<Role[]> => {
  return getRoles();
};