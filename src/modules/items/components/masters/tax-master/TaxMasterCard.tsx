"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import {   Button, Card } from "@/components/ui";
import DeleteTaxMasterModal from "./DeleteTaxMasterModal";
import { TaxMasterRow } from "../../../types";
import { formatDate } from "@/lib/utils";
interface TaxMasterCardProps {
  taxMaster: TaxMasterRow;
}

export default function TaxMasterCard({ taxMaster }: TaxMasterCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const createdAt = taxMaster.createdAt ? new Date(taxMaster.createdAt).toLocaleString("en-IN") : "-";
  const updatedAt = taxMaster.updatedAt ? new Date(taxMaster.updatedAt).toLocaleString("en-IN") : "-";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{taxMaster.hsnCode}</h1>
          <p className="mt-1 text-sm text-slate-500">{taxMaster.sacCode}</p>
        </div>

        
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Tax Information</h2>
          <div className="space-y-4">
            <Info label="ID" value={taxMaster.id} />
            <Info label="HSN Code" value={taxMaster.hsnCode} />
            <Info label="SAC Code" value={taxMaster.sacCode} />
            <Info label="GST Rate" value={`${taxMaster.gstRate}%`} />
            <Info label="CGST" value={`${taxMaster.cgst}%`} />
            <Info label="SGST" value={`${taxMaster.sgst}%`} />
            <Info label="IGST" value={`${taxMaster.igst}%`} />
            <Info label="UGST" value={`${taxMaster.ugst}%`} />
            <Info label="CESS" value={`${taxMaster.cess}%`} />
            <Info
  label="Effective From"
  value={formatDate(taxMaster.effectiveFrom)}
/>

<Info
  label="Effective To"
  value={formatDate(taxMaster.effectiveTo)}
/>
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
        <Button type="button" onClick={() => router.push(`/items/tax-master/${taxMaster.id}/edit`)} className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>

        <Button type="button" variant="danger" onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <DeleteTaxMasterModal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} taxMasterId={String(taxMaster.id)} taxMasterName={taxMaster.hsnCode} onDeleteSuccess={() => router.push("/items/tax-master")} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="max-w-[70%] text-right text-sm text-slate-900">{value}</div>
    </div>
  );
}
