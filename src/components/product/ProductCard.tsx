import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const icon = CATEGORY_ICONS[product.category];

  return (
    <Link href={`/product/${product.id}`} className="card p-3 block hover:shadow-md transition-shadow group">
      {/* Product image placeholder */}
      <div className="w-full aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-5xl mb-3 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="group-hover:scale-110 transition-transform">{icon}</span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold text-wood truncate">{product.name}</h3>
          {product.tags.length > 0 && (
            <span className="text-[10px] text-gold whitespace-nowrap ml-2">{product.tags[0]}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-wood-light">{icon} {product.category}</span>
          <span className="font-serif text-base font-bold text-gold">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
