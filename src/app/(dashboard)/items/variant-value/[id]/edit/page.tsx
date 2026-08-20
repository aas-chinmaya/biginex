import VariantValueForm from "@/modules/items/components/masters/variant-value/VariantValueForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVariantValuePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Variant Value</h1>
        <p className="text-sm text-slate-500">Update the selected variant value master record.</p>
      </div>
      <VariantValueForm variantValueId={id} />
    </div>
  );
}
