import ItemCard from "@/modules/items/components/products/ItemCard";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItemDetailsPage({ params }: Props) {
  const { id } = await params;

  console.log("Details Page id:", id);

  return <ItemCard productId={id} />;
}