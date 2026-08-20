import ProductForm from "@/modules/items/components/products/ItemForm";

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create Product</h1>
        <p className="text-sm text-slate-500">Add a new product with master data and stock settings.</p>
      </div>
      <ProductForm />
    </div>
  );
}