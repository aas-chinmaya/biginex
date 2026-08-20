"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { FormError, FormField } from "@/components/form";
import { notify } from "@/lib/toast";
import { variantValueSchema, VariantValueFormData } from "../../../validation";
import { variantValueservice } from "../../../services/variant-value.service";
import { variantTypeservice } from "../../../services/variant-type.service";
import { VariantTypeMasterRow } from "../../../types";

interface VariantValueFormProps {
  variantValueId?: string;
}

export default function VariantValueForm({ variantValueId }: VariantValueFormProps) {
  const router = useRouter();
  const isEdit = Boolean(variantValueId);

  const [loading, setLoading] = useState(isEdit);
  const [variantTypes, setVariantTypes] = useState<VariantTypeMasterRow[]>([]);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VariantValueFormData>({
    resolver: zodResolver(variantValueSchema),
    defaultValues: {
      variantTypeId: "",
      value: "",
      shortName: "",
      displayOrder: 0,
      status: true,
    },
  });

  useEffect(() => {
    async function loadVariantTypes() {
      try {
        const response = await variantTypeservice.getVariantTypes(1, 100);
        const list = response?.data?.data?.data ?? response?.data?.data ?? [];
        setVariantTypes(list);
      } catch {
        setVariantTypes([]);
      }
    }

    loadVariantTypes();
  }, []);

  useEffect(() => {
    if (!variantValueId) {
      setLoading(false);
      return;
    }

    const loadVariantValue = async () => {
      try {
        setLoading(true);
        const response = await variantValueservice.getVariantValueById(variantValueId);
        const variantValue = response?.data?.data;

        reset({
          variantTypeId: variantValue?.variantTypeId ? String(variantValue.variantTypeId) : "",
          value: variantValue?.value ?? "",
          shortName: variantValue?.shortName ?? "",
          displayOrder: variantValue?.displayOrder ?? 0,
          status: variantValue?.status ?? true,
        });
      } catch {
        notify.error("Unable to load variant value details.");
      } finally {
        setLoading(false);
      }
    };

    loadVariantValue();
  }, [variantValueId, reset]);

  const onSubmit = async (data: VariantValueFormData) => {
    try {
      setIsSubmittingAction(true);

      const payload = {
        variantTypeId: Number(data.variantTypeId),
        value: data.value.trim(),
        shortName: data.shortName.trim(),
        displayOrder: Number(data.displayOrder),
        status: data.status,
      };

      if (isEdit && variantValueId) {
        await variantValueservice.updateVariantValue(variantValueId, payload);
        notify.success("Variant value updated successfully.");
      } else {
        await variantValueservice.createVariantValue(payload);
        notify.success("Variant value created successfully.");
      }

      router.push("/items/variant-value");
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Loading variant value...</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{isEdit ? "Edit Variant Value" : "Add Variant Value"}</h1>
            <p className="mt-1 text-gray-500">{isEdit ? "Update the variant value details." : "Create a new master variant value."}</p>
          </div>

          {isEdit && <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">Editing</span>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField>
            <Label htmlFor="variantTypeId">Variant Type</Label>
            <Controller
              name="variantTypeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="variantTypeId">
                    <SelectValue placeholder="Select variant type" />
                  </SelectTrigger>
                  <SelectContent>
                    {variantTypes.map((variantType) => (
                      <SelectItem key={variantType.id} value={String(variantType.id)}>
                        {variantType.variantTypeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormError message={errors.variantTypeId?.message} />
          </FormField>

          <FormField>
            <Label htmlFor="value">Value</Label>
            <Input id="value" placeholder="Enter variant value" {...register("value")} />
            <FormError message={errors.value?.message} />
          </FormField>

          <FormField>
            <Label htmlFor="shortName">Short Name</Label>
            <Input id="shortName" placeholder="Enter short name" {...register("shortName")} />
            <FormError message={errors.shortName?.message} />
          </FormField>

          <FormField>
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" type="number" placeholder="Enter display order" {...register("displayOrder", { valueAsNumber: true })} />
            <FormError message={errors.displayOrder?.message} />
          </FormField>

          <FormField>
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <input
                    id="status"
                    type="checkbox"
                    checked={Boolean(field.value)}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600">{field.value ? "Active" : "Inactive"}</span>
                </div>
              )}
            />
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/items/variant-value")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isSubmittingAction}>
            {isSubmitting || isSubmittingAction ? "Saving..." : isEdit ? "Update Variant Value" : "Create Variant Value"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
