"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import DeleteTaxMasterModal from "./DeleteTaxMasterModal";

interface TaxMasterActionsProps {
  id: string;
  name: string;
  onDeleteSuccess?: () => void;
}

export default function TaxMasterActions({ id, name, onDeleteSuccess }: TaxMasterActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="View tax master" title="View tax master" onClick={() => router.push(`/items/tax-master/${id}`)} className="hover:bg-violet-50 hover:text-violet-600">
          <Eye className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Edit tax master" title="Edit tax master" onClick={() => router.push(`/items/tax-master/${id}/edit`)} className="hover:bg-blue-50 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Delete tax master" title="Delete tax master" onClick={() => setIsDeleteOpen(true)} className="hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteTaxMasterModal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} taxMasterId={id} taxMasterName={name} onDeleteSuccess={onDeleteSuccess} />
    </>
  );
}
