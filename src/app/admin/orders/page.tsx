"use client";
import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/types";
import { OrderList } from "@/components/admin/OrderList";
import { OrderDetail } from "@/components/admin/OrderDetail";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("luna-admin-token");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const token = localStorage.getItem("luna-admin-token");
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : null);
    }
  };

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => { setSelectedOrder(null); fetchOrders(); }}
        onStatusChange={(status) => handleStatusChange(selectedOrder.id, status)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-sm font-semibold text-wood">📋 订单管理</h1>
        <div className="text-[10px] text-wood-light mt-1">共 {orders.length} 个订单</div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-wood-light text-sm">加载中...</div>
      ) : (
        <OrderList
          orders={orders}
          onSelect={setSelectedOrder}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}
    </div>
  );
}
