"use client";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export function OrderSummary() {
  const { items, totalAmount } = useCart();
  const shipping = totalAmount >= 99 ? 0 : 15;

  return (
    <div className="card p-4">
      <h3 className="text-xs text-wood font-semibold tracking-wider mb-3">📋 订单摘要</h3>
      <div className="space-y-1.5 text-xs">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between">
            <span className="text-wood-light truncate mr-4">
              {item.product.name}{item.size ? ` (${item.size})` : ""} × {item.quantity}
            </span>
            <span className="text-wood flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gold-light mt-3 pt-3 flex justify-between text-sm font-bold">
        <span className="text-wood">合计</span>
        <span className="text-gold">{formatPrice(totalAmount + shipping)}</span>
      </div>
    </div>
  );
}
