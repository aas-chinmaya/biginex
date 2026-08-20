"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { RichTextViewer } from "@/components/editor";

import DeleteVariantValueModal from "./DeleteVariantValueModal";
import { VariantValueMasterRow } from "../../../types";

interface VariantValueCardProps {
  variantValue: VariantValueMasterRow;
}

export default function VariantValueCard({
  variantValue,
}: VariantValueCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const createdAt = variantValue.createdAt
    ? new Date(variantValue.createdAt).toLocaleString("en-IN")
    : "-";

  const updatedAt = variantValue.updatedAt
    ? new Date(variantValue.updatedAt).toLocaleString("en-IN")
    : "-";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {variantValue.value}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {variantValue.shortName}
          </p>
        </div>

        <Badge variant={variantValue.status ? "success" : "secondary"}>
          {variantValue.status ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Variant Value Information
          </h2>

          <div className="space-y-4">
            <Info label="ID" value={variantValue.id} />

            <Info label="Value" value={variantValue.value} />

            <Info label="Short Name" value={variantValue.shortName} />

            <Info
              label="Variant Type"
              value={variantValue.variantType?.variantTypeName ?? "-"}
            />

            <Info
              label="Display Order"
              value={variantValue.displayOrder ?? "-"}
            />      
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Audit Information
          </h2>

          <div className="space-y-4">
            <Info label="Created At" value={createdAt} />
            <Info label="Updated At" value={updatedAt} />
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={() =>
            router.push(`/items/variant-value/${variantValue.id}/edit`)
          }
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>

        <Button
          type="button"
          variant="danger"
          onClick={() => setIsDeleteOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DeleteVariantValueModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        variantValueId={String(variantValue.id)}
        variantValueName={variantValue.value}
        onDeleteSuccess={() => router.push("/items/variant-value")}
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
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <div className="text-sm font-medium text-slate-500">
        {label}
      </div>

      <div className="max-w-[70%] text-right text-sm text-slate-900">
        {value}
      </div>
    </div>
  );
}