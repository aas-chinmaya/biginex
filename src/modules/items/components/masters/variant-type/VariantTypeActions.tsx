"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import DeleteVariantTypeModal from "./DeleteVariantTypeModal";

interface VariantTypeActionsProps {
  id: string;
  name: string;
  onDeleteSuccess?: () => void;
}

export default function VariantTypeActions({ id, name, onDeleteSuccess }: VariantTypeActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="View variant type" title="View variant type" onClick={() => router.push(`/items/variant-type/${id}`)} className="hover:bg-violet-50 hover:text-violet-600">
          <Eye className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Edit variant type" title="Edit variant type" onClick={() => router.push(`/items/variant-type/${id}/edit`)} className="hover:bg-blue-50 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Delete variant type" title="Delete variant type" onClick={() => setIsDeleteOpen(true)} className="hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteVariantTypeModal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} variantTypeId={id} variantTypeName={name} onDeleteSuccess={onDeleteSuccess} />
    </>
  );
}
