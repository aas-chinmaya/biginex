import type {
  FeatureNode,
  ModuleNode,
  NodeType,
  PermissionPayload,
  PermissionSummary,
  PendingPermission,
  SubmoduleNode,
  ToggleIds,
} from '@/modules/roleAccess/types';

const cascadeFeature = (feature: FeatureNode, checked: boolean, inherited = false): FeatureNode => ({
  ...feature,
  checked,
  indeterminate: false,
  expanded: true,
  explicitlySelected: inherited ? false : checked,
  selectedByAncestor: inherited ? checked : false,
  apis: feature.apis.map((api) => ({ ...api, checked })),
});

const cascadeSubmodule = (submodule: SubmoduleNode, checked: boolean, inherited = false): SubmoduleNode => ({
  ...submodule,
  checked,
  indeterminate: false,
  expanded: true,
  explicitlySelected: inherited ? false : checked,
  selectedByAncestor: inherited ? checked : false,
  features: submodule.features.map((feature) => cascadeFeature(feature, checked, true)),
  apis: submodule.apis.map((api) => ({ ...api, checked })),
});

const cascadeModule = (module: ModuleNode, checked: boolean): ModuleNode => ({
  ...module,
  checked,
  indeterminate: false,
  expanded: true,
  explicitlySelected: checked,
  selectedByAncestor: false,
  submodules: module.submodules.map((submodule) => cascadeSubmodule(submodule, checked, true)),
  features: module.features.map((feature) => cascadeFeature(feature, checked, true)),
  apis: module.apis.map((api) => ({ ...api, checked })),
});

export const findNodeChecked = (tree: ModuleNode[], type: NodeType, ids: ToggleIds): boolean | null => {
  const moduleNode = tree.find((item) => String(item.id) === String(ids.moduleId));
  if (!moduleNode) return null;
  if (type === 'module') return moduleNode.checked;
  if (type === 'submodule') {
    const submodule = moduleNode.submodules.find((item) => String(item.id) === String(ids.submoduleId));
    return submodule?.checked ?? null;
  }
  if (ids.submoduleId) {
    const submodule = moduleNode.submodules.find((item) => String(item.id) === String(ids.submoduleId));
    if (!submodule) return null;
    if (type === 'api') {
      const feature = submodule.features.find((item) => String(item.id) === String(ids.featureId));
      if (feature) {
        const api = feature.apis.find((item) => String(item.id) === String(ids.apiId));
        if (api) return api.checked;
      }
      const api = submodule.apis.find((item) => String(item.id) === String(ids.apiId));
      return api?.checked ?? null;
    }
    const feature = submodule.features.find((item) => String(item.id) === String(ids.featureId));
    return feature?.checked ?? null;
  }
  if (type === 'api') {
    const feature = moduleNode.features.find((item) => String(item.id) === String(ids.featureId));
    if (feature) {
      const api = feature.apis.find((item) => String(item.id) === String(ids.apiId));
      if (api) return api.checked;
    }
    const api = moduleNode.apis.find((item) => String(item.id) === String(ids.apiId));
    return api?.checked ?? null;
  }
  const feature = moduleNode.features.find((item) => String(item.id) === String(ids.featureId));
  return feature?.checked ?? null;
};

export const recalculateTree = (tree: ModuleNode[]): ModuleNode[] =>
  tree.map((module) => {
    const moduleFeatures = module.features.map((feature) => {
      const checkedApis = feature.apis.filter((api) => api.checked).length;
      const featureChecked = Boolean(feature.explicitlySelected || feature.selectedByAncestor);
      const featureIndeterminate = !featureChecked && checkedApis > 0;
      return { ...feature, checked: featureChecked, indeterminate: featureIndeterminate };
    });

    const hasAnyModuleFeatureSelected = moduleFeatures.some((feature) => feature.checked || feature.indeterminate);
    const hasAnyModuleApiSelected = module.apis.some((api) => api.checked);
    const submodules = module.submodules.map((submodule) => {
      const features = submodule.features.map((feature) => {
        const checkedApis = feature.apis.filter((api) => api.checked).length;
        const featureChecked = Boolean(feature.explicitlySelected || feature.selectedByAncestor);
        const featureIndeterminate = !featureChecked && checkedApis > 0;
        return { ...feature, checked: featureChecked, indeterminate: featureIndeterminate };
      });
      const hasAnyFeatureSelected = features.some((feature) => feature.checked || feature.indeterminate);
      const hasAnySubmoduleApiSelected = submodule.apis.some((api) => api.checked);
      const submoduleChecked = Boolean(submodule.explicitlySelected || submodule.selectedByAncestor);
      const submoduleIndeterminate = !submoduleChecked && (hasAnyFeatureSelected || hasAnySubmoduleApiSelected);
      return { ...submodule, features, checked: submoduleChecked, indeterminate: submoduleIndeterminate };
    });
    const hasAnySubmoduleSelected = submodules.some((submodule) => submodule.checked || submodule.indeterminate);
    const moduleChecked = Boolean(module.explicitlySelected || module.selectedByAncestor);
    const moduleIndeterminate = !moduleChecked && (hasAnySubmoduleSelected || hasAnyModuleFeatureSelected || hasAnyModuleApiSelected);
    return { ...module, features: moduleFeatures, submodules, checked: moduleChecked, indeterminate: moduleIndeterminate };
  });

export const applyPermissionsToTree = (tree: ModuleNode[], permissions: PermissionPayload): ModuleNode[] => {
  const ids = {
    api: new Set(permissions.apiIds.map(String)),
    feature: new Set(permissions.featureIds.map(String)),
    subModule: new Set(permissions.subModuleIds.map(String)),
    module: new Set(permissions.moduleIds.map(String)),
  };

  const updatedTree = tree.map((module) => {
    const moduleChecked = ids.module.has(String(module.id));
    return {
      ...module,
      checked: moduleChecked,
      explicitlySelected: moduleChecked,
      selectedByAncestor: false,
      indeterminate: false,
      expanded: false,
      features: module.features.map((feature) => {
        const featureChecked = ids.feature.has(String(feature.id));
        return {
          ...feature,
          checked: featureChecked,
          explicitlySelected: featureChecked,
          selectedByAncestor: moduleChecked,
          indeterminate: false,
          expanded: false,
          apis: feature.apis.map((api) => ({ ...api, checked: ids.api.has(String(api.id)) || featureChecked || moduleChecked })),
        };
      }),
      apis: module.apis.map((api) => ({ ...api, checked: ids.api.has(String(api.id)) || moduleChecked })),
      submodules: module.submodules.map((submodule) => {
        const submoduleChecked = ids.subModule.has(String(submodule.id));
        return {
          ...submodule,
          checked: submoduleChecked,
          explicitlySelected: submoduleChecked,
          selectedByAncestor: moduleChecked,
          indeterminate: false,
          expanded: false,
          features: submodule.features.map((feature) => {
            const featureChecked = ids.feature.has(String(feature.id));
            return {
              ...feature,
              checked: featureChecked,
              explicitlySelected: featureChecked,
              selectedByAncestor: submoduleChecked || moduleChecked,
              indeterminate: false,
              expanded: false,
              apis: feature.apis.map((api) => ({ ...api, checked: ids.api.has(String(api.id)) || featureChecked || submoduleChecked || moduleChecked })),
            };
          }),
          apis: submodule.apis.map((api) => ({ ...api, checked: ids.api.has(String(api.id)) || submoduleChecked || moduleChecked })),
        };
      }),
    };
  });

  return recalculateTree(updatedTree);
};

export const toggleNodeInTree = (tree: ModuleNode[], type: NodeType, ids: ToggleIds, newChecked: boolean): ModuleNode[] => {
  const nextTree = tree.map((module) => {
    if (String(module.id) !== String(ids.moduleId)) return module;
    if (type === 'module') return cascadeModule(module, newChecked);

    const updatedFeatures = module.features.map((feature) => {
      if (String(feature.id) !== String(ids.featureId)) return feature;
      if (type === 'feature') return cascadeFeature(feature, newChecked);
      return { ...feature, explicitlySelected: false, selectedByAncestor: false, apis: feature.apis.map((api) => String(api.id) === String(ids.apiId) ? { ...api, checked: newChecked } : api) };
    });

    const updatedModuleApis = module.apis.map((api) => String(api.id) === String(ids.apiId) ? { ...api, checked: newChecked } : api);
    const updatedSubmodules = module.submodules.map((submodule) => {
      if (ids.submoduleId && String(submodule.id) !== String(ids.submoduleId)) return submodule;
      if (type === 'submodule') return cascadeSubmodule(submodule, newChecked);
      const updatedSubmoduleFeatures = submodule.features.map((feature) => {
        if (String(feature.id) !== String(ids.featureId)) return feature;
        if (type === 'feature') return cascadeFeature(feature, newChecked);
        return { ...feature, explicitlySelected: false, selectedByAncestor: false, apis: feature.apis.map((api) => String(api.id) === String(ids.apiId) ? { ...api, checked: newChecked } : api) };
      });
      const updatedSubmoduleApis = submodule.apis.map((api) => String(api.id) === String(ids.apiId) ? { ...api, checked: newChecked } : api);
      if (type === 'feature' || type === 'api') {
        return { ...submodule, features: updatedSubmoduleFeatures, apis: updatedSubmoduleApis, explicitlySelected: false, selectedByAncestor: false };
      }
      return { ...submodule, features: updatedSubmoduleFeatures };
    });

    if (type === 'feature' || type === 'api') {
      if (!ids.submoduleId) {
        return { ...module, features: updatedFeatures, apis: updatedModuleApis, explicitlySelected: false, selectedByAncestor: false, submodules: updatedSubmodules };
      }
      return { ...module, submodules: updatedSubmodules, explicitlySelected: false, selectedByAncestor: false };
    }
    return { ...module, submodules: updatedSubmodules };
  });

  const recalculated = recalculateTree(nextTree);
  if (!newChecked && type !== 'module') {
    return recalculated.map((module) => {
      if (String(module.id) !== String(ids.moduleId)) return module;
      const submodules = module.submodules.map((submodule) => {
        if (ids.submoduleId && String(submodule.id) !== String(ids.submoduleId)) return submodule;
        if (!ids.submoduleId) return submodule;
        const features = submodule.features.map((feature) => {
          if (!ids.featureId || String(feature.id) !== String(ids.featureId)) return feature;
          return type === 'api' ? { ...feature, checked: false, indeterminate: true } : feature;
        });
        return { ...submodule, features, checked: false, indeterminate: true };
      });
      const features = !ids.submoduleId ? module.features.map((feature) => {
        if (!ids.featureId || String(feature.id) !== String(ids.featureId)) return feature;
        return type === 'api' ? { ...feature, checked: false, indeterminate: true } : feature;
      }) : module.features;
      return { ...module, features, submodules, checked: false, indeterminate: true };
    });
  }

  return recalculated;
};

export const buildPermissionSummary = (tree: ModuleNode[]): PermissionSummary => {
  let total = 0;
  let allowed = 0;
  tree.forEach((module) => {
    module.submodules.forEach((submodule) => {
      submodule.features.forEach((feature) => {
        feature.apis.forEach((api) => {
          total += 1;
          if (api.checked) allowed += 1;
        });
      });
      submodule.apis.forEach((api) => {
        total += 1;
        if (api.checked) allowed += 1;
      });
    });
  });
  return { totalApis: total, allowedApis: allowed, deniedApis: total - allowed };
};

export const filterTree = (tree: ModuleNode[], query: string): ModuleNode[] => {
  if (!query.trim()) return tree;
  const normalized = query.toLowerCase();
  return tree
    .map((module) => {
      const submodules = module.submodules
        .map((submodule) => {
          const features = submodule.features
            .map((feature) => {
              const apis = feature.apis.filter((api) => api.name.toLowerCase().includes(normalized));
              const featureMatch = feature.name.toLowerCase().includes(normalized);
              return featureMatch || apis.length > 0 ? { ...feature, expanded: true, apis } : null;
            })
            .filter((item): item is FeatureNode => item !== null);
          const submoduleApis = submodule.apis.filter((api) => api.name.toLowerCase().includes(normalized));
          const submoduleMatch = submodule.name.toLowerCase().includes(normalized);
          return submoduleMatch || features.length > 0 || submoduleApis.length > 0 ? { ...submodule, expanded: true, features, apis: submoduleApis } : null;
        })
        .filter((item): item is SubmoduleNode => item !== null);
      const moduleMatch = module.name.toLowerCase().includes(normalized);
      return moduleMatch || submodules.length > 0 ? { ...module, expanded: true, submodules } : null;
    })
    .filter((item): item is ModuleNode => item !== null);
};

export const toggleExpandModule = (tree: ModuleNode[], moduleId: string | number): ModuleNode[] =>
  tree.map((module) => (module.id === moduleId ? { ...module, expanded: !module.expanded } : module));

export const toggleExpandSubmodule = (tree: ModuleNode[], moduleId: string | number, submoduleId: string | number): ModuleNode[] =>
  tree.map((module) => {
    if (module.id !== moduleId) return module;
    return {
      ...module,
      submodules: module.submodules.map((submodule) =>
        submodule.id === submoduleId ? { ...submodule, expanded: !submodule.expanded } : submodule,
      ),
    };
  });

export const toggleExpandFeature = (
  tree: ModuleNode[],
  moduleId: string | number,
  submoduleId: string | number | undefined,
  featureId: string | number,
): ModuleNode[] =>
  tree.map((module) => {
    if (module.id !== moduleId) return module;
    if (!submoduleId) {
      return {
        ...module,
        features: module.features.map((feature) => (feature.id === featureId ? { ...feature, expanded: !feature.expanded } : feature)),
      };
    }
    return {
      ...module,
      submodules: module.submodules.map((submodule) => {
        if (submodule.id !== submoduleId) return submodule;
        return { ...submodule, features: submodule.features.map((feature) => (feature.id === featureId ? { ...feature, expanded: !feature.expanded } : feature)) };
      }),
    };
  });

export const clearTreeSelection = (tree: ModuleNode[]): ModuleNode[] =>
  tree.map((module) => ({
    ...module,
    checked: false,
    indeterminate: false,
    expanded: false,
    submodules: module.submodules.map((submodule) => ({
      ...submodule,
      checked: false,
      indeterminate: false,
      expanded: false,
      features: submodule.features.map((feature) => ({ ...feature, checked: false, indeterminate: false, expanded: false, apis: feature.apis.map((api) => ({ ...api, checked: false })) })),
      apis: submodule.apis.map((api) => ({ ...api, checked: false })),
    })),
  }));

export const allowAllTree = (tree: ModuleNode[]): ModuleNode[] =>
  tree.map((module) => ({
    ...module,
    checked: true,
    indeterminate: false,
    expanded: true,
    submodules: module.submodules.map((submodule) => ({
      ...submodule,
      checked: true,
      indeterminate: false,
      expanded: true,
      features: submodule.features.map((feature) => ({ ...feature, checked: true, indeterminate: false, expanded: true, apis: feature.apis.map((api) => ({ ...api, checked: true })) })),
      apis: submodule.apis.map((api) => ({ ...api, checked: true })),
    })),
  }));

export const normalizeId = (value: string | number) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

export const createPermissionPayload = (type: NodeType, id: string | number, isAllowed: boolean): PermissionPayload => {
  const payload: PermissionPayload = { isAllowed } as PermissionPayload;
  const normalizedId = normalizeId(id);
  if (type === 'module') payload.moduleIds = [normalizedId];
  if (type === 'submodule') payload.subModuleIds = [normalizedId];
  if (type === 'feature') payload.featureIds = [normalizedId];
  if (type === 'api') payload.apiIds = [normalizedId];
  return payload;
};

export const collectPermissions = (pendingPermissions: PendingPermission[]) =>
  pendingPermissions.length === 1
    ? createPermissionPayload(pendingPermissions[0].type, pendingPermissions[0].id, pendingPermissions[0].isAllowed)
    : pendingPermissions.map((permission) => createPermissionPayload(permission.type, permission.id, permission.isAllowed));
