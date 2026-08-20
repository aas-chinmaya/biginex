"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { unitservice } from "../../../services/unit.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: string;
  unitName: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteUnitModal({ open, onOpenChange, unitId, unitName, onDeleteSuccess }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await unitservice.deleteUnit(unitId);
      notify.success("Unit deleted successfully.");
      onDeleteSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Unable to delete unit.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Unit</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{unitName}</span>?
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
