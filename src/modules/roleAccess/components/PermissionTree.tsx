import {
  ChevronDown,
  ChevronRight,
  SquareCheck,
  Square,
  SquareMinus,
} from "lucide-react";
import type { PermissionTreeProps } from '@/modules/roleAccess/types';

export default function PermissionTree({
  tree,
  isLoading,
  onToggleNode,
  onToggleExpandModule,
  onToggleExpandSubmodule,
  onToggleExpandFeature,
}: PermissionTreeProps) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div>
          <h2 className="text-xl font-semibold">Permission tree</h2>
          <p className="text-sm text-slate-500">
            Select modules, submodules, features, or individual APIs. Parent groups auto-select when a child is selected.
          </p>
        </div>
        <div className="rounded-full bg-slate-950 px-4 py-2 text-sm text-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
              <SquareCheck />
            </span>
            <span>Allowed</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white">
              <SquareMinus />
            </span>
            <span>Partial</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-white">
              <Square />
            </span>
            <span>Denied</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center text-blue-500">
            Loading access tree...
          </div>
        ) : tree.length === 0 ? (
          <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center text-blue-500">
            No results match your search.
          </div>
        ) : (
          tree.map((module) => (
            <div key={module.id} className="rounded-3xl border border-blue-50 bg-white p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggleExpandModule(module.id!)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500"
                >
                  {module.expanded ? <ChevronDown /> : <ChevronRight />}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleNode('module', { moduleId: module.id! })}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-slate-800"
                >
                  {module.checked ? (
                    <SquareCheck className="text-emerald-400" />
                  ) : module.indeterminate ? (
                    <SquareMinus className="text-amber-400" />
                  ) : (
                    <Square className="text-slate-500" />
                  )}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="font-semibold text-slate-900 truncate">{module.name}</span>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Module</span>
                  </div>
                  <span className="text-xs text-slate-500">{module.route}</span>
                </button>
              </div>

                  {module.expanded && (
                    <div className="mt-3 space-y-3 pl-12">
                      <div className="space-y-3">
                        {module.features.length > 0 &&
                          module.features.map((feature) => (
                            <div key={`${module.id}-${feature.id}`} className="space-y-3">
                              <div className="rounded-3xl border border-blue-50 bg-white p-3">
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => onToggleExpandFeature(module.id!, undefined, feature.id!)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-slate-500"
                                  >
                                    {feature.expanded ? <ChevronDown /> : <ChevronRight />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onToggleNode('feature', { moduleId: module.id!, featureId: feature.id! })}
                                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-slate-800"
                                  >
                                    {feature.checked ? (
                                      <SquareCheck className="text-emerald-400" />
                                    ) : feature.indeterminate ? (
                                      <SquareMinus className="text-amber-400" />
                                    ) : (
                                      <Square className="text-slate-500" />
                                    )}
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                      <span className="font-semibold text-slate-900 truncate">{feature.name}</span>
                                      <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Feature</span>
                                    </div>
                                    <span className="text-xs text-slate-500">{feature.route}</span>
                                  </button>
                                </div>
                              </div>

                              {feature.expanded && feature.apis.length > 0 && (
                                <div className="pl-10">
                                  <div className="rounded-2xl border border-blue-50 bg-blue-50 p-3">
                                    <div className="mb-3 flex items-center justify-between">
                                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">APIs</p>
                                    </div>
                                    <div className="space-y-2">
                                      {feature.apis.map((api) => (
                                        <button
                                          key={`${module.id}-${feature.id}-${api.id}`}
                                          type="button"
                                          onClick={() => onToggleNode('api', { moduleId: module.id!, featureId: feature.id!, apiId: api.id! })}
                                          className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left text-blue-700 transition hover:bg-blue-50"
                                        >
                                          {api.checked ? (
                                            <SquareCheck className="text-emerald-500" />
                                          ) : (
                                            <Square className="text-blue-300" />
                                          )}
                                          <div className="flex min-w-0 flex-1 items-center gap-3">
                                            <span className="font-semibold text-blue-700 truncate">{api.name}</span>
                                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">API</span>
                                          </div>
                                          <span className="text-xs text-slate-500">{api.route}</span>
                                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">{api.method.toUpperCase()}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                        {module.apis.length > 0 && (
                          <div className="rounded-3xl border border-blue-50 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Module APIs</p>
                            </div>
                            <div className="space-y-2">
                              {module.apis.map((api) => (
                                <button
                                  key={`${module.id}-api-${api.id}`}
                                  type="button"
                                  onClick={() => onToggleNode('api', { moduleId: module.id!, apiId: api.id! })}
                                  className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left text-blue-700 transition hover:bg-blue-50"
                                >
                                  {api.checked ? <SquareCheck className="text-emerald-500" /> : <Square className="text-blue-300" />}
                                  <span>{api.name}</span>
                                  <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">{api.method.toUpperCase()}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {module.submodules.length > 0 &&
                        module.submodules.map((submodule) => (
                          <div key={`${module.id}-${submodule.id}`} className="rounded-3xl border border-blue-50 bg-white p-3">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => onToggleExpandSubmodule(module.id!, submodule.id!)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-slate-500"
                              >
                                {submodule.expanded ? <ChevronDown /> : <ChevronRight />}
                              </button>
                              <button
                                type="button"
                                onClick={() => onToggleNode('submodule', { moduleId: module.id!, submoduleId: submodule.id! })}
                                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-slate-800"
                              >
                                {submodule.checked ? (
                                  <SquareCheck className="text-emerald-400" />
                                ) : submodule.indeterminate ? (
                                  <SquareMinus className="text-amber-400" />
                                ) : (
                                  <Square className="text-slate-500" />
                                )}
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                  <span className="font-semibold text-slate-900 truncate">{submodule.name}</span>
                                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Submodule</span>
                                </div>
                                <span className="text-xs text-slate-500">{submodule.route}</span>
                              </button>
                            </div>

                            {submodule.expanded && (
                              <div className="mt-3 space-y-3 pl-10">
                                {submodule.features.length > 0 &&
                                  submodule.features.map((feature) => (
                                    <div key={`${module.id}-${submodule.id}-${feature.id}`} className="space-y-3">
                                      <div className="rounded-3xl border border-blue-50 bg-white p-3">
                                        <div className="flex items-center gap-3">
                                          <button
                                            type="button"
                                            onClick={() => onToggleExpandFeature(module.id!, submodule.id!, feature.id!)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-slate-500"
                                          >
                                            {feature.expanded ? <ChevronDown /> : <ChevronRight />}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => onToggleNode('feature', { moduleId: module.id!, submoduleId: submodule.id!, featureId: feature.id! })}
                                            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-left text-slate-800"
                                          >
                                            {feature.checked ? (
                                              <SquareCheck className="text-emerald-400" />
                                            ) : feature.indeterminate ? (
                                              <SquareMinus className="text-amber-400" />
                                            ) : (
                                              <Square className="text-slate-500" />
                                            )}
                                            <span>{feature.name}</span>
                                          </button>
                                        </div>
                                      </div>

                                      {feature.expanded && feature.apis.length > 0 && (
                                        <div className="pl-10">
                                          <div className="rounded-2xl border border-blue-50 bg-blue-50 p-3">
                                            <div className="mb-3 flex items-center justify-between">
                                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">APIs</p>
                                            </div>
                                            <div className="space-y-2">
                                              {feature.apis.map((api) => (
                                                <button
                                                  key={`${module.id}-${submodule.id}-${feature.id}-${api.id}`}
                                                  type="button"
                                                  onClick={() => onToggleNode('api', { moduleId: module.id!, submoduleId: submodule.id!, featureId: feature.id!, apiId: api.id! })}
                                                  className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-2 text-left text-blue-700 transition hover:bg-blue-50"
                                                >
                                                  {api.checked ? (
                                                    <SquareCheck className="text-emerald-500" />
                                                  ) : (
                                                    <Square className="text-blue-300" />
                                                  )}
                                                  <span>{api.name}</span>
                                                  <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">{api.method.toUpperCase()}</span>
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}

                                {submodule.apis.length > 0 && (
                                  <div className="rounded-3xl border border-blue-50 bg-white p-3">
                                    <div className="mb-3 flex items-center justify-between">
                                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Submodule APIs</p>
                                    </div>
                                    <div className="space-y-2">
                                      {submodule.apis.map((api) => (
                                        <button
                                          key={`${module.id}-${submodule.id}-api-${api.id}`}
                                          type="button"
                                          onClick={() => onToggleNode('api', { moduleId: module.id!, submoduleId: submodule.id!, apiId: api.id! })}
                                          className="flex w-full items-start gap-3 rounded-2xl bg-white px-3 py-2 text-left text-blue-700 transition hover:bg-blue-50"
                                        >
                                          {api.checked ? <SquareCheck className="text-emerald-500 mt-1" /> : <Square className="text-blue-300 mt-1" />}
                                          <div className="flex-1">
                                            <span className="font-semibold block">{api.name}</span>
                                            <span className="text-xs text-slate-500">{api.route}</span>
                                          </div>
                                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">{api.method.toUpperCase()}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
          ))
        )}
      </div>
    </div>
  );
}
