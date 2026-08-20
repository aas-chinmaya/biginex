"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import VariantValueCard from "@/modules/items/components/masters/variant-value/VariantValueCard";
import { variantValueservice } from "@/modules/items/services/variant-value.service";
import { VariantValueMasterRow } from "@/modules/items/types";

export default function VariantValueDetailsPage() {
  const params = useParams<{ id: string }>();
  const variantValueId = params?.id;

  const [variantValue, setVariantValue] = useState<VariantValueMasterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadVariantValue() {
      if (!variantValueId) {
        if (isMounted) {
          setError("Unable to load variant value details. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const detailResponse = await variantValueservice.getVariantValueById(variantValueId);
        const detailVariantValue = detailResponse?.data?.data ?? detailResponse?.data ?? null;

        if (detailVariantValue) {
          if (isMounted) {
            setVariantValue(detailVariantValue);
            setLoading(false);
          }
          return;
        }

        const listResponse = await variantValueservice.getVariantValues(1, 100);
        const variantValues = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
        const selectedVariantValue = variantValues.find((item: VariantValueMasterRow) => String(item.id) === String(variantValueId));

        if (isMounted) {
          setVariantValue(selectedVariantValue ?? null);
        }
      } catch {
        try {
          const listResponse = await variantValueservice.getVariantValues(1, 100);
          const variantValues = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
          const selectedVariantValue = variantValues.find((item: VariantValueMasterRow) => String(item.id) === String(variantValueId));

          if (isMounted) {
            setVariantValue(selectedVariantValue ?? null);
          }
        } catch {
          if (isMounted) {
            setError("Unable to load variant value details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVariantValue();

    return () => {
      isMounted = false;
    };
  }, [variantValueId]);

  if (loading) {
    return <div className="text-gray-600">Loading variant value details...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!variantValue) {
    return <div className="text-gray-600">Variant value not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Variant Value Details</h1>
          <p className="text-sm text-slate-500">Review the selected variant value master record.</p>
        </div>

        <Link href="/items/variant-value">
          <Button type="button" variant="outline">
            Back to Variant Values
          </Button>
        </Link>
      </div>

      <VariantValueCard variantValue={variantValue} />
    </div>
  );
}
