import UnitForm from "@/modules/items/components/masters/unit/UnitForm";

export default function CreateUnitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Unit</h1>
        <p className="text-sm text-slate-500">Create a new unit master record.</p>
      </div>

      <UnitForm />
    </div>
  );
}
