"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/editor";
import { Button, Card, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { FormError, FormField } from "@/components/form";
import { notify } from "@/lib/toast";
import { subCategorySchema, SubCategoryFormData } from "../../../validation";
import { subCategoryservice } from "../../../services/sub-category.service";
import { categoryservice } from "../../../services/category.service";
import { CategoryMasterRow } from "../../../types";

interface SubCategoryFormProps {
  subCategoryId?: string;
}

export default function SubCategoryForm({ subCategoryId }: SubCategoryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(subCategoryId);

  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState<CategoryMasterRow[]>([]);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      categoryId: "",
      subCategoryName: "",
      description: "",
      
    },
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await categoryservice.getCategories(1, 100);
        const list = response?.data?.data?.data ?? response?.data?.data ?? [];
        setCategories(list);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (!subCategoryId) {
      setLoading(false);
      return;
    }

    const loadSubCategory = async () => {
      try {
        setLoading(true);
        const response = await subCategoryservice.getSubCategoryById(subCategoryId);
        const subCategory = response?.data?.data;

        reset({
          categoryId: subCategory?.categoryId ? String(subCategory.categoryId) : "",
          subCategoryName: subCategory?.subCategoryName ?? "",
          description: subCategory?.description ?? "",
        
        });
      } catch {
        notify.error("Unable to load sub-category details.");
      } finally {
        setLoading(false);
      }
    };

    loadSubCategory();
  }, [subCategoryId, reset]);

  const onSubmit = async (data: SubCategoryFormData) => {
    try {
      setIsSubmittingAction(true);

      const payload = {
         categoryId: Number(data.categoryId),
        subCategoryName: data.subCategoryName.trim(),
        description: data.description?.trim() || "",
     
      };

      if (isEdit && subCategoryId) {
        await subCategoryservice.updateSubCategory(subCategoryId, payload);
        notify.success("Sub-category updated successfully.");
      } else {
        await subCategoryservice.createSubCategory(payload);
        notify.success("Sub-category created successfully.");
      }

      router.push("/items/sub-category");
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Loading sub-category...</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{isEdit ? "Edit Sub Category" : "Add Sub Category"}</h1>
            <p className="mt-1 text-gray-500">{isEdit ? "Update the sub-category details." : "Create a new master sub-category."}</p>
          </div>

          {isEdit && (
            <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">Editing</span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField>
            <Label htmlFor="categoryId">Category</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormError message={errors.categoryId?.message} />
          </FormField>

          <FormField>
            <Label htmlFor="subCategoryName">Sub Category Name</Label>
            <Input id="subCategoryName" placeholder="Enter sub-category name" {...register("subCategoryName")} />
            <FormError message={errors.subCategoryName?.message} />
          </FormField>

     

          <FormField className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter sub-category description..." />
              )}
            />
            <FormError message={errors.description?.message} />
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/items/sub-category")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isSubmittingAction}>
            {isSubmitting || isSubmittingAction ? "Saving..." : isEdit ? "Update Sub Category" : "Create Sub Category"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
