"use client";

import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/modules/users/types";

interface UserModalProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: User | null;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  loading?: boolean;
}

export default function UserModal({ open, mode, user, onClose, onSubmit, loading = false }: UserModalProps) {
  const isView = mode === "view";
  const [formData, setFormData] = useState<CreateUserPayload>({
    fullName: "",
    email: "",
    password: "",
    role: "",
    contact: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        password: "",
        role: user.role?.name || "",
        contact: user.contact || "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "",
        contact: "",
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal open={open} onOpenChange={(value) => !value && onClose()}>
      <ModalContent className="max-w-xl">
        <ModalHeader>
          <ModalTitle>
            {mode === "create" ? "Add User" : mode === "edit" ? "Edit User" : "User Details"}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          {isView ? (
            <div className="space-y-3 text-sm text-gray-700">
              <div><span className="font-semibold">Name:</span> {user?.fullName}</div>
              <div><span className="font-semibold">Email:</span> {user?.email}</div>
              <div><span className="font-semibold">Contact:</span> {user?.contact}</div>
              <div><span className="font-semibold">Role:</span> {user?.role?.name || "-"}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>

              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input id="contact" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} required />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
              </div>

              {mode === "create" && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
              )}
            </form>
          )}
        </ModalBody>

        {!isView && (
          <ModalFooter>
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button onClick={() => handleSubmit(new Event("submit") as unknown as React.FormEvent)} disabled={loading}>
              {loading ? "Saving..." : mode === "create" ? "Create User" : "Update User"}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
