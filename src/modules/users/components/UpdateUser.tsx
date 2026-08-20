"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/form";
import type { UpdateUserPayload, User } from "@/modules/users/types";
import { updateUserSchema } from "@/modules/users/validation";
import { fetchRoles } from "@/modules/masters/store/masterSlice";
import type { AppDispatch, RootState } from "@/store/store";

interface UpdateUserProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (payload: UpdateUserPayload) => Promise<void>;
  loading?: boolean;
}

const defaultValues: UpdateUserPayload = {
  fullName: "",
  email: "",
  role: "",
  contact: "",
};

export default function UpdateUser({ open, user, onClose, onSubmit, loading = false }: UpdateUserProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, rolesLoading } = useSelector((state: RootState) => state.masters);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open && roles.length === 0) {
      dispatch(fetchRoles({ search: "" }));
    }
  }, [dispatch, open, roles.length]);

  useEffect(() => {
    reset(
      user
        ? {
            fullName: user.fullName || "",
            email: user.email || "",
            role: user.role?.name || "",
            contact: user.contact || "",
          }
        : defaultValues
    );
  }, [open, user, reset]);

  const handleFormSubmit = async (data: UpdateUserPayload) => {
    await onSubmit(data);
  };

  return (
    <Modal open={open} onOpenChange={(value) => !value && onClose()}>
      <ModalContent className="max-w-xl">
        <ModalHeader>
          <ModalTitle>Edit User</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <form id="edit-user-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField label="Full Name" required error={errors.fullName?.message}>
              <Input id="edit-fullName" placeholder="Enter full name" {...register("fullName")} />
            </FormField>

            <FormField label="Email" required error={errors.email?.message}>
              <Input id="edit-email" type="email" placeholder="name@example.com" {...register("email")} />
            </FormField>

            <FormField label="Contact" required error={errors.contact?.message}>
              <Input id="edit-contact" placeholder="Enter contact number" {...register("contact")} />
            </FormField>

            <FormField label="Role" required error={errors.role?.message}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange} disabled={rolesLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select role"} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {rolesLoading ? "Loading roles..." : "No roles found"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" form="edit-user-form" disabled={loading || isSubmitting}>
            {loading || isSubmitting ? "Saving..." : "Update User"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
