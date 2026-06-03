"use client";
import { useState } from "react";
import { Product, ProductCategory, CATEGORIES, CATEGORY_ICONS } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface Props {
  products: Product[];
}

export function ExpandableProducts({ products }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<ProductCategory | null>(null);

  const filtered = filter ? products.filter((p) => p.category === filter) : products;

  // Blur effect: next 4 products after the first 4 (shown as blurred ghost)
  const ghostProducts = products.slice(4, 8);

  return (
    <section className="relative">
      {/* Blur gradient layer — only visible when collapsed */}
      {!expanded && ghostProducts.length > 0 && (
        <div className="relative pb-4">
          {/* Ghost cards (blurred) */}
          <div className="max-w-lg mx-auto px-4 grid grid-cols-2 gap-3" style={{ filter: "blur(6px)", transform: "scale(0.95)", opacity: 0.5, pointerEvents: "none" }}>
            {ghostProducts.map((p) => (
              <div key={p.id} className="card p-3">
                <div className="w-full aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-5xl">
                  {CATEGORY_ICONS[p.category]}
                </div>
                <div className="mt-2">
                  <div className="font-serif text-sm font-semibold text-wood">{p.name}</div>
                  <div className="text-xs text-gold font-bold">¥{p.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient mask */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: "linear-gradient(to bottom, transparent 0%, #faf7f2 70%, #faf7f2 100%)" }}
          />

          {/* CTA button */}
          <div className="absolute bottom-8 left-0 right-0 text-center z-10">
            <button
              onClick={() => setExpanded(true)}
              className="btn-primary shadow-lg"
            >
              查看全部{products.length}款产品 ↓
            </button>
          </div>
        </div>
      )}

      {/* Expanded view */}
      {expanded && (
        <div className="py-12 px-4 bg-cream-50">
          <div className="max-w-lg mx-auto">
            {/* Back link */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-wood-light hover:text-wood flex items-center gap-1"
              >
                ← 返回首页
              </button>
              <span className="text-xs text-wood-light">
                共 {products.length} 款产品
              </span>
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                  !filter ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
                }`}
              >
                全部
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat === filter ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    filter === cat ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Collapse button */}
            <div className="text-center mt-8 mb-4">
              <button
                onClick={() => { setExpanded(false); setFilter(null); }}
                className="text-xs text-wood-light hover:text-wood"
              >
                ↑ 收起
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
