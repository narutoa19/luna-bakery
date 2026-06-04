import { getFeaturedProducts, getAllActiveProducts } from "@/lib/db";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ExpandableProducts } from "@/components/home/ExpandableProducts";
import { BrandStory } from "@/components/home/BrandStory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const allProducts = await getAllActiveProducts();

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featured} />
      <ExpandableProducts products={allProducts} />
      <BrandStory />
    </>
  );
}
