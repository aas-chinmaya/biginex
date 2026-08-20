import SubCategoryForm from "@/modules/items/components/masters/sub-category/SubCategoryForm";

export default function CreateSubCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Sub Category</h1>
        <p className="text-sm text-slate-500">Create a new sub-category master record.</p>
      </div>

      <SubCategoryForm />
    </div>
  );
}
