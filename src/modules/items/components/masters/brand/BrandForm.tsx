"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/editor";
import { Button, Card, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { FormError, FormField } from "@/components/form";
import { notify } from "@/lib/toast";
import { brandSchema, BrandFormData } from "../../../validation";
import { brandservice } from "../../../services/brand.service";

interface BrandFormProps {
  brandId?: string;
}

export default function BrandForm({ brandId }: BrandFormProps) {
  const router = useRouter();
  const isEdit = Boolean(brandId);

  const [loading, setLoading] = useState(isEdit);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: "",
      description: "",
      
    },
  });

  useEffect(() => {
    if (!brandId) {
      setLoading(false);
      return;
    }

    const loadBrand = async () => {
      try {
        setLoading(true);
        const response = await brandservice.getBrandById(brandId);
        const brand = response?.data?.data;

        reset({
          brandName: brand?.brandName ?? "",
          description: brand?.description ?? "",
         
        });
      } catch {
        notify.error("Unable to load brand details.");
      } finally {
        setLoading(false);
      }
    };

    loadBrand();
  }, [brandId, reset]);

  const onSubmit = async (data: BrandFormData) => {
    try {
      setIsSubmittingAction(true);

      const payload = {
        brandName: data.brandName.trim(),
        description: data.description?.trim() || "",
        
      };

      if (isEdit && brandId) {
        await brandservice.updateBrand(brandId, payload);
        notify.success("Brand updated successfully.");
      } else {
        await brandservice.createBrand(payload);
        notify.success("Brand created successfully.");
      }

      router.push("/items/brands");
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Loading brand...</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{isEdit ? "Edit Brand" : "Add Brand"}</h1>
            <p className="mt-1 text-gray-500">{isEdit ? "Update the brand details." : "Create a new master brand."}</p>
          </div>

          {isEdit && <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">Editing</span>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField>
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" placeholder="Enter brand name" {...register("brandName")} />
            <FormError message={errors.brandName?.message} />
          </FormField>

        

          <FormField className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter brand description..." />
              )}
            />
            <FormError message={errors.description?.message} />
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/items/brands")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isSubmittingAction}>
            {isSubmitting || isSubmittingAction ? "Saving..." : isEdit ? "Update Brand" : "Create Brand"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
