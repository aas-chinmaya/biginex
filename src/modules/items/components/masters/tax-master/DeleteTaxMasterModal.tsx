"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { taxMasterservice } from "../../../services/tax-master.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxMasterId: string;
  taxMasterName: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteTaxMasterModal({ open, onOpenChange, taxMasterId, taxMasterName, onDeleteSuccess }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await taxMasterservice.deleteTaxMaster(taxMasterId);
      notify.success("Tax master deleted successfully.");
      onDeleteSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Unable to delete tax master.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Tax Master</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{taxMasterName}</span>?
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
