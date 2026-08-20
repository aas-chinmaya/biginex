"use client";

import Image from "next/image";
import { Edit, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, Badge, Button, Switch } from "@/components/ui";
import Container from "../../../../components/common/Container";
import { notify } from "@/lib/toast";
import { productservice } from "@/modules/items/services/product.service";
import { ProductRow } from "../../types";

interface ItemCardProps {
  product?: ProductRow;
  productId: string;
}

export default function ItemCard({ product, productId }: ItemCardProps) {
  const router = useRouter();
  const [currentProduct, setCurrentProduct] = useState<ProductRow | null>(product ?? null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoadingProduct(true);
        const response = await productservice.getProductById(productId);
        const fetchedProduct = response?.data?.data ?? response?.data?.data?.data ?? response?.data;

        if (fetchedProduct) {
          setCurrentProduct(fetchedProduct);
        }
      } catch (error: any) {
        notify.error(error?.response?.data?.message || "Unable to load product details.");
      } finally {
        setLoadingProduct(false);
      }
    }

    loadProduct();
  }, [productId]);

  async function handleStatusChange(nextStatus: boolean) {
    if (!currentProduct?.id) {
      return;
    }

    try {
      setSavingStatus(true);
      await productservice.updateProductStatus(String(currentProduct.id), nextStatus);
      setCurrentProduct({ ...currentProduct, status: nextStatus });
      notify.success(nextStatus ? "Product activated." : "Product inactivated.");
    } catch (error: any) {
      notify.error(error?.response?.data?.message || "Unable to update product status.");
    } finally {
      setSavingStatus(false);
    }
  }

  return (
    <div className="space-y-6">
      <Container>
        <Card className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="relative h-56 w-full overflow-hidden rounded-xl border lg:w-64">
              {currentProduct?.image ? (
                <Image src={currentProduct.image} alt={currentProduct.itemName} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold">{currentProduct?.itemName ?? "-"}</h1>
                  <Badge variant={currentProduct?.status ? "success" : "secondary"}>
                    {currentProduct?.status ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="mt-3 text-gray-500">Item Code : {currentProduct?.itemCode ?? "-"}</p>
                <p className="text-gray-500">Barcode : {currentProduct?.barcode ?? "-"}</p>
                <p className="text-gray-500">Category : {currentProduct?.category?.categoryName ?? "-"}</p>
                <p className="text-gray-500">Sub Category : {currentProduct?.subCategory?.subCategoryName ?? "-"}</p>
                <p className="text-gray-500">Brand : {currentProduct?.brand?.brandName ?? "-"}</p>
             <p className="text-gray-500">
  Unit : {currentProduct?.inventoryUnit?.unitName ?? "-"}
</p>
                <p className="text-gray-500">Tax : {currentProduct?.tax?.hsnCode ?? "-"}</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button type="button" onClick={() => router.push(`/items/${currentProduct?.id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">{currentProduct?.status ? "Active" : "Inactive"}</span>
                  <Switch
                    checked={currentProduct?.status ?? false}
                    onCheckedChange={handleStatusChange}
                    disabled={savingStatus}
                    aria-label="Toggle product status"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-5 text-lg font-semibold">Classification</h2>
            <div className="space-y-4">
              <Info label="Variant Type" value={currentProduct?.variantType?.variantTypeName ?? "-"} />
              <Info label="Variant Value" value={currentProduct?.variantValue?.value ?? "-"} />
              <Info label="HSN Code" value={currentProduct?.hsnCode ?? "-"} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-lg font-semibold">Inventory</h2>
            <div className="space-y-4">
              <Info label="Minimum Stock" value={currentProduct?.minimumStock ?? 0} />
              <Info label="Maximum Stock" value={currentProduct?.maximumStock ?? 0} />
              <Info label="Status" value={currentProduct?.status ? "Active" : "Inactive"} />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Description</h2>
          <div className="text-gray-600">
            {currentProduct?.description ? <div dangerouslySetInnerHTML={{ __html: currentProduct.description }} /> : "No description available."}
          </div>
        </Card>

      
      </Container>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-none">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}