"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import DeleteCategoryModal from "./DeleteCategoryModal";

interface CategoryActionsProps {
  id: string;
  name: string;
  onDeleteSuccess?: () => void;
}

export default function CategoryActions({
  id,
  name,
  onDeleteSuccess,
}: CategoryActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="View category"
          title="View category"
          onClick={() => router.push(`/items/category-master/${id}`)}
          className="hover:bg-violet-50 hover:text-violet-600"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit category"
          title="Edit category"
          onClick={() => router.push(`/items/category-master/${id}/edit`)}
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete category"
          title="Delete category"
          onClick={() => setIsDeleteOpen(true)}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteCategoryModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        categoryId={id}
        categoryName={name}
        onDeleteSuccess={onDeleteSuccess}
      />
    </>
  );
}
