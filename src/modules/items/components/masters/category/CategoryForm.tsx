"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/editor";
import {
  Button,
  Card,
  Input,
  Label,
  
} from "@/components/ui";
import { FormError, FormField } from "@/components/form";
import { notify } from "@/lib/toast";

import {
  categorySchema,
  CategoryFormData,
} from "../../../validation";

import { categoryservice } from "../../../services/category.service";

interface CategoryFormProps {
  categoryId?: string;
}

export default function CategoryForm({
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();

  const isEdit = Boolean(categoryId);

  const [loading, setLoading] = useState(isEdit);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      description: "",
     
    },
  });

 

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const loadCategory = async () => {
      try {
        setLoading(true);

        const response =
          await categoryservice.getCategoryById(categoryId);

        const category = response?.data?.data;

        reset({
          categoryName: category?.categoryName ?? "",
          description: category?.description ?? "",
        
        });
      } catch (error) {
        notify.error("Unable to load category details.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmittingAction(true);

      const payload = {
        categoryName: data.categoryName.trim(),
        description: data.description?.trim() || "",
        
      };

      if (isEdit && categoryId) {
        await categoryservice.updateCategory(
          categoryId,
          payload
        );

        notify.success(
          "Category updated successfully."
        );
      } else {
        await categoryservice.createCategory(
          payload
        );

        notify.success(
          "Category created successfully."
        );
      }

      router.push("/items/category-master");
    } catch (error: any) {
      notify.error(
        error?.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">
          Loading category...
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">

        {/* Header */}

        <div className="mb-6 flex items-start justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              {isEdit
                ? "Edit Category"
                : "Add Category"}
            </h1>

            <p className="mt-1 text-gray-500">
              {isEdit
                ? "Update the category details."
                : "Create a new master category."}
            </p>
          </div>

          {isEdit && (
            <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
              Editing
            </span>
          )}

        </div>

        {/* Form */}

        <div className="grid gap-5 md:grid-cols-2">

          <FormField>
            <Label htmlFor="categoryName">
              Category Name
            </Label>

            <Input
              id="categoryName"
              placeholder="Enter category name"
              {...register("categoryName")}
            />

            <FormError
              message={errors.categoryName?.message}
            />
          </FormField>
 

        <FormField className="md:col-span-2">
  <Label htmlFor="description">
    Description
  </Label>

  <Controller
    name="description"
    control={control}
    render={({ field }) => (
      <RichTextEditor
        value={field.value || ""}
        onChange={field.onChange}
        placeholder="Enter category description..."
      />
    )}
  />

  <FormError
    message={errors.description?.message}
  />
</FormField>

        </div>

        {/* Footer */}

        <div className="mt-6 flex justify-end gap-3">

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push("/items/category-master")
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              isSubmittingAction
            }
          >
            {isSubmitting ||
            isSubmittingAction
              ? "Saving..."
              : isEdit
              ? "Update Category"
              : "Create Category"}
          </Button>

        </div>

      </Card>
    </form>
  );
}