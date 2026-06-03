import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="featured" className="py-12 px-4 bg-cream-50">
      <div className="max-w-lg mx-auto">
        <h2 className="font-serif text-2xl text-wood tracking-[3px] text-center mb-2">明星产品</h2>
        <p className="text-xs text-wood-light text-center mb-8">每一款，都是鹿的用心之作</p>

        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
