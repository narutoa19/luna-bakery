"use client";
interface Props {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export function QuantityControl({ quantity, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-wood font-semibold tracking-wider">数量</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          className="w-7 h-7 rounded-full border border-gold-light flex items-center justify-center text-wood-light hover:border-gold disabled:opacity-30"
        >
          −
        </button>
        <span className="text-sm font-semibold text-wood w-6 text-center">{quantity}</span>
        <button
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="w-7 h-7 rounded-full border border-gold-light flex items-center justify-center text-wood-light hover:border-gold disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
