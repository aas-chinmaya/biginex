import VariantValueForm from "@/modules/items/components/masters/variant-value/VariantValueForm";

export default function CreateVariantValuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Variant Value</h1>
        <p className="text-sm text-slate-500">Create a new variant value master record.</p>
      </div>

      <VariantValueForm />
    </div>
  );
}
