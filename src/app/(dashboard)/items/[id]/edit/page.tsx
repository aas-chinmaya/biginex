import ItemForm from "@/modules/items/components/products/ItemForm";
 

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EdititemPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Product
        </h1>

        <p className="text-gray-500">
          Update Product Information
        </p>
      </div>

      <ItemForm productId={id} />
    </div>
  );
}