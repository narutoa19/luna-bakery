"use client";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Props {
  orderId: string;
  totalAmount: number;
}

export function SuccessView({ orderId, totalAmount }: Props) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full mx-auto mb-6 flex items-center justify-center text-2xl text-white">
        ✓
      </div>
      <h1 className="font-serif text-xl font-bold text-wood tracking-[2px] mb-2">下单成功！</h1>
      <p className="text-xs text-wood-light mb-8">我们会尽快与您联系确认订单</p>

      <div className="card p-4 text-left mb-6">
        <div className="space-y-3">
          <div>
            <div className="text-[10px] text-gold mb-0.5">订单编号</div>
            <div className="text-sm font-semibold text-wood">{orderId}</div>
          </div>
          <div>
            <div className="text-[10px] text-gold mb-0.5">订单金额</div>
            <div className="text-lg font-bold text-gold font-serif">{formatPrice(totalAmount)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gold mb-0.5">预计确认</div>
            <div className="text-xs text-wood-light">下单后2小时内与您确认</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">查看订单</Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="primary" className="w-full">继续逛逛</Button>
        </Link>
      </div>
    </div>
  );
}
