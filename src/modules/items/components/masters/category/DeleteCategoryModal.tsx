"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { categoryservice } from "../../../services/category.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteCategoryModal({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  onDeleteSuccess,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await categoryservice.deleteCategory(categoryId);
      notify.success("Category deleted successfully.");
      onDeleteSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Unable to delete category.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Category</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{categoryName}</span>?
          </p>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
