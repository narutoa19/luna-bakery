import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import { ProductDetailClient } from "./client";

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
