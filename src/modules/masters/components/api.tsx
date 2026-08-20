"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApis,
  createApi,
  updateApi,
  deleteApi,
  clearError,
  clearSuccess,
  fetchModules,
} from "@/modules/masters/store/masterSlice";
import { getFeatures, getSubmodules } from "@/modules/masters/api/master.api";
import type { AppDispatch, RootState } from "@/store/store";
import type { API, Feature, Submodule } from "@/modules/masters/types";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui";

export default function ApiMasterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { apis, isLoading, error, success } = useSelector((state: RootState) => state.masters);
  const { modules } = useSelector((state: RootState) => state.masters);

  // State management
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingApi, setEditingApi] = useState<API | null>(null);
  const [submodules, setSubmodules] = useState<Submodule[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loadingSubmodules, setLoadingSubmodules] = useState(false);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");

  const [formData, setFormData] = useState<API>({
    name: "",
    method: "GET",
    route: "",
    description: "",
    priority: 1,
    moduleId: "",
    subModuleId: "",
    featureId: "",
  });

  const getApiModuleId = (api: API) =>
    api.moduleId ?? api.module?.id ?? api.subModule?.module?.id ?? api.feature?.module?.id ?? "";

  const getApiSubmoduleId = (api: API) =>
    api.subModuleId ?? api.subModule?.id ?? api.feature?.subModule?.id ?? "";

  const getApiFeatureId = (api: API) => api.featureId ?? api.feature?.id ?? "";

  useEffect(() => {
    dispatch(fetchModules({ search: "" }));
    dispatch(fetchApis({ search }));
  }, [dispatch, search]);

  useEffect(() => {
    const loadRelatedData = async () => {
      if (!formData.moduleId) {
        setSubmodules([]);
        setFeatures([]);
        return;
      }

      setLoadingSubmodules(true);
      setLoadingFeatures(true);

      try {
        const [submoduleData, featureData] = await Promise.all([
          getSubmodules(String(formData.moduleId)),
          getFeatures(),
        ]);

        const filteredFeatures = featureData.filter((feature) => {
          const featureModuleId =
            feature.moduleId ?? feature.module?.id ?? feature.subModule?.module?.id ?? "";
          return String(featureModuleId) === String(formData.moduleId);
        });

        setSubmodules(submoduleData);
        setFeatures(filteredFeatures);
      } catch {
        setSubmodules([]);
        setFeatures([]);
      } finally {
        setLoadingSubmodules(false);
        setLoadingFeatures(false);
      }
    };

    loadRelatedData();
  }, [formData.moduleId]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      setShowModal(false);
      resetFormData();
      dispatch(fetchApis({ search }));
    }
  }, [success, dispatch, search]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddApi = () => {
    resetFormData();
    setShowModal(true);
  };

  const handleEditApi = (api: API) => {
    setEditingApi(api);
    setFormData({
      ...api,
      moduleId: getApiModuleId(api),
      subModuleId: getApiSubmoduleId(api),
      featureId: getApiFeatureId(api),
    });
    setShowModal(true);
  };

  const handleDeleteApi = async (id: string | number | undefined) => {
    if (!id) return;
    const apiItem = apis.find((item) => item.id === id);
    setPendingDeleteId(id);
    setPendingDeleteName(apiItem?.name ?? "this API");
    setConfirmOpen(true);
  };

  const confirmDeleteApi = async () => {
    if (!pendingDeleteId) return;
    try {
      await dispatch(deleteApi(pendingDeleteId)).unwrap();
    } catch {
      // error is handled by the slice
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteName("");
    }
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      method: "GET",
      route: "",
      description: "",
      priority: 1,
      moduleId: "",
      subModuleId: "",
      featureId: "",
    });
    setEditingApi(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: API = {
      name: formData.name,
      method: formData.method,
      route: formData.route,
      description: formData.description,
      priority: formData.priority,
      featureId: formData.featureId as string | number,
      subModuleId: formData.subModuleId as string | number,
      moduleId: formData.moduleId as string | number,
    };

    if (editingApi?.id) {
      await dispatch(updateApi({ id: editingApi.id, data: payload })).unwrap();
    } else {
      await dispatch(createApi(payload)).unwrap();
    }
  };

  const selectedModuleName = useMemo(() => {
    return modules.find((module) => String(module.id) === String(formData.moduleId))?.name ?? "";
  }, [formData.moduleId, modules]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Master</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <Button onClick={handleAddApi} variant="primary" className="flex items-center gap-2">
                <Plus size={20} />
                Add API
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {apis.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No APIs found
                    </td>
                  </tr>
                ) : (
                  apis.map((api, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{api.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                          {api.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{api.route}</td>
                      {/* <td className="px-6 py-4 text-sm text-gray-600">{api.priority}</td> */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditApi(api)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteApi(api.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* API MODAL */}
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
      >
        <ModalContent className="max-w-2xl">

          <ModalHeader>

            <ModalTitle>
              {editingApi ? "Edit API" : "Add API"}
            </ModalTitle>

            <ModalDescription>
              {editingApi
                ? "Update API information."
                : "Create a new API endpoint."}
            </ModalDescription>

          </ModalHeader>

          <form onSubmit={handleSubmit}>

            <ModalBody className="max-h-[70vh] space-y-4 overflow-y-auto">

              {/* Module & Sub Module */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Module
                  </label>

                  <select
                    value={formData.moduleId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        moduleId: e.target.value,
                        subModuleId: "",
                        featureId: "",
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">
                      Select Module
                    </option>

                    {modules.map((module) => (

                      <option
                        key={module.id}
                        value={module.id}
                      >
                        {module.name}
                      </option>

                    ))}

                  </select>

                </div>

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Sub Module
                  </label>

                  <select
                    value={formData.subModuleId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subModuleId:
                          e.target.value,
                        featureId: "",
                      })
                    }
                    disabled={
                      !formData.moduleId ||
                      loadingSubmodules
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingSubmodules
                        ? "Loading..."
                        : "Select Sub Module"}
                    </option>

                    {submodules.map(
                      (submodule) => (

                        <option
                          key={
                            submodule.id
                          }
                          value={
                            submodule.id
                          }
                        >
                          {submodule.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

              {/* Feature & Method */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Feature
                  </label>

                  <select
                    value={formData.featureId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featureId:
                          e.target.value,
                      })
                    }
                    disabled={
                      !formData.moduleId ||
                      loadingFeatures
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingFeatures
                        ? "Loading..."
                        : "Select Feature"}
                    </option>

                    {features.map(
                      (feature) => (

                        <option
                          key={feature.id}
                          value={feature.id}
                        >
                          {feature.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Method
                  </label>

                  <select
                    value={formData.method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        method:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="GET">
                      GET
                    </option>
                    <option value="POST">
                      POST
                    </option>
                    <option value="PUT">
                      PUT
                    </option>
                    <option value="PATCH">
                      PATCH
                    </option>
                    <option value="DELETE">
                      DELETE
                    </option>
                  </select>

                </div>

              </div>

              {/* Name */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter API name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none placeholder-gray-400 focus:ring-2 focus:ring-primary"
                  required
                />

              </div>

              {/* Route */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Route
                </label>

                <input
                  type="text"
                  value={formData.route}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      route: e.target.value,
                    })
                  }
                  placeholder="Enter API route"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none placeholder-gray-400 focus:ring-2 focus:ring-primary"
                  required
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="Enter description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none placeholder-gray-400 focus:ring-2 focus:ring-primary"
                  required
                />

              </div>

            </ModalBody>

            <ModalFooter>

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : "Save API"}
              </Button>

            </ModalFooter>

          </form>

        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete API"
        description={`Are you sure you want to delete ${pendingDeleteName}?`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteApi}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
          setPendingDeleteName("");
        }}
      />
    </div>
  );
}
