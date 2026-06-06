"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import type { Order } from "@/types";

interface DashboardData {
  newOrders: number;
  activeProducts: number;
  todayRevenue: number;
  recentOrders: Order[];
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

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    setError(false);
    const token = localStorage.getItem("luna-admin-token");
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((json) => setData(json))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return <div className="text-center py-12 text-wood-light text-sm">加载中...</div>;
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-sm mb-4">加载失败</p>
        <button onClick={fetchStats} className="btn-primary text-xs">
          重试
        </button>
      </div>
    );
  }

  // Defense: ensure recentOrders is an array
  const recentOrders = Array.isArray(data.recentOrders) ? data.recentOrders : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-sm font-semibold text-wood">👋 欢迎回来</h1>
        <p className="text-xs text-wood-light mt-1">鹿呐烘焙 · 管理后台</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard value={data.newOrders} label="🆕 新订单" accent />
        <StatCard value={data.activeProducts} label="🍰 在售产品" />
        <StatCard value={formatPrice(data.todayRevenue)} label="💰 今日收入" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/admin/products" className="bg-gradient-to-br from-wood to-[#5d4a3a] rounded-card p-5 text-white">
          <div className="text-2xl mb-1">🍰</div>
          <div className="text-sm font-semibold tracking-wider">添加新产品</div>
          <div className="text-[10px] opacity-70 mt-0.5">拍照→填信息→发布</div>
        </Link>
        <Link href="/admin/orders" className="card p-5 border border-gold-light">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-sm font-semibold text-wood tracking-wider">查看订单</div>
          <div className="text-[10px] text-wood-light mt-0.5">管理所有订单</div>
        </Link>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-wood tracking-wider mb-3">📌 最近订单</h2>
        <div className="space-y-2">
          {recentOrders.map((order) => {
            const items = safeItems(order);
            const phone = order.customer_phone || "";
            return (
              <Link
                key={order.id}
                href={`/admin/orders#${order.id}`}
                className="card p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    order.status === "pending" ? "bg-orange-400" :
                    order.status === "confirmed" ? "bg-blue-400" : "bg-green-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-wood truncate">
                    {items[0]?.name || "订单"}{items.length > 1 ? ` 等${items.length}件` : ""}
                  </div>
                  <div className="text-[10px] text-wood-light">
                    {order.customer_name || "未知"} · {phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")} · {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="text-xs font-bold text-gold flex-shrink-0">
                  {formatPrice(order.total_amount)}
                </div>
              </Link>
            );
          })}
          {recentOrders.length === 0 && (
            <p className="text-xs text-wood-light text-center py-4">暂无订单</p>
          )}
        </div>
      </div>
    </div>
  );
}
