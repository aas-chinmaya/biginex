import CategoryForm from "@/modules/items/components/masters/category/CategoryForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
        <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Category</h1>
        <p className="text-sm text-slate-500">Update the selected category master record.</p>
      </div>
      <CategoryForm categoryId={id} />
    </div>
  );
}