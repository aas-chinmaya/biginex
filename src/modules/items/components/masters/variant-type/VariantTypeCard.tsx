"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { RichTextViewer } from "@/components/editor";

import DeleteVariantTypeModal from "./DeleteVariantTypeModal";
import { VariantTypeMasterRow } from "../../../types";

interface VariantTypeCardProps {
  variantType: VariantTypeMasterRow;
}

export default function VariantTypeCard({
  variantType,
}: VariantTypeCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const createdAt = variantType.createdAt
    ? new Date(variantType.createdAt).toLocaleString("en-IN")
    : "-";

  const updatedAt = variantType.updatedAt
    ? new Date(variantType.updatedAt).toLocaleString("en-IN")
    : "-";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {variantType.variantTypeName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {variantType.variantTypeCode}
          </p>
        </div>

        <Badge variant={variantType.status ? "success" : "secondary"}>
          {variantType.status ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Variant Type Information
          </h2>

          <div className="space-y-4">
            <Info label="ID" value={variantType.id} />

            <Info
              label="Variant Type Code"
              value={variantType.variantTypeCode}
            />

            <Info
              label="Variant Type Name"
              value={variantType.variantTypeName}
            />

            <Info
              label="Sub Category"
              value={variantType.subCategory?.subCategoryName ?? "-"}
            />

            <Info
              label="Description"
              value={
                <RichTextViewer
                  html={variantType.description}
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
            <Info label="Created At" value={createdAt} />
            <Info label="Updated At" value={updatedAt} />
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={() =>
            router.push(`/items/variant-type/${variantType.id}/edit`)
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

      <DeleteVariantTypeModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        variantTypeId={String(variantType.id)}
        variantTypeName={variantType.variantTypeName}
        onDeleteSuccess={() => router.push("/items/variant-types")}
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
    <div className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>

      <div className="max-w-[70%] text-right text-sm text-slate-900">
        {value}
      </div>
    </div>
  );
}