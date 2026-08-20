import BrandForm from "@/modules/items/components/masters/brand/BrandForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Brand</h1>
        <p className="text-sm text-slate-500">Update the selected brand master record.</p>
      </div>
      <BrandForm brandId={id} />
    </div>
  );
}
