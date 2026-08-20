"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import DeleteVariantValueModal from "./DeleteVariantValueModal";

interface VariantValueActionsProps {
  id: string;
  name: string;
  onDeleteSuccess?: () => void;
}

export default function VariantValueActions({ id, name, onDeleteSuccess }: VariantValueActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="View variant value" title="View variant value" onClick={() => router.push(`/items/variant-value/${id}`)} className="hover:bg-violet-50 hover:text-violet-600">
          <Eye className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Edit variant value" title="Edit variant value" onClick={() => router.push(`/items/variant-value/${id}/edit`)} className="hover:bg-blue-50 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Delete variant value" title="Delete variant value" onClick={() => setIsDeleteOpen(true)} className="hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteVariantValueModal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} variantValueId={id} variantValueName={name} onDeleteSuccess={onDeleteSuccess} />
    </>
  );
}
