"use client";
import { formatPrice } from "@/lib/utils";

interface Props {
  totalAmount: number;
  itemCount: number;
}

export function CartSummary({ totalAmount, itemCount }: Props) {
  const freeShippingThreshold = 99;
  const shippingCost = totalAmount >= freeShippingThreshold ? 0 : 15;
  const needsMoreForFree = freeShippingThreshold - totalAmount;

  return (
    <div className="space-y-2 pt-4 border-t border-gold-light">
      <div className="flex justify-between text-xs text-wood-light">
        <span>小计（{itemCount}件）</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-wood-light">运费</span>
        {shippingCost === 0 ? (
          <span className="text-green-600">免运费</span>
        ) : (
          <span className="text-wood-light">{formatPrice(shippingCost)}</span>
        )}
      </div>
      {needsMoreForFree > 0 && (
        <p className="text-[10px] text-gold">
          💡 再买{formatPrice(needsMoreForFree)}即可免运费
        </p>
      )}
      <div className="flex justify-between text-base font-bold pt-2 border-t border-gold-light">
        <span className="text-wood">合计</span>
        <span className="text-gold">{formatPrice(totalAmount + shippingCost)}</span>
      </div>
    </div>
  );
}
