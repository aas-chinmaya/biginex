"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { RichTextViewer } from "@/components/editor";
import { BrandMasterRow } from "../../../types";
import DeleteBrandModal from "./DeleteBrandModal";

interface BrandCardProps {
  brand: BrandMasterRow;
}

export default function BrandCard({ brand }: BrandCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const createdAt = brand.createdAt ? new Date(brand.createdAt).toLocaleString("en-IN") : "-";
  const updatedAt = brand.updatedAt ? new Date(brand.updatedAt).toLocaleString("en-IN") : "-";

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">{brand.brandName}</h1>
            <RichTextViewer html={brand.description} className="mt-2 text-gray-500" emptyText="No description available." />
          </div>
          <Badge variant={brand.status ? "success" : "secondary"}>{brand.status ? "Active" : "Inactive"}</Badge>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Brand Information</h2>
          <div className="space-y-4">
            <Info label="ID" value={brand.id || "-"} />
            <Info label="Brand Name" value={brand.brandName || "-"} />
            <Info label="Description" value={<RichTextViewer html={brand.description} emptyText="-" className="text-right" />} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Audit Information</h2>
          <div className="space-y-4">
            <Info label="Created At" value={createdAt} />
            <Info label="Updated At" value={updatedAt} />
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" onClick={() => router.push(`/items/brands/${brand.id}/edit`)} className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>

        <Button type="button" variant="danger" onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DeleteBrandModal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} brandId={String(brand.id)} brandName={brand.brandName || "this brand"} onDeleteSuccess={() => router.push("/items/brands")} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-gray-100 py-3">
      <span className="text-gray-500">{label}</span>
      <div className="max-w-md text-right font-medium">{value}</div>
    </div>
  );
}
