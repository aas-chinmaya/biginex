import SubCategoryForm from "@/modules/items/components/masters/sub-category/SubCategoryForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSubCategoryPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Sub Category</h1>
        <p className="text-sm text-slate-500">Update the selected sub-category master record.</p>
      </div>
      <SubCategoryForm subCategoryId={id} />
    </div>
  );
}
