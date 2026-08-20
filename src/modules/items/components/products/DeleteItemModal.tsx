"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemName: string;
}

export default function DeleteitemModal({
  open,
  onOpenChange,
  itemId,
  itemName,
}: Props) {
  function handleDelete() {
    console.log("Delete item", itemId);

    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
    >
      <ModalContent>

        <ModalHeader>
          <ModalTitle>
            Delete item
          </ModalTitle>
        </ModalHeader>

        <ModalBody>

          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {itemName}
            </span>
            ?
          </p>

        </ModalBody>

        <ModalFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>

        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}