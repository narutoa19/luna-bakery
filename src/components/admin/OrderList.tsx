"use client";
import { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
  statusFilter: OrderStatus | null;
  onStatusFilterChange: (s: OrderStatus | null) => void;
}

// Parse items if they come back as a JSON string (defense-in-depth)
function safeItems(order: Order): Array<{ name: string; product_id?: string; price?: number; quantity?: number; size?: string }> {
  try {
    const items = (order as unknown as Record<string, unknown>).items;
    if (typeof items === "string") {
      return JSON.parse(items);
    }
    if (Array.isArray(items)) {
      return items;
    }
  } catch {}
  return [];
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "待确认",
  confirmed: "已确认",
  completed: "已完成",
};

export function OrderList({ orders, onSelect, statusFilter, onStatusFilterChange }: Props) {
  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">
        {(["pending", "confirmed", "completed"] as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onStatusFilterChange(statusFilter === s ? null : s)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              statusFilter === s
                ? "bg-wood text-cream-50"
                : "bg-white text-wood-light border border-gold-light"
            }`}
          >
            {s === "pending" && "🆕"}{s === "confirmed" && "✅"}{s === "completed" && "📦"}{" "}
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center py-8 text-wood-light text-xs">暂无订单</p>
        )}
        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelect(order)}
            className="card p-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-wood-light">{order.id}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                order.status === "pending" ? "bg-orange-50 text-orange-600" :
                order.status === "confirmed" ? "bg-blue-50 text-blue-600" :
                "bg-green-50 text-green-600"
              }`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <div className="text-xs font-semibold text-wood mb-1">
              {safeItems(order).map((i) => `${i.name} ×${i.quantity}`).join("、")}
            </div>
            <div className="flex items-center justify-between text-[10px] text-wood-light">
              <span>{order.customer_name} · {order.customer_phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</span>
              <span className="text-xs font-bold text-gold">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
