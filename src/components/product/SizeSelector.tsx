"use client";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface Size {
  label: string;
  price: number;
  servings: string;
}

interface Props {
  sizes: Size[];
  selected: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: Props) {
  return (
    <div>
      <label className="text-xs text-wood font-semibold tracking-wider mb-2 block">选择规格</label>
      <div className="flex gap-2">
        {sizes.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.label)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-center text-xs border transition-all",
              selected === s.label
                ? "border-gold bg-gold/5 text-wood"
                : "border-gold-light text-wood-light hover:border-gold/50"
            )}
          >
            <div className="font-semibold">{s.label}</div>
            <div className="text-[10px] mt-0.5">{formatPrice(s.price)}</div>
            <div className="text-[10px] text-wood-light/70">{s.servings}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
