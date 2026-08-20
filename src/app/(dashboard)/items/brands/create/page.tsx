import BrandForm from "@/modules/items/components/masters/brand/BrandForm";

export default function CreateBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Brand</h1>
        <p className="text-sm text-slate-500">Create a new brand master record.</p>
      </div>

      <BrandForm />
    </div>
  );
}
