"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { RichTextViewer } from "@/components/editor";

import { CategoryMasterRow } from "../../../types";
import DeleteCategoryModal from "../category/DeleteCategoryModal";

interface CategoryCardProps {
  category: CategoryMasterRow;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const router = useRouter();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const createdAt = category.createdAt
    ? new Date(category.createdAt).toLocaleString("en-IN")
    : "-";

  const updatedAt = category.updatedAt
    ? new Date(category.updatedAt).toLocaleString("en-IN")
    : "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">
              {category.categoryName}
            </h1>

            <RichTextViewer
              html={category.description}
              className="mt-2 text-gray-500"
              emptyText="No description available."
            />
          </div>

         
        </div>
      </Card>

      {/* Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Category Information
          </h2>

          <div className="space-y-4">
            <Info
              label="ID"
              value={category.id || "-"}
            />

            <Info
              label="Category Name"
              value={category.categoryName || "-"}
            />

             

            <Info
              label="Description"
              value={
                <RichTextViewer
                  html={category.description}
                  emptyText="-"
                  className="text-right"
                />
              }
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Audit Information
          </h2>

          <div className="space-y-4">
            <Info
              label="Created At"
              value={createdAt}
            />

            <Info
              label="Updated At"
              value={updatedAt}
            />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={() =>
            router.push(
              `/items/category-master/${category.id}/edit`
            )
          }
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>

        <Button
          type="button"
          variant="danger"
          onClick={() => {
            onDelete?.();
            setIsDeleteOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DeleteCategoryModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        categoryId={String(category.id)}
        categoryName={
          category.categoryName || "this category"
        }
        onDeleteSuccess={() =>
          router.push("/items/category-master")
        }
      />
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-gray-100 py-3">
      <span className="text-gray-500">
        {label}
      </span>

      <div className="max-w-md text-right font-medium">
        {value}
      </div>
    </div>
  );
}