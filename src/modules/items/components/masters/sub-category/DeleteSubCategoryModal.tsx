"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { subCategoryservice } from "../../../services/sub-category.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategoryId: string;
  subCategoryName: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteSubCategoryModal({ open, onOpenChange, subCategoryId, subCategoryName, onDeleteSuccess }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await subCategoryservice.deleteSubCategory(subCategoryId);
      notify.success("Sub-category deleted successfully.");
      onDeleteSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Unable to delete sub-category.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Sub Category</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{subCategoryName}</span>?
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
