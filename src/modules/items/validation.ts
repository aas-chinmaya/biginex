import { z } from "zod";

export const itemschema = z.object({
  name: z.string().min(2, "item name required"),
  sku: z.string().min(2, "SKU required"),
  category: z.string().min(1, "Category required"),
  unit: z.string().min(1, "Unit required"),
  purchasePrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  gst: z.number().min(0).max(28),
});

export const categorySchema = z.object({
  categoryName: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

export const subCategorySchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  subCategoryName: z.string().min(2, "Sub-category name is required"),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

export const brandSchema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

export const unitSchema = z.object({
  unitName: z.string().min(2, "Unit name is required"),
  shortName: z.string().min(1, "Short name is required"),
  unitType: z.enum(["WEIGHT", "LENGTH", "VOLUME", "COUNT", "AREA", "TIME", "PACKAGING", "CUSTOM"]),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

export const variantTypeSchema = z.object({
  subcategoryId: z.string().min(1, "Sub category is required"),
  variantTypeCode: z.string().min(2, "Variant type code is required"),
  variantTypeName: z.string().min(2, "Variant type name is required"),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

export const variantValueSchema = z.object({
  variantTypeId: z.string().min(1, "Variant type is required"),
  value: z.string().min(1, "Value is required"),
  shortName: z.string().min(1, "Short name is required"),
  displayOrder: z.number().min(0, "Display order must be 0 or greater"),
  status: z.boolean().optional(),
});

export const taxMasterSchema = z.object({
  hsnCode: z.string().min(1, "HSN code is required"),
  sacCode: z.string().min(1, "SAC code is required"),
  gstRate: z.number().min(0, "GST rate must be 0 or greater"),
  cgst: z.number().min(0, "CGST must be 0 or greater"),
  sgst: z.number().min(0, "SGST must be 0 or greater"),
  igst: z.number().min(0, "IGST must be 0 or greater"),
  ugst: z.number().min(0, "UGST must be 0 or greater"),
  cess: z.number().min(0, "CESS must be 0 or greater"),
  effectiveFrom: z.string().min(1, "Effective from is required"),
  effectiveTo: z.string().min(1, "Effective to is required"),
  status: z.boolean().optional(),
});

export const productSchema = z.object({
  itemCode: z.string().min(1, "Item code is required"),
  barcode: z.string().trim().optional().or(z.literal("")),
  itemName: z.string().min(2, "Item name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().min(1, "Sub category is required"),
  brandId: z.string().min(1, "Brand is required"),
  inventoryUnitId: z.string().min(1, "Unit is required"),
  taxId: z.string().min(1, "Tax is required"),
  hsnCode: z.string().min(1, "HSN code is required"),
  minimumStock: z.number().min(0, "Minimum stock must be 0 or greater"),
  maximumStock: z.number().min(0, "Maximum stock must be 0 or greater"),
  variantTypeId: z.string().optional().or(z.literal("")),
  variantValueId: z.string().optional().or(z.literal("")),
  imageFile: z
    .any()
    .nullable()
    .optional()
    .superRefine((value, ctx) => {
      if (value === null || value === undefined) return;

      if (!(value instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please upload a valid image file",
        });
        return;
      }

      if (!value.type.startsWith("image/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please upload an image file",
        });
      }

      if (value.size > 60 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image must be 60 KB or smaller",
        });
      }
    }),
});

export type itemFormData = z.infer<typeof itemschema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type SubCategoryFormData = z.infer<typeof subCategorySchema>;
export type BrandFormData = z.infer<typeof brandSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type VariantTypeFormData = z.infer<typeof variantTypeSchema>;
export type VariantValueFormData = z.infer<typeof variantValueSchema>;
export type TaxMasterFormData = z.infer<typeof taxMasterSchema>;
export type ProductFormData = z.infer<typeof productSchema>;