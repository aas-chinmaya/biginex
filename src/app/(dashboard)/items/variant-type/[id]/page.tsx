"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import VariantTypeCard from "@/modules/items/components/masters/variant-type/VariantTypeCard";
import { variantTypeservice } from "@/modules/items/services/variant-type.service";
import { VariantTypeMasterRow } from "@/modules/items/types";

export default function VariantTypeDetailsPage() {
  const params = useParams<{ id: string }>();
  const variantTypeId = params?.id;

  const [variantType, setVariantType] = useState<VariantTypeMasterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadVariantType() {
      if (!variantTypeId) {
        if (isMounted) {
          setError("Unable to load variant type details. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const detailResponse = await variantTypeservice.getVariantTypeById(variantTypeId);
        const detailVariantType = detailResponse?.data?.data ?? detailResponse?.data ?? null;

        if (detailVariantType) {
          if (isMounted) {
            setVariantType(detailVariantType);
            setLoading(false);
          }
          return;
        }

        const listResponse = await variantTypeservice.getVariantTypes(1, 100);
        const variantTypes = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
        const selectedVariantType = variantTypes.find((item: VariantTypeMasterRow) => String(item.id) === String(variantTypeId));

        if (isMounted) {
          setVariantType(selectedVariantType ?? null);
        }
      } catch {
        try {
          const listResponse = await variantTypeservice.getVariantTypes(1, 100);
          const variantTypes = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
          const selectedVariantType = variantTypes.find((item: VariantTypeMasterRow) => String(item.id) === String(variantTypeId));

          if (isMounted) {
            setVariantType(selectedVariantType ?? null);
          }
        } catch {
          if (isMounted) {
            setError("Unable to load variant type details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVariantType();

    return () => {
      isMounted = false;
    };
  }, [variantTypeId]);

  if (loading) {
    return <div className="text-gray-600">Loading variant type details...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!variantType) {
    return <div className="text-gray-600">Variant type not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Variant Type Details</h1>
          <p className="text-sm text-slate-500">Review the selected variant type master record.</p>
        </div>

        <Link href="/items/variant-type">
          <Button type="button" variant="outline">
            Back to Variant Types
          </Button>
        </Link>
      </div>

      <VariantTypeCard variantType={variantType} />
    </div>
  );
}
