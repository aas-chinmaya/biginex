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
  fetchFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  clearError,
  clearSuccess,
  fetchModules,
} from "@/modules/masters/store/masterSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { Feature, Module, Submodule } from "@/modules/masters/types";
import { notify } from "@/lib/toast";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { getSubmodules } from "@/modules/masters/api/master.api";
import { Button } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function FeatureMasterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { features, isLoading, error, success } = useSelector(
    (state: RootState) => state.masters
  );
  const { modules } = useSelector((state: RootState) => state.masters);

  // State management
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [submodules, setSubmodules] = useState<Submodule[]>([]);
  const [loadingSubmodules, setLoadingSubmodules] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");

  const [formData, setFormData] = useState<Feature>({
    name: "",
    route: "",
    description: "",
    priority: 1,
    moduleId: "",
    subModuleId: "",
  });

  const getFeatureModuleId = (feature: Feature) =>
    feature.moduleId ?? feature.module?.id ?? feature.subModule?.module?.id ?? "";

  const getFeatureSubmoduleId = (feature: Feature) =>
    feature.subModuleId ?? feature.subModule?.id ?? "";

  // Fetch modules on mount
  useEffect(() => {
    dispatch(fetchModules({ search: "" }));
  }, [dispatch]);

  // Fetch features
  useEffect(() => {
    dispatch(fetchFeatures({ search }));
  }, [search, dispatch]);

  // Fetch submodules when module changes
  useEffect(() => {
    const handleSubmoduleFetch = async () => {
      if (formData.moduleId) {
        setLoadingSubmodules(true);
        try {
          const data = await getSubmodules(String(formData.moduleId));
          setSubmodules(data);
        } catch (err) {
          notify.error("Failed to fetch submodules");
          setSubmodules([]);
        } finally {
          setLoadingSubmodules(false);
        }
      } else {
        setSubmodules([]);
      }
    };
    handleSubmoduleFetch();
  }, [formData.moduleId]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      setShowModal(false);
      resetFormData();
      dispatch(fetchFeatures({ search }));
    }
  }, [success, dispatch, search]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddFeature = () => {
    resetFormData();
    setShowModal(true);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      ...feature,
      moduleId: getFeatureModuleId(feature),
      subModuleId: getFeatureSubmoduleId(feature),
    });
    setShowModal(true);
  };

  const handleDeleteFeature = async (id: string | number | undefined) => {
    if (!id) return;
    const featureItem = features.find((item) => item.id === id);
    setPendingDeleteId(id);
    setPendingDeleteName(featureItem?.name ?? "this feature");
    setConfirmOpen(true);
  };

  const confirmDeleteFeature = async () => {
    if (!pendingDeleteId) return;
    try {
      await dispatch(deleteFeature(pendingDeleteId)).unwrap();
    } catch {
      // error handled by slice
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteName("");
    }
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      route: "",
      description: "",
      priority: 1,
      moduleId: "",
      subModuleId: "",
    });
    setEditingFeature(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Feature = {
      name: formData.name,
      route: formData.route,
      description: formData.description,
      priority: formData.priority,
      moduleId: formData.moduleId as string | number,
      subModuleId: formData.subModuleId as string | number,
    };

    if (editingFeature?.id) {
      await dispatch(updateFeature({ id: editingFeature.id, data: payload })).unwrap();
    } else {
      await dispatch(createFeature(payload)).unwrap();
    }
  };

  const selectedModuleName = useMemo(() => {
    return modules.find((module) => String(module.id) === String(formData.moduleId))?.name ?? "";
  }, [formData.moduleId, modules]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feature Master</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <Button onClick={handleAddFeature} variant="primary" className="flex items-center gap-2">
                <Plus size={20} />
                Add Feature
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {features.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No features found
                    </td>
                  </tr>
                ) : (
                  features.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{feature.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{feature.route}</td>
                      {/* <td className="px-6 py-4 text-sm text-gray-600">{feature.priority}</td> */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditFeature(feature)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(feature.id)}
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

      {/* FEATURE MODAL */}
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
      >
        <ModalContent className="max-w-md">

          <ModalHeader>

            <ModalTitle>
              {editingFeature
                ? "Edit Feature"
                : "Add Feature"}
            </ModalTitle>

            <ModalDescription>
              {editingFeature
                ? "Update feature information."
                : "Create a new feature."}
            </ModalDescription>

          </ModalHeader>

          <form
            onSubmit={handleSubmit}
          >

            <ModalBody className="space-y-4">

              {/* Module */}

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

              {/* Sub Module */}

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
                        key={submodule.id}
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
                  placeholder="Enter feature name"
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
                  placeholder="Enter route"
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
                  value={
                    formData.description
                  }
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
                  : "Save Feature"}
              </Button>

            </ModalFooter>

          </form>

        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Feature"
        description={`Are you sure you want to delete ${pendingDeleteName}?`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteFeature}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
          setPendingDeleteName("");
        }}
      />
    </div>
  );
}
