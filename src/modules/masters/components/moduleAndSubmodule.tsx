"use client";

import { useEffect, useState } from "react";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  fetchModules,
  createModule,
  updateModule,
  deleteModule,
  selectModule,
  clearError,
  clearSuccess,
} from "@/modules/masters/store/masterSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { Module, Submodule } from "@/modules/masters/types";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import SubmoduleSection from "@/modules/masters/components/Submodule";
import { Button } from "@/components/ui";

export default function ModuleAndSubmodulePage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    modules,
    modulesLoading,
    submodules,
    submodulesLoading,
    selectedModuleId,
    isLoading,
    error,
    success,
  } = useSelector((state: RootState) => state.masters);

  // Module states
  const [moduleSearch, setModuleSearch] = useState("");
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");
  const [moduleForm, setModuleForm] = useState<Module>({
    name: "",
    route: "",
    description: "",
    priority: 1,
  });

  // Submodule states


  // Fetch modules on mount
  useEffect(() => {
    dispatch(fetchModules({ search: moduleSearch }));
  }, [moduleSearch, dispatch]);



  // Handle success/error
  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      setShowModuleModal(false);
      setModuleForm({ name: "", route: "", description: "", priority: 1 });
      setEditingModule(null);
      dispatch(fetchModules({ search: moduleSearch }));
    }
  }, [success, dispatch, moduleSearch, selectedModuleId]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Module handlers
  const handleModuleRowClick = (module: Module) => {
    dispatch(selectModule(module.id || null));
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setModuleForm({ name: "", route: "", description: "", priority: 1 });
    setShowModuleModal(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm(module);
    setShowModuleModal(true);
  };

  const handleDeleteModule = async (id: string | undefined) => {
    if (!id) return;
    const moduleItem = modules.find((item) => item.id === id);
    setPendingDeleteId(id);
    setPendingDeleteName(moduleItem?.name ?? "this module");
    setConfirmOpen(true);
  };

  const confirmDeleteModule = async () => {
    if (!pendingDeleteId) return;
    try {
      await dispatch(deleteModule(pendingDeleteId)).unwrap();
    } catch {
      // error handled by slice
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteName("");
    }
  };

  const handleSubmitModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModule?.id) {
      await dispatch(updateModule({ id: editingModule.id, data: moduleForm })).unwrap();
    } else {
      await dispatch(createModule(moduleForm)).unwrap();
    }
  };

  const getSelectedModuleName = () => {
    const module = modules.find((m) => m.id === selectedModuleId);
    return module?.name || "No module selected";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Module & Submodule Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE - MODULES */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Modules</h2>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <Button onClick={handleAddModule} variant="primary" className="flex items-center gap-2">
                  <Plus size={20} />
                  Add Module
                </Button>
              </div>
            </div>

            {/* Module Table */}
            <div className="overflow-x-auto">
              {modulesLoading ? (
                <div className="p-6 text-center text-gray-500">Loading modules...</div>
              ) : modules.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No modules found</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module, index) => (
                      <tr
                        key={index}
                        onClick={() => handleModuleRowClick(module)}
                        className={`border-b border-gray-200 cursor-pointer transition ${selectedModuleId === module.id
                            ? "bg-indigo-50"
                            : "hover:bg-gray-50"
                          }`}
                      >
                        <td className="px-6 py-4 text-sm text-black">{module.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{module.priority}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditModule(module);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteModule(module.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <SubmoduleSection />
        </div>
      </div>

      {/* MODULE MODAL */}
      <Modal
        open={showModuleModal}
        onOpenChange={setShowModuleModal}
      >
        <ModalContent className="max-w-md">

          <ModalHeader>

            <ModalTitle>
              {editingModule
                ? "Edit Module"
                : "Add Module"}
            </ModalTitle>

            <ModalDescription>
              {editingModule
                ? "Update module information."
                : "Create a new module."}
            </ModalDescription>

          </ModalHeader>

          <form onSubmit={handleSubmitModule}>

            <ModalBody className="space-y-4">

              {/* Name */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  value={moduleForm.name}
                  onChange={(e) =>
                    setModuleForm({
                      ...moduleForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter module name"
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
                  value={moduleForm.route}
                  onChange={(e) =>
                    setModuleForm({
                      ...moduleForm,
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
                  value={moduleForm.description}
                  onChange={(e) =>
                    setModuleForm({
                      ...moduleForm,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="Enter description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none placeholder-gray-400 focus:ring-2 focus:ring-primary"
                  required
                />

              </div>

              {/* Priority */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priority
                </label>

                <input
                  type="number"
                  value={moduleForm.priority}
                  onChange={(e) =>
                    setModuleForm({
                      ...moduleForm,
                      priority: Number(
                        e.target.value
                      ),
                    })
                  }
                  placeholder="Enter priority"
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
                  setShowModuleModal(false)
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
                  : "Save Module"}
              </Button>

            </ModalFooter>

          </form>

        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Module"
        description={`Are you sure you want to delete ${pendingDeleteName}?`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteModule}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
          setPendingDeleteName("");
        }}
      />
    </div>
  );
}
