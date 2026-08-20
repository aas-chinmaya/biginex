"use client";

import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui";

interface ItemActionsProps {
  id: string;
  name: string;
}

export default function ItemActions({ id, name }: ItemActionsProps) {

  console.log("ItemActions id:", id);
  console.log("ItemActions name:", name);
  const router = useRouter();
  const itemId = id?.trim() || "";

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="View item"
        title="View item"
        onClick={() => itemId && router.push(`/items/${itemId}`)}
        disabled={!itemId}
        className="hover:bg-violet-50 hover:text-violet-600"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Edit item"
        title="Edit item"
        onClick={() => router.push(`/items/${id}/edit`)}
        className="hover:bg-blue-50 hover:text-blue-600"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}