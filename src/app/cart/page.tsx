"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, totalAmount, totalItems, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-serif text-lg font-bold text-wood tracking-[3px] mb-6">🛒 购物车</h1>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onUpdateQuantity={(qty) => updateQuantity(item.product.id, qty)}
            onRemove={() => removeItem(item.product.id)}
          />
        ))}
      </div>
      <CartSummary totalAmount={totalAmount} itemCount={totalItems} />
      <Link href="/checkout" className="block mt-6">
        <Button variant="primary" className="w-full">去结算 →</Button>
      </Link>
    </div>
  );
}
