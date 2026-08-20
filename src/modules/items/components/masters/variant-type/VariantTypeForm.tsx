"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/editor";
import { Button, Card, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { FormError, FormField } from "@/components/form";
import { notify } from "@/lib/toast";
import { variantTypeSchema, VariantTypeFormData } from "../../../validation";
import { variantTypeservice } from "../../../services/variant-type.service";
import { subCategoryservice } from "../../../services/sub-category.service";
import { SubCategoryMasterRow } from "../../../types";

interface VariantTypeFormProps {
  variantTypeId?: string;
}

export default function VariantTypeForm({ variantTypeId }: VariantTypeFormProps) {
  const router = useRouter();
  const isEdit = Boolean(variantTypeId);

  const [loading, setLoading] = useState(isEdit);
  const [subCategories, setSubCategories] = useState<SubCategoryMasterRow[]>([]);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VariantTypeFormData>({
    resolver: zodResolver(variantTypeSchema),
    defaultValues: {
      subcategoryId: "",
      variantTypeCode: "",
      variantTypeName: "",
      description: "",
      
    },
  });

  useEffect(() => {
    async function loadSubCategories() {
      try {
        const response = await subCategoryservice.getSubCategories(1, 100);
        const list = response?.data?.data?.data ?? response?.data?.data ?? [];
        setSubCategories(list);
      } catch {
        setSubCategories([]);
      }
    }

    loadSubCategories();
  }, []);

  useEffect(() => {
    if (!variantTypeId) {
      setLoading(false);
      return;
    }

    const loadVariantType = async () => {
      try {
        setLoading(true);
        const response = await variantTypeservice.getVariantTypeById(variantTypeId);
        const variantType = response?.data?.data;

        reset({
          subcategoryId: variantType?.subCategoryId ? String(variantType.subCategoryId) : "",
          variantTypeCode: variantType?.variantTypeCode ?? "",
          variantTypeName: variantType?.variantTypeName ?? "",
          description: variantType?.description ?? "",
    
        });
      } catch {
        notify.error("Unable to load variant type details.");
      } finally {
        setLoading(false);
      }
    };

    loadVariantType();
  }, [variantTypeId, reset]);

  const onSubmit = async (data: VariantTypeFormData) => {
    try {
      setIsSubmittingAction(true);

      const payload = {
        subCategoryId: Number(data.subcategoryId),
        variantTypeCode: data.variantTypeCode.trim(),
        variantTypeName: data.variantTypeName.trim(),
        description: data.description?.trim() || "",
       
      };

      if (isEdit && variantTypeId) {
        await variantTypeservice.updateVariantType(variantTypeId, payload);
        notify.success("Variant type updated successfully.");
      } else {
        await variantTypeservice.createVariantType(payload);
        notify.success("Variant type created successfully.");
      }

      router.push("/items/variant-type");
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Loading variant type...</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{isEdit ? "Edit Variant Type" : "Add Variant Type"}</h1>
            <p className="mt-1 text-gray-500">{isEdit ? "Update the variant type details." : "Create a new master variant type."}</p>
          </div>

          {isEdit && <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">Editing</span>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField>
            <Label htmlFor="subcategoryId">Sub Category</Label>
            <Controller
              name="subcategoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="subcategoryId">
                    <SelectValue placeholder="Select sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCategory) => (
                      <SelectItem key={subCategory.id} value={String(subCategory.id)}>
                        {subCategory.subCategoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormError message={errors.subcategoryId?.message} />
          </FormField>

          <FormField>
            <Label htmlFor="variantTypeCode">Variant Type Code</Label>
            <Input id="variantTypeCode" placeholder="Enter variant type code" {...register("variantTypeCode")} />
            <FormError message={errors.variantTypeCode?.message} />
          </FormField>

          <FormField>
            <Label htmlFor="variantTypeName">Variant Type Name</Label>
            <Input id="variantTypeName" placeholder="Enter variant type name" {...register("variantTypeName")} />
            <FormError message={errors.variantTypeName?.message} />
          </FormField>
 

          <FormField className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter variant type description..." />
              )}
            />
            <FormError message={errors.description?.message} />
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/items/variant-type")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isSubmittingAction}>
            {isSubmitting || isSubmittingAction ? "Saving..." : isEdit ? "Update Variant Type" : "Create Variant Type"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
