import TaxMasterForm from "@/modules/items/components/masters/tax-master/TaxMasterForm";

export default function CreateTaxMasterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create Tax Master</h1>
        <p className="text-sm text-slate-500">Add a new GST tax master record.</p>
      </div>
      <TaxMasterForm />
    </div>
  );
}
