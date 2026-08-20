"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import TaxMasterCard from "@/modules/items/components/masters/tax-master/TaxMasterCard";
import { taxMasterservice } from "@/modules/items/services/tax-master.service";
import { TaxMasterRow } from "@/modules/items/types";

export default function TaxMasterDetailsPage() {
  const params = useParams<{ id: string }>();
  const taxMasterId = params?.id;

  const [taxMaster, setTaxMaster] = useState<TaxMasterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTaxMaster() {
      if (!taxMasterId) {
        if (isMounted) {
          setError("Unable to load tax master details. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const detailResponse = await taxMasterservice.getTaxMasterById(taxMasterId);
        const detailTaxMaster = detailResponse?.data?.data ?? detailResponse?.data ?? null;

        if (detailTaxMaster) {
          if (isMounted) {
            setTaxMaster(detailTaxMaster);
            setLoading(false);
          }
          return;
        }

        const listResponse = await taxMasterservice.getTaxMasters(1, 100);
        const taxMasters = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
        const selectedTaxMaster = taxMasters.find((item: TaxMasterRow) => String(item.id) === String(taxMasterId));

        if (isMounted) {
          setTaxMaster(selectedTaxMaster ?? null);
        }
      } catch {
        try {
          const listResponse = await taxMasterservice.getTaxMasters(1, 100);
          const taxMasters = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
          const selectedTaxMaster = taxMasters.find((item: TaxMasterRow) => String(item.id) === String(taxMasterId));

          if (isMounted) {
            setTaxMaster(selectedTaxMaster ?? null);
          }
        } catch {
          if (isMounted) {
            setError("Unable to load tax master details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTaxMaster();

    return () => {
      isMounted = false;
    };
  }, [taxMasterId]);

  if (loading) {
    return <div className="text-gray-600">Loading tax master details...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!taxMaster) {
    return <div className="text-gray-600">Tax master not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tax Master Details</h1>
          <p className="text-sm text-slate-500">Review the selected GST tax master record.</p>
        </div>

        <Link href="/items/tax-master">
          <Button type="button" variant="outline">
            Back to Tax Masters
          </Button>
        </Link>
      </div>

      <TaxMasterCard taxMaster={taxMaster} />
    </div>
  );
}
