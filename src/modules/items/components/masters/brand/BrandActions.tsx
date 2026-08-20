"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import DeleteBrandModal from "./DeleteBrandModal";
interface BrandActionsProps { 
  id: string;
  name: string;
  onDeleteSuccess?: () => void;
}

export default function BrandActions({ id, name, onDeleteSuccess }: BrandActionsProps) {
  const router = useRouter();
const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
    <div className="flex justify-end gap-2">
  <Button
    type="button"
    variant="ghost"
    size="icon"
    aria-label="View brand"
    title="View brand"
    onClick={() => router.push(`/items/brands/${id}`)}
    className="hover:bg-violet-50 hover:text-violet-600"
  >
    <Eye className="h-4 w-4" />
  </Button>

  <Button
    type="button"
    variant="ghost"
    size="icon"
    aria-label="Edit brand"
    title="Edit brand"
    onClick={() => router.push(`/items/brands/${id}/edit`)}
    className="hover:bg-blue-50 hover:text-blue-600"
  >
    <Pencil className="h-4 w-4" />
  </Button>

  <Button
    type="button"
    variant="ghost"
    size="icon"
    aria-label="Delete brand"
    title="Delete brand"
    onClick={() => setIsDeleteOpen(true)}
    className="hover:bg-red-50 hover:text-red-600"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</div>
    <DeleteBrandModal
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  brandId={id}
  brandName={name}
  onDeleteSuccess={onDeleteSuccess}
/>
</>
  );
}
