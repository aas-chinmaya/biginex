import VariantTypeForm from "@/modules/items/components/masters/variant-type/VariantTypeForm";

export default function CreateVariantTypePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Variant Type</h1>
        <p className="text-sm text-slate-500">Create a new variant type master record.</p>
      </div>

      <VariantTypeForm />
    </div>
  );
}
