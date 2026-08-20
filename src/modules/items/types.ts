export interface item {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  gst: number;
  createdAt: string;
  image?: string;
  document?: string;
  description?: string;
}

export interface CategoryMasterRow {
  id: string;
  categoryName: string;
  description: string;
   
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoryMasterRow {
  id: string;
  categoryId: number;
  subCategoryName: string;
  description: string;
  
  createdAt: string;
  updatedAt: string;
    category: {
    id: number;
    categoryName: string;
  };
}

export interface BrandMasterRow {
  id: string;
  brandName: string;
  description: string;
   
  createdAt: string;
  updatedAt: string;
}

export interface UnitMasterRow {
  id: string;
  unitName: string;
  shortName: string;
  unitType: string;
  description: string;
 
  createdAt: string;
  updatedAt: string;
}

export interface VariantTypeMasterRow {
  id: string;
  subCategoryId: number;
  variantTypeCode: string;
  variantTypeName: string;
  description: string;
 
  createdAt: string;
  updatedAt: string;

  subCategory?: {
    id: number;
    subCategoryName: string;
  };
}

export interface VariantValueMasterRow {
  id: string;
  variantTypeId: number;
  value: string;
  shortName: string;
  displayOrder: number;
 
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  variantType?: {
    id: number;
    variantTypeName: string;
  };
}

export interface TaxMasterRow {
  id: string;
  hsnCode: string;
  sacCode: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  ugst: number;
  cess: number;
  effectiveFrom: string;
  effectiveTo: string;
 
  createdAt: string;
  updatedAt: string;
}

export interface ProductRow {
  id: string;
  tenantId?: number;
  itemCode: string;
  barcode?: string | null;
  itemName: string;
  description?: string;
  categoryId: number;
  subCategoryId: number;
  brandId: number;
  inventoryUnitId: number;
  taxId: number;
  hsnCode: string;
  minimumStock: number;
  maximumStock: number;
  image?: string | null;
  variantTypeId?: number | null;
  variantValueId?: number | null;
  status: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  category?: {
    id: number;
    categoryName: string;
  };

  subCategory?: {
    id: number;
    subCategoryName: string;
  };

  brand?: {
    id: number;
    brandName: string;
  };

  inventoryUnit?: {
    id: number;
    unitName: string;
    shortName?: string;
    unitType?: string;
  };

  tax?: {
    id: number;
    hsnCode: string;
  };

  variantType?: {
    id: number;
    variantTypeName: string;
  };

  variantValue?: {
    id: number;
    value: string;
  };
}

export interface CreateCategoryPayload {
  categoryName: string;
  description?: string;
 
}

export interface UpdateCategoryPayload {
  categoryName?: string;
  description?: string;
   
}

export interface CreateSubCategoryPayload {
  categoryId: number;
  subCategoryName: string;
  description?: string;
 
}

export interface UpdateSubCategoryPayload {
  categoryId?: number;
  subCategoryName?: string;
  description?: string;
 
}

export interface CreateBrandPayload {
  brandName: string;
  description?: string;
  
}

export interface UpdateBrandPayload {
  brandName?: string;
  description?: string;
  
}

export interface CreateUnitPayload {
  unitName: string;
  shortName: string;
  unitType: string;
  description?: string;
  
}

export interface UpdateUnitPayload {
  unitName?: string;
  shortName?: string;
  unitType?: string;
  description?: string;
 
}

export interface CreateVariantTypePayload {
  subcategoryId: number;
  variantTypeCode: string;
  variantTypeName: string;
  description?: string;
 
}

export interface UpdateVariantTypePayload {
  subcategoryId?: number;
  variantTypeCode?: string;
  variantTypeName?: string;
  description?: string;
 
}

export interface CreateVariantValuePayload {
  variantTypeId: number;
  value: string;
  shortName: string;
  displayOrder: number;
 
}

export interface UpdateVariantValuePayload {
  variantTypeId?: number;
  value?: string;
  shortName?: string;
  displayOrder?: number;
 
}

export interface CreateTaxMasterPayload {
  hsnCode: string;
  sacCode: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  ugst: number;
  cess: number;
  effectiveFrom: string;
  effectiveTo: string;
   
}

export interface UpdateTaxMasterPayload {
  hsnCode?: string;
  sacCode?: string;
  gstRate?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  ugst?: number;
  cess?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  
}

export interface CreateitemPayload {

  name:string;

  sku:string;

  barcode?:string;

  category:string;

  unit:string;

  purchasePrice:number;

  sellingPrice:number;

  gst:number;

}

export interface CreateProductPayload {
  tenantId?: number | string;
  itemCode: string;
  barcode?: string | null;
  itemName: string;
  description?: string;
  categoryId: number;
  subCategoryId: number;
  brandId: number;
  inventoryUnitId: number;
  taxId: number;
  hsnCode: string;
  minimumStock: number;
  maximumStock: number;
  image?: string;
  variantTypeId?: number | null;
  variantValueId?: number | null;
  createdBy?: string;
  updatedBy?: string;
}

export interface UpdateProductPayload {
  tenantId?: number | string;
  itemCode?: string;
  barcode?: string | null;
  itemName?: string;
  description?: string;
  categoryId?: number;
  subCategoryId?: number;
  brandId?: number;
  inventoryUnitId?: number;
  taxId?: number;
  hsnCode?: string;
  minimumStock?: number;
  maximumStock?: number;
  image?: string;
  variantTypeId?: number | null;
  variantValueId?: number | null;
  createdBy?: string;
  updatedBy?: string;
}