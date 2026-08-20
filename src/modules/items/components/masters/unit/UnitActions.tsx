"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import DeleteUnitModal from "./DeleteUnitModal";

interface UnitActionsProps {
  id: string;
  name: string;
  onDeleteSuccess?: () => void;
}

export default function UnitActions({ id, name, onDeleteSuccess }: UnitActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="View unit"
          title="View unit"
          onClick={() => router.push(`/items/units/${id}`)}
          className="hover:bg-violet-50 hover:text-violet-600"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit unit"
          title="Edit unit"
          onClick={() => router.push(`/items/units/${id}/edit`)}
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete unit"
          title="Delete unit"
          onClick={() => setIsDeleteOpen(true)}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteUnitModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        unitId={id}
        unitName={name}
        onDeleteSuccess={onDeleteSuccess}
      />
    </>
  );
}
