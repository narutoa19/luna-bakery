"use client";
import { ProductCategory, CATEGORIES, CATEGORY_ICONS } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  selected: ProductCategory | null;
  onSelect: (cat: ProductCategory | null) => void;
}

export function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-3 py-1 rounded-full text-xs transition-colors",
          !selected ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
        )}
      >
        全部
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={cn(
            "px-3 py-1 rounded-full text-xs transition-colors",
            selected === cat ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
          )}
        >
          {CATEGORY_ICONS[cat]} {cat}
        </button>
      ))}
    </div>
  );
}
