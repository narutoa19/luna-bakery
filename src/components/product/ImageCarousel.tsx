"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/types";
import { ProductCategory } from "@/types";

interface Props {
  images: string[];
  category: ProductCategory;
  productName: string;
}

export function ImageCarousel({ images, category, productName }: Props) {
  const [current, setCurrent] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div className="relative w-full aspect-square bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center overflow-hidden">
        {hasImages ? (
          <img src={images[current]} alt={productName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">{CATEGORY_ICONS[category]}</span>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === current ? "bg-wood" : "bg-gold/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
