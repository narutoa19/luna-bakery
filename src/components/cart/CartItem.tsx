"use client";
import { CartItem as CartItemType, CATEGORY_ICONS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { QuantityControl } from "@/components/product/QuantityControl";

interface Props {
  item: CartItemType;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
  const icon = CATEGORY_ICONS[item.product.category];

  return (
    <div className="card p-3 flex gap-3">
      <div className="w-16 h-16 bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 relative">
        {item.product.image_url ? (
          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : null}
        <span className={item.product.image_url ? "absolute inset-0 flex items-center justify-center text-2xl" : "text-2xl"}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-wood truncate">{item.product.name}</h3>
            {item.size && <span className="text-[10px] text-wood-light">{item.size}</span>}
          </div>
          <button onClick={onRemove} className="text-xs text-wood-light/50 hover:text-red-500 ml-2">✕</button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-serif text-sm font-bold text-gold">
            {formatPrice(item.product.price * item.quantity)}
          </span>
          <QuantityControl quantity={item.quantity} onChange={onUpdateQuantity} />
        </div>
      </div>
    </div>
  );
}
