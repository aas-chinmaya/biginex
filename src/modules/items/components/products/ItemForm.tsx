"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui";
import { FormError, FormField, ImageUpload } from "@/components/form";
import { RichTextEditor } from "@/components/editor";
import { notify } from "@/lib/toast";
import { productSchema, ProductFormData } from "@/modules/items/validation";
import { categoryservice } from "@/modules/items/services/category.service";
import { subCategoryservice } from "@/modules/items/services/sub-category.service";
import { brandservice } from "@/modules/items/services/brand.service";
import { unitservice } from "@/modules/items/services/unit.service";
import { taxMasterservice } from "@/modules/items/services/tax-master.service";
import { variantTypeservice } from "@/modules/items/services/variant-type.service";
import { variantValueservice } from "@/modules/items/services/variant-value.service";
import { CategoryMasterRow, SubCategoryMasterRow, BrandMasterRow, UnitMasterRow, TaxMasterRow, VariantTypeMasterRow, VariantValueMasterRow } from "@/modules/items/types";
import { productservice } from "@/modules/items/services/product.service";
 

interface ProductFormProps {
  productId?: string;
}

const MAX_IMAGE_SIZE_BYTES = 60 * 1024;
const TENANT_ID = 23443221;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState<CategoryMasterRow[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryMasterRow[]>([]);
  const [brands, setBrands] = useState<BrandMasterRow[]>([]);
  const [units, setUnits] = useState<UnitMasterRow[]>([]);
  const [taxes, setTaxes] = useState<TaxMasterRow[]>([]);
  const [variantTypes, setVariantTypes] = useState<VariantTypeMasterRow[]>([]);
  const [variantValues, setVariantValues] = useState<VariantValueMasterRow[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      itemCode: "",
      barcode: "",
      itemName: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      inventoryUnitId: "",
      taxId: "",
      hsnCode: "",
      minimumStock: 0,
      maximumStock: 0,
      variantTypeId: "",
      variantValueId: "",
      imageFile: null,
    },
  });

  const selectedCategoryId = watch("categoryId");
  const currentSubCategoryId = watch("subCategoryId");

  const visibleSubCategories = selectedCategoryId
    ? subCategories.filter((subCategory) => String(subCategory.categoryId) === String(selectedCategoryId))
    : subCategories;

  useEffect(() => {
    if (!selectedCategoryId) {
      if (currentSubCategoryId) {
        setValue("subCategoryId", "");
      }
      return;
    }

    if (currentSubCategoryId && !visibleSubCategories.some((subCategory) => String(subCategory.id) === String(currentSubCategoryId))) {
      setValue("subCategoryId", "");
    }
  }, [selectedCategoryId, currentSubCategoryId, visibleSubCategories, setValue]);

  useEffect(() => {
    async function loadLookups() {
      try {
        const [categoryResponse, subCategoryResponse, brandResponse, unitResponse, taxResponse, variantTypeResponse, variantValueResponse] = await Promise.all([
          categoryservice.getCategories(1, 100),
          subCategoryservice.getSubCategories(1, 100),
          brandservice.getBrands(1, 100),
          unitservice.getUnits(1, 100),
          taxMasterservice.getTaxMasters(1, 100),
          variantTypeservice.getVariantTypes(1, 100),
          variantValueservice.getVariantValues(1, 100),
        ]);

        setCategories(categoryResponse?.data?.data?.data ?? categoryResponse?.data?.data ?? []);
        setSubCategories(subCategoryResponse?.data?.data?.data ?? subCategoryResponse?.data?.data ?? []);
        setBrands(brandResponse?.data?.data?.data ?? brandResponse?.data?.data ?? []);
        setUnits(unitResponse?.data?.data?.data ?? unitResponse?.data?.data ?? []);
        setTaxes(taxResponse?.data?.data?.data ?? taxResponse?.data?.data ?? []);
        setVariantTypes(variantTypeResponse?.data?.data?.data ?? variantTypeResponse?.data?.data ?? []);
        setVariantValues(variantValueResponse?.data?.data?.data ?? variantValueResponse?.data?.data ?? []);
      } catch {
        setCategories([]);
        setSubCategories([]);
        setBrands([]);
        setUnits([]);
        setTaxes([]);
        setVariantTypes([]);
        setVariantValues([]);
      }
    }

    loadLookups();
  }, []);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productservice.getProductById(productId);
        const product = response?.data?.data;

        setExistingImageUrl(product?.image ?? "");

        reset({
          itemCode: product?.itemCode ?? "",
          barcode: product?.barcode ?? "",
          itemName: product?.itemName ?? "",
          description: product?.description ?? "",
          categoryId: product?.categoryId ? String(product.categoryId) : "",
          subCategoryId: product?.subCategoryId ? String(product.subCategoryId) : "",
          brandId: product?.brandId ? String(product.brandId) : "",
          inventoryUnitId: product?.inventoryUnitId ? String(product.inventoryUnitId) : "",
          taxId: product?.taxId ? String(product.taxId) : "",
          hsnCode: product?.hsnCode ?? "",
          minimumStock: Number(product?.minimumStock ?? 0),
          maximumStock: Number(product?.maximumStock ?? 0),
          variantTypeId: product?.variantTypeId ? String(product.variantTypeId) : "",
          variantValueId: product?.variantValueId ? String(product.variantValueId) : "",
          imageFile: null,
        });
      } catch {
        notify.error("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmittingAction(true);

      const imageValue = data.imageFile
        ? await fileToDataUrl(data.imageFile as File)
        : existingImageUrl;

      const payload = {
        tenantId: TENANT_ID,
        itemCode: data.itemCode.trim(),
        barcode: data.barcode?.trim() || null,
        itemName: data.itemName.trim(),
        description: data.description?.trim() || "",
        categoryId: Number(data.categoryId),
        subCategoryId: Number(data.subCategoryId),
        brandId: Number(data.brandId),
        inventoryUnitId: Number(data.inventoryUnitId),
        taxId: Number(data.taxId),
        hsnCode: data.hsnCode.trim(),
        minimumStock: Number(data.minimumStock),
        maximumStock: Number(data.maximumStock),
        image: imageValue,
        variantTypeId: data.variantTypeId ? Number(data.variantTypeId) : null,
        variantValueId: data.variantValueId ? Number(data.variantValueId) : null,
        createdBy: "admin",
        updatedBy: "admin",
      };

      if (isEdit && productId) {
        await productservice.updateProduct(productId, payload);
        notify.success("Product updated successfully.");
      } else {
        await productservice.createProduct(payload);
        notify.success("Product created successfully.");
      }

      router.push("/items");
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Loading product...</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       
        <Card className="p-6">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{isEdit ? "Edit Product" : "Add Product"}</h1>
              <p className="mt-1 text-gray-500">Create a polished product record with rich details, linked categories, image upload, and barcode settings.</p>
            </div>
            {isEdit && <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">Editing</span>}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 p-4 md:p-5">
              <h2 className="text-lg font-semibold text-slate-800">Basic information</h2>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <FormField>
                  <Label htmlFor="itemCode">Item Code</Label>
                  <Input id="itemCode" placeholder="Enter item code" {...register("itemCode")} />
                  <FormError message={errors.itemCode?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input id="itemName" placeholder="Enter item name" {...register("itemName")} />
                  <FormError message={errors.itemName?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" placeholder="Enter barcode" {...register("barcode")} />
                  <FormError message={errors.barcode?.message} />
                </FormField>

                <FormField className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter product description..." />
                    )}
                  />
                  <FormError message={errors.description?.message} />
                </FormField>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
              <h2 className="text-lg font-semibold text-slate-800">Category & classification</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField>
                  <Label htmlFor="categoryId">Category</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
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
                  <Label htmlFor="subCategoryId">Sub Category</Label>
                  <Controller
                    name="subCategoryId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger id="subCategoryId">
                          <SelectValue placeholder={selectedCategoryId ? "Select sub category" : "Select a category first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {visibleSubCategories.map((subCategory) => (
                            <SelectItem key={subCategory.id} value={String(subCategory.id)}>
                              {subCategory.subCategoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError message={errors.subCategoryId?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="brandId">Brand</Label>
                  <Controller
                    name="brandId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger id="brandId">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={String(brand.id)}>
                              {brand.brandName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError message={errors.brandId?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="inventoryUnitId">Inventory Unit</Label>
                  <Controller
                    name="inventoryUnitId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger id="inventoryUnitId">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit.id} value={String(unit.id)}>
                              {unit.unitName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError message={errors.inventoryUnitId?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="taxId">Tax</Label>
                  <Controller
                    name="taxId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger id="taxId">
                          <SelectValue placeholder="Select tax master" />
                        </SelectTrigger>
                        <SelectContent>
                          {taxes.map((tax) => (
                            <SelectItem key={tax.id} value={String(tax.id)}>
                              {tax.hsnCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError message={errors.taxId?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="hsnCode">HSN Code</Label>
                  <Input id="hsnCode" placeholder="Enter HSN code" {...register("hsnCode")} />
                  <FormError message={errors.hsnCode?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="variantTypeId">Variant Type</Label>
                  <Controller
                    name="variantTypeId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
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
                  <Label htmlFor="variantValueId">Variant Value</Label>
                  <Controller
                    name="variantValueId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger id="variantValueId">
                          <SelectValue placeholder="Select variant value" />
                        </SelectTrigger>
                        <SelectContent>
                          {variantValues.map((variantValue) => (
                            <SelectItem key={variantValue.id} value={String(variantValue.id)}>
                              {variantValue.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError message={errors.variantValueId?.message} />
                </FormField>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 md:p-5">
              <h2 className="text-lg font-semibold text-slate-800">Stock & media</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField>
                  <Label htmlFor="minimumStock">Minimum Stock</Label>
                  <Input id="minimumStock" type="number" placeholder="0" {...register("minimumStock", { valueAsNumber: true })} />
                  <FormError message={errors.minimumStock?.message} />
                </FormField>

                <FormField>
                  <Label htmlFor="maximumStock">Maximum Stock</Label>
                  <Input id="maximumStock" type="number" placeholder="0" {...register("maximumStock", { valueAsNumber: true })} />
                  <FormError message={errors.maximumStock?.message} />
                </FormField>

                <FormField className="sm:col-span-2">
                  <Label htmlFor="imageFile">Product Image</Label>
                  <p className="mb-2 text-sm text-gray-500">Upload a JPG or PNG image up to 60 KB.</p>
                  <Controller
                    name="imageFile"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value ?? null}
                        onChange={(file) => field.onChange(file)}
                        maxSize={MAX_IMAGE_SIZE_BYTES}
                      />
                    )}
                  />
                  <FormError message={errors.imageFile?.message as string} />
                </FormField>

              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/items")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isSubmittingAction}>
              {isSubmitting || isSubmittingAction ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </Card>
       
    </form>
  );
}
