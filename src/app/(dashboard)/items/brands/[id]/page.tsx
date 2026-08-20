"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import BrandCard from "@/modules/items/components/masters/brand/BrandCard";
import { brandservice } from "@/modules/items/services/brand.service";
import { BrandMasterRow } from "@/modules/items/types";

export default function BrandDetailsPage() {
  const params = useParams<{ id: string }>();
  const brandId = params?.id;

  const [brand, setBrand] = useState<BrandMasterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBrand() {
      if (!brandId) {
        if (isMounted) {
          setError("Unable to load brand details. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const detailResponse = await brandservice.getBrandById(brandId);
        const detailBrand = detailResponse?.data?.data ?? detailResponse?.data ?? null;

        if (detailBrand) {
          if (isMounted) {
            setBrand(detailBrand);
            setLoading(false);
          }
          return;
        }

        const listResponse = await brandservice.getBrands(1, 100);
        const brands = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
        const selectedBrand = brands.find((item: BrandMasterRow) => String(item.id) === String(brandId));

        if (isMounted) {
          setBrand(selectedBrand ?? null);
        }
      } catch {
        try {
          const listResponse = await brandservice.getBrands(1, 100);
          const brands = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
          const selectedBrand = brands.find((item: BrandMasterRow) => String(item.id) === String(brandId));

          if (isMounted) {
            setBrand(selectedBrand ?? null);
          }
        } catch {
          if (isMounted) {
            setError("Unable to load brand details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBrand();

    return () => {
      isMounted = false;
    };
  }, [brandId]);

  if (loading) {
    return <div className="text-gray-600">Loading brand details...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!brand) {
    return <div className="text-gray-600">Brand not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brand Details</h1>
          <p className="text-sm text-slate-500">Review the selected brand master record.</p>
        </div>

        <Link href="/items/brands">
          <Button type="button" variant="outline">
            Back to Brands
          </Button>
        </Link>
      </div>

      <BrandCard brand={brand} />
    </div>
  );
}
