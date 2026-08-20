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
  fetchSubmodules,
  createSubmodule,
  updateSubmodule,
  deleteSubmodule,
  clearError,
  clearSuccess,
} from "@/modules/masters/store/masterSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { Submodule } from "@/modules/masters/types";
import { notify } from "@/lib/toast";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";

export default function SubmoduleSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { submodules, submodulesLoading, selectedModuleId, isLoading, error, success, modules } =
    useSelector((state: RootState) => state.masters);

  const [submoduleSearch, setSubmoduleSearch] = useState("");
  const [showSubmoduleModal, setShowSubmoduleModal] = useState(false);
  const [editingSubmodule, setEditingSubmodule] = useState<Submodule | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");
  const [submoduleForm, setSubmoduleForm] = useState<Submodule>({
    name: "",
    route: "",
    description: "",
    priority: 1,
    moduleId: "",
  });

  useEffect(() => {
    if (selectedModuleId) {
      dispatch(fetchSubmodules({ moduleId: selectedModuleId, search: submoduleSearch }));
    }
  }, [selectedModuleId, submoduleSearch, dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      setShowSubmoduleModal(false);
      setSubmoduleForm({ name: "", route: "", description: "", priority: 1, moduleId: "" });
      setEditingSubmodule(null);
      if (selectedModuleId) dispatch(fetchSubmodules({ moduleId: selectedModuleId, search: submoduleSearch }));
    }
  }, [success, dispatch, selectedModuleId, submoduleSearch]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddSubmodule = () => {
    if (!selectedModuleId) {
      notify.error("Please select a module first");
      return;
    }
    setEditingSubmodule(null);
    setSubmoduleForm({ name: "", route: "", description: "", priority: 1, moduleId: selectedModuleId });
    setShowSubmoduleModal(true);
  };

  const handleEditSubmodule = (submodule: Submodule) => {
    setEditingSubmodule(submodule);
    setSubmoduleForm(submodule);
    setShowSubmoduleModal(true);
  };

  const handleDeleteSubmodule = async (id: string | undefined) => {
    if (!id) return;
    const submoduleItem = submodules.find((item) => item.id === id);
    setPendingDeleteId(id);
    setPendingDeleteName(submoduleItem?.name ?? "this submodule");
    setConfirmOpen(true);
  };

  const confirmDeleteSubmodule = async () => {
    if (!pendingDeleteId) return;
    try {
      await dispatch(deleteSubmodule(pendingDeleteId)).unwrap();
    } catch {
      // error handled by slice
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteName("");
    }
  };

  const handleSubmitSubmodule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubmodule?.id) {
      await dispatch(updateSubmodule({ id: editingSubmodule.id, data: submoduleForm })).unwrap();
    } else {
      await dispatch(createSubmodule(submoduleForm)).unwrap();
    }
  };

  const getSelectedModuleName = () => {
    const module = modules.find((m) => m.id === selectedModuleId);
    return module?.name || "No module selected";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submodules</h2>
        <p className="text-sm text-gray-600 mb-4">
          {selectedModuleId ? `Selected: ${getSelectedModuleName()}` : "Select a module to see submodules"}
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search submodules..."
              value={submoduleSearch}
              onChange={(e) => setSubmoduleSearch(e.target.value)}
              disabled={!selectedModuleId}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            />
          </div>
          <Button onClick={handleAddSubmodule} disabled={!selectedModuleId} variant="primary" className="flex items-center gap-2">
            <Plus size={20} />
            Add Submodule
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {!selectedModuleId ? (
          <div className="p-6 text-center text-gray-500">Select a module to view submodules</div>
        ) : submodulesLoading ? (
          <div className="p-6 text-center text-gray-500">Loading submodules...</div>
        ) : submodules.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No submodules found</div>
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
              {submodules.map((submodule, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{submodule.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{submodule.priority}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditSubmodule(submodule)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubmodule(submodule.id)}
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

      {/* SUBMODULE MODAL */}
      <Modal
        open={showSubmoduleModal}
        onOpenChange={setShowSubmoduleModal}
      >
        <ModalContent className="max-w-md">

          <ModalHeader>

            <ModalTitle>
              {editingSubmodule
                ? "Edit Submodule"
                : "Add Submodule"}
            </ModalTitle>

            <ModalDescription>
              {editingSubmodule
                ? "Update submodule information."
                : "Create a new submodule under the selected module."}
            </ModalDescription>

          </ModalHeader>

          <form onSubmit={handleSubmitSubmodule}>

            <ModalBody className="space-y-4">

              {/* Module */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Module
                </label>

                <input
                  type="text"
                  value={getSelectedModuleName()}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900"
                />

              </div>

              {/* Name */}

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  value={submoduleForm.name}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter submodule name"
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
                  value={submoduleForm.route}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
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
                  value={submoduleForm.description}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
                      description: e.target.value,
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
                  value={submoduleForm.priority}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
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
                  setShowSubmoduleModal(false)
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
                  : "Save Submodule"}
              </Button>

            </ModalFooter>

          </form>

        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Submodule"
        description={`Are you sure you want to delete ${pendingDeleteName}?`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteSubmodule}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
          setPendingDeleteName("");
        }}
      />
    </div>
  );
}
