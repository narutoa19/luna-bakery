"use client";
import { useState } from "react";
import Link from "next/link";
import { Product, CATEGORY_ICONS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { ImageCarousel } from "@/components/product/ImageCarousel";
import { QuantityControl } from "@/components/product/QuantityControl";

interface Props {
  product: Product;
}

// For now, simple single size. Cake category gets size options.
const CAKE_SIZES = [
  { label: "6寸", price: 0, servings: "2-3人" },
  { label: "8寸", price: 100, servings: "4-6人" },
  { label: "10寸", price: 230, servings: "8-10人" },
];

export function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("6寸");

  const hasSizes = product.category === "蛋糕";
  const currentPrice = hasSizes
    ? product.price + (CAKE_SIZES.find((s) => s.label === selectedSize)?.price ?? 0)
    : product.price;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
    toast("已加入购物车", "success");
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Back nav */}
      <div className="px-4 py-3">
        <Link href="/" className="text-xs text-wood-light hover:text-wood flex items-center gap-1">
          ← 返回产品列表
        </Link>
      </div>

      {/* Image carousel */}
      <ImageCarousel images={product.images} category={product.category} productName={product.name} />

      {/* Product info */}
      <div className="px-4 py-6 space-y-4">
        {/* Title & tags */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-serif text-xl font-bold text-wood tracking-[2px]">{product.name}</h1>
            <p className="text-[10px] text-gold tracking-wider mt-0.5">
              {CATEGORY_ICONS[product.category]} {product.category}
            </p>
          </div>
          {product.tags.length > 0 && (
            <span className="bg-cream-100 px-2 py-1 rounded text-[10px] text-wood-light">
              {product.tags[0]}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-gold">{formatPrice(currentPrice)}</span>
          {hasSizes && currentPrice !== product.price && (
            <>
              <span className="text-xs text-wood-light line-through">{formatPrice(product.price)}</span>
              <span className="text-[10px] text-white bg-gold px-1.5 py-0.5 rounded">8折</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-wood-light leading-relaxed">{product.description}</p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />

        {/* Size selector (cake only) */}
        {hasSizes && (
          <div>
            <label className="text-xs text-wood font-semibold tracking-wider mb-2 block">选择规格</label>
            <div className="flex gap-2">
              {CAKE_SIZES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s.label)}
                  className={`flex-1 py-2.5 rounded-lg text-center text-xs border transition-all ${
                    selectedSize === s.label
                      ? "border-gold bg-gold/5 text-wood"
                      : "border-gold-light text-wood-light"
                  }`}
                >
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-[10px] mt-0.5">{formatPrice(product.price + s.price)}</div>
                  <div className="text-[10px] text-wood-light/70">{s.servings}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <QuantityControl quantity={quantity} onChange={setQuantity} />

        {/* Notes hint */}
        <div className="bg-cream-100 rounded-lg p-3 flex items-center gap-3">
          <span className="text-lg">✍️</span>
          <div>
            <div className="text-xs text-wood font-semibold">需要定制祝福语？</div>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <div className="text-[10px] text-wood-light">下单时可填写备注，如"生日快乐，小鹿"</div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
            加入购物车
          </Button>
          <Button
            variant="primary"
            className="flex-[1.5]"
            onClick={() => { handleAddToCart(); window.location.href = "/cart"; }}
          >
            立即购买
          </Button>
        </div>
      </div>
    </div>
  );
}
