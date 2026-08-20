"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import SubCategoryCard from "@/modules/items/components/masters/sub-category/SubCategoryCard";
import { subCategoryservice } from "@/modules/items/services/sub-category.service";
import { SubCategoryMasterRow } from "@/modules/items/types";

export default function SubCategoryDetailsPage() {
  const params = useParams<{ id: string }>();
  const subCategoryId = params?.id;

  const [subCategory, setSubCategory] = useState<SubCategoryMasterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSubCategory() {
      if (!subCategoryId) {
        if (isMounted) {
          setError("Unable to load sub-category details. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const detailResponse = await subCategoryservice.getSubCategoryById(subCategoryId);
        const detailSubCategory = detailResponse?.data?.data ?? detailResponse?.data ?? null;

        if (detailSubCategory) {
          if (isMounted) {
            setSubCategory(detailSubCategory);
            setLoading(false);
          }
          return;
        }

        const listResponse = await subCategoryservice.getSubCategories(1, 100);
        const subCategories = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
        const selectedSubCategory = subCategories.find((item: SubCategoryMasterRow) => String(item.id) === String(subCategoryId));

        if (isMounted) {
          setSubCategory(selectedSubCategory ?? null);
        }
      } catch {
        try {
          const listResponse = await subCategoryservice.getSubCategories(1, 100);
          const subCategories = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
          const selectedSubCategory = subCategories.find((item: SubCategoryMasterRow) => String(item.id) === String(subCategoryId));

          if (isMounted) {
            setSubCategory(selectedSubCategory ?? null);
          }
        } catch {
          if (isMounted) {
            setError("Unable to load sub-category details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSubCategory();

    return () => {
      isMounted = false;
    };
  }, [subCategoryId]);

  if (loading) {
    return <div className="text-gray-600">Loading sub-category details...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!subCategory) {
    return <div className="text-gray-600">Sub-category not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sub Category Details</h1>
          <p className="text-sm text-slate-500">Review the selected sub-category master record.</p>
        </div>

        <Link href="/items/sub-category">
          <Button type="button" variant="outline">
            Back to Sub Categories
          </Button>
        </Link>
      </div>

      <SubCategoryCard subCategory={subCategory} />
    </div>
  );
}
