"use client";

import { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui";

import BranchForm, { BranchFormData } from "./BranchForm";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: BranchFormData;
  onSubmit?: (data: BranchFormData) => Promise<void> | void;
}

export default function AddBranchModal({
  open,
  onClose,
  initialValues,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: BranchFormData) => {
    if (!onSubmit) {
      console.log(data);
      onClose();
      return;
    }

    setLoading(true);

    try {
      await onSubmit(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <ModalContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6">

        <ModalHeader>
          <ModalTitle>
            {initialValues ? "Edit Branch" : "Add New Branch"}
          </ModalTitle>

          <ModalDescription>
            {initialValues
              ? "Update branch details for this business."
              : "Create a new branch for this business."}
          </ModalDescription>
        </ModalHeader>

        <BranchForm
          loading={loading}
          initialValues={initialValues}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />

      </ModalContent>
    </Modal>
  );
}