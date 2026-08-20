"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { RichTextViewer } from "@/components/editor";
import { UnitMasterRow } from "../../../types";
import DeleteUnitModal from "./DeleteUnitModal";

interface UnitCardProps {
  unit: UnitMasterRow;
}

export default function UnitCard({ unit }: UnitCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const createdAt = unit.createdAt ? new Date(unit.createdAt).toLocaleString("en-IN") : "-";
  const updatedAt = unit.updatedAt ? new Date(unit.updatedAt).toLocaleString("en-IN") : "-";

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">{unit.unitName}</h1>
            <div className="mt-2 text-gray-500">{unit.shortName} · {unit.unitType}</div>
            <RichTextViewer html={unit.description} className="mt-2 text-gray-500" emptyText="No description available." />
          </div>
          <Badge variant={unit.status ? "success" : "secondary"}>{unit.status ? "Active" : "Inactive"}</Badge>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Unit Information</h2>
          <div className="space-y-4">
            <Info label="ID" value={unit.id || "-"} />
            <Info label="Unit Name" value={unit.unitName || "-"} />
            <Info label="Short Name" value={unit.shortName || "-"} />
            <Info label="Unit Type" value={unit.unitType || "-"} />
            <Info label="Description" value={<RichTextViewer html={unit.description} emptyText="-" className="text-right" />} />
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
        <Button type="button" onClick={() => router.push(`/items/units/${unit.id}/edit`)} className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>

        <Button type="button" variant="danger" onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DeleteUnitModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        unitId={String(unit.id)}
        unitName={unit.unitName || "this unit"}
        onDeleteSuccess={() => router.push("/items/units")}
      />
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
