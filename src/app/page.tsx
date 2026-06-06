import { getAllActiveProducts } from "@/lib/db";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ExpandableProducts } from "@/components/home/ExpandableProducts";
import { BrandStory } from "@/components/home/BrandStory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await getAllActiveProducts();
  const featured = allProducts.filter((p) => p.is_featured).slice(0, 4);

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featured} />
      <ExpandableProducts products={allProducts} />
      <BrandStory />
    </>
  );
}
