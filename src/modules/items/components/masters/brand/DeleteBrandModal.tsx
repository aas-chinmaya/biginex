"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { brandservice } from "../../../services/brand.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string;
  brandName: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteBrandModal({ open, onOpenChange, brandId, brandName, onDeleteSuccess }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await brandservice.deleteBrand(brandId);
      notify.success("Brand deleted successfully.");
      onDeleteSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Unable to delete brand.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Brand</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{brandName}</span>?
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
