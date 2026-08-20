"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";
import DeleteSubCategoryModal from "./DeleteSubCategoryModal";

interface SubCategoryActionsProps {
  id: string;
  name: string;
  onDeleteSuccess?: () => void;
}

export default function SubCategoryActions({
  id,
  name,
  onDeleteSuccess,
}: SubCategoryActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="View sub-category"
          title="View sub-category"
          onClick={() => router.push(`/items/sub-category/${id}`)}
          className="hover:bg-violet-50 hover:text-violet-600"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit sub-category"
          title="Edit sub-category"
          onClick={() => router.push(`/items/sub-category/${id}/edit`)}
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete sub-category"
          title="Delete sub-category"
          onClick={() => setIsDeleteOpen(true)}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteSubCategoryModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        subCategoryId={id}
        subCategoryName={name}
        onDeleteSuccess={onDeleteSuccess}
      />
    </>
  );
}