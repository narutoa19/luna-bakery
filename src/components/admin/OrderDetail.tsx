"use client";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

interface Props {
  order: Order;
  onBack: () => void;
  onStatusChange: (status: OrderStatus) => void;
}

export function OrderDetail({ order, onBack, onStatusChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs text-wood-light hover:text-wood">← 返回</button>
        <h2 className="text-sm font-serif font-bold text-wood tracking-[2px]">订单详情 {order.id}</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["pending", "confirmed", "completed"] as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            disabled={order.status === s}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              order.status === s
                ? "bg-wood text-cream-50"
                : "bg-white text-wood-light border border-gold-light"
            }`}
          >
            {order.status === s && "✓ "}
            {s === "pending" ? "🆕 待确认" : s === "confirmed" ? "✅ 标记已确认" : "📦 标记已完成"}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <label className="text-[10px] text-gold block mb-1">客户信息</label>
        <div className="text-xs text-wood">👤 {order.customer_name} · 📱 {order.customer_phone}</div>
        <div className="text-[10px] text-wood-light mt-1">下单时间：{formatDate(order.created_at)}</div>
      </div>

      <div className="card p-4">
        <label className="text-[10px] text-gold block mb-2">订购产品</label>
        {order.items.map((item, i) => (
          <div key={i} className="text-xs text-wood mb-1.5 flex justify-between">
            <span>{item.name} × {item.quantity}{item.size ? ` (${item.size})` : ""}</span>
            <span className="text-gold">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-gold-light mt-3 pt-3 flex justify-between text-sm font-bold">
          <span className="text-wood">合计</span>
          <span className="text-gold">{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {order.notes && (
        <div className="bg-gradient-to-r from-cream-100 to-cream-50 border border-gold-light border-l-[3px] border-l-gold rounded-card p-4">
          <label className="text-[10px] text-gold block mb-1">✍️ 客户备注（核心信息）</label>
          <p className="text-sm text-wood font-serif leading-relaxed">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
