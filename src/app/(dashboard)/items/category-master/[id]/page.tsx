"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import CategoryCard from "@/modules/items/components/masters/category/CategoryCard";
import { categoryservice } from "@/modules/items/services/category.service";
import { CategoryMasterRow } from "@/modules/items/types";

export default function CategoryDetailsPage() {
  const params = useParams<{ id: string }>();
  const categoryId = params?.id;

  const [category, setCategory] = useState<CategoryMasterRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      if (!categoryId) {
        if (isMounted) {
          setError("Unable to load category details. Please try again.");
          setLoading(false);
        }
        return;
      }

      try {
        const detailResponse = await categoryservice.getCategoryById(categoryId);
        const detailCategory = detailResponse?.data?.data ?? detailResponse?.data ?? null;

        if (detailCategory) {
          if (isMounted) {
            setCategory(detailCategory);
            setLoading(false);
          }
          return;
        }

        const listResponse = await categoryservice.getCategories(1, 100);
        const categories = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
        const selectedCategory = categories.find((item: CategoryMasterRow) => String(item.id) === String(categoryId));

        if (isMounted) {
          setCategory(selectedCategory ?? null);
        }
      } catch {
        try {
          const listResponse = await categoryservice.getCategories(1, 100);
          const categories = listResponse?.data?.data?.data ?? listResponse?.data?.data ?? [];
          const selectedCategory = categories.find((item: CategoryMasterRow) => String(item.id) === String(categoryId));

          if (isMounted) {
            setCategory(selectedCategory ?? null);
          }
        } catch {
          if (isMounted) {
            setError("Unable to load category details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  if (loading) {
    return <div className="text-gray-600">Loading category details...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!category) {
    return <div className="text-gray-600">Category not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Category Details</h1>
          <p className="text-sm text-slate-500">Review the selected category master record.</p>
        </div>

        <Link href="/items/category-master">
          <Button type="button" variant="outline">
            Back to Categories
          </Button>
        </Link>
      </div>

      <CategoryCard category={category} />
    </div>
  );
}
