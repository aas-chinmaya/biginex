"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";

export default function AddVariantValueButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => router.push("/items/variant-value/create")}
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add Variant Value
    </Button>
  );
}
