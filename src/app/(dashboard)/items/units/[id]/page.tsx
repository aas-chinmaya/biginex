"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import UnitCard from "@/modules/items/components/masters/unit/UnitCard";
import { unitservice } from "@/modules/items/services/unit.service";
import { UnitMasterRow } from "@/modules/items/types";

export default function UnitDetailsPage() {
  const params = useParams<{ id: string }>();
  const unitId = params?.id;

  const [unit, setUnit] = useState<UnitMasterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUnit() {
      if (!unitId) {
        if (isMounted) {
          setError("Unable to load unit details. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const detailResponse = await unitservice.getUnitById(unitId);
        const detailUnit = detailResponse?.data?.data ?? detailResponse?.data ?? null;

        if (detailUnit) {
          if (isMounted) {
            setUnit(detailUnit);
            setLoading(false);
          }
          return;
        }

        const listResponse = await unitservice.getUnits(1, 100);
        const units = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
        const selectedUnit = units.find((item: UnitMasterRow) => String(item.id) === String(unitId));

        if (isMounted) {
          setUnit(selectedUnit ?? null);
        }
      } catch {
        try {
          const listResponse = await unitservice.getUnits(1, 100);
          const units = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
          const selectedUnit = units.find((item: UnitMasterRow) => String(item.id) === String(unitId));

          if (isMounted) {
            setUnit(selectedUnit ?? null);
          }
        } catch {
          if (isMounted) {
            setError("Unable to load unit details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUnit();

    return () => {
      isMounted = false;
    };
  }, [unitId]);

  if (loading) {
    return <div className="text-gray-600">Loading unit details...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!unit) {
    return <div className="text-gray-600">Unit not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Unit Details</h1>
          <p className="text-sm text-slate-500">Review the selected unit master record.</p>
        </div>

        <Link href="/items/units">
          <Button type="button" variant="outline">
            Back to Units
          </Button>
        </Link>
      </div>

      <UnitCard unit={unit} />
    </div>
  );
}
