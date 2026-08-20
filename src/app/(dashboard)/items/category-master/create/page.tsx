import CategoryForm from "@/modules/items/components/masters/category/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Category</h1>
        <p className="text-sm text-slate-500">Create a new category master record.</p>
      </div>

      <CategoryForm />
    </div>
  );
}
