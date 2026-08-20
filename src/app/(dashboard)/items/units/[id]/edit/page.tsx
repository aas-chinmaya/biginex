import UnitForm from "@/modules/items/components/masters/unit/UnitForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUnitPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Unit</h1>
        <p className="text-sm text-slate-500">Update the selected unit master record.</p>
      </div>
      <UnitForm unitId={id} />
    </div>
  );
}
