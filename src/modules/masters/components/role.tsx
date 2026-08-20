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
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  clearError,
  clearSuccess,
} from "@/modules/masters/store/masterSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { Role } from "@/modules/masters/types";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";

export default function RoleMasterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, isLoading, error, success } = useSelector((state: RootState) => state.masters);

  // State management
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");

  const [formData, setFormData] = useState<Role>({
    name: "",
    description: "",
  });

  // Fetch roles
  useEffect(() => {
    dispatch(fetchRoles({ search }));
  }, [search, dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      setShowModal(false);
      resetFormData();
      dispatch(fetchRoles({ search }));
    }
  }, [success, dispatch, search]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingRole(null);
  };

  const handleAddRole = () => {
    resetFormData();
    setShowModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData(role);
    setShowModal(true);
  };

  const handleDeleteRole = async (id: string | number | undefined) => {
    if (!id) return;
    const roleItem = roles.find((item) => item.id === id);
    setPendingDeleteId(id);
    setPendingDeleteName(roleItem?.name ?? "this role");
    setConfirmOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!pendingDeleteId) return;
    try {
      await dispatch(deleteRole(pendingDeleteId)).unwrap();
    } catch {
      // error handled by slice
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Role = {
      name: formData.name,
      description: formData.description,
    };

    if (editingRole?.id) {
      await dispatch(updateRole({ id: editingRole.id, data: payload })).unwrap();
    } else {
      await dispatch(createRole(payload)).unwrap();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Role Master</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <Button onClick={handleAddRole} variant="primary" className="flex items-center gap-2">
                <Plus size={20} />
                Add Role
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No roles found
                    </td>
                  </tr>
                ) : (
                  roles.map((role, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{role.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{role.description}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditRole(role)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id)}
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

      {/* ROLE MODAL */}
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
      >
        <ModalContent className="max-w-md">

          <ModalHeader>

            <ModalTitle>
              {editingRole
                ? "Edit Role"
                : "Add Role"}
            </ModalTitle>

            <ModalDescription>
              {editingRole
                ? "Update role details."
                : "Create a new role for your organization."}
            </ModalDescription>

          </ModalHeader>

          <form onSubmit={handleSubmit}>

            <ModalBody className="space-y-4">

              {/* Role Name */}

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
                  placeholder="Enter role name"
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
                      description: e.target.value,
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
                  : "Save Role"}
              </Button>

            </ModalFooter>

          </form>

        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Role"
        description={`Are you sure you want to delete ${pendingDeleteName}?`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteRole}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
          setPendingDeleteName("");
        }}
      />
    </div>
  );
}
