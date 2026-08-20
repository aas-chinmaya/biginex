"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store/store";

import { notify } from "@/lib/toast";

import {
  cancelInvoice,
  deleteDraft,
} from "@/modules/sales/invoice/slice/invoice.slice";

import { Button } from "@/components/ui/button";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

type InvoiceDeleteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber?: string;
  isDraft: boolean;
};

export default function InvoiceDeleteModal({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  isDraft,
}: InvoiceDeleteModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [deleting, setDeleting] =
    useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      if (isDraft) {
        await dispatch(
          deleteDraft(invoiceId)
        ).unwrap();

        notify.success("Draft deleted");
      } else {
        await dispatch(
          cancelInvoice(invoiceId)
        ).unwrap();

        notify.success("Invoice cancelled");
      }

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Invoice action failed:",
        error
      );

      notify.error(
        isDraft
          ? "Failed to delete draft"
          : "Failed to cancel invoice"
      );
    } finally {
      setDeleting(false);
    }
  };

  const name =
    invoiceNumber ??
    (isDraft
      ? "this draft"
      : "this issued invoice");

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isDraft
              ? "Delete draft invoice?"
              : "Cancel issued invoice?"}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <p className="text-sm text-muted-foreground">
            {isDraft
              ? `This permanently removes ${name}.`
              : `This cancels ${name}. The issued invoice remains in the audit record.`}
          </p>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting
              ? isDraft
                ? "Deleting..."
                : "Cancelling..."
              : isDraft
                ? "Delete draft"
                : "Cancel invoice"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}