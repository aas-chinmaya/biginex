import TaxMasterForm from "@/modules/items/components/masters/tax-master/TaxMasterForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaxMasterPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Tax Master</h1>
        <p className="text-sm text-slate-500">Update the selected GST tax master record.</p>
      </div>
      <TaxMasterForm taxMasterId={id} />
    </div>
  );
}
