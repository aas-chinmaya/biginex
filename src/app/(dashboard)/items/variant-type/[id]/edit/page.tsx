import VariantTypeForm from "@/modules/items/components/masters/variant-type/VariantTypeForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVariantTypePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Variant Type</h1>
        <p className="text-sm text-slate-500">Update the selected variant type master record.</p>
      </div>
      <VariantTypeForm variantTypeId={id} />
    </div>
  );
}
