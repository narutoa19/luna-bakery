"use client";
import { useEffect, useState } from "react";
import { Product, ProductCategory } from "@/types";
import { ProductList } from "@/components/admin/ProductList";
import { ProductForm, ProductFormData } from "@/components/admin/ProductForm";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { CategoryFilter } from "@/components/admin/CategoryFilter";
import { Button } from "@/components/ui/Button";
import { ToastProvider, useToast } from "@/components/ui/Toast";

function ProductsPageInner() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProductCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = filter ? products.filter((p) => p.category === filter) : products;

  const fetchProducts = async () => {
    const token = localStorage.getItem("luna-admin-token");
    try {
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (data: ProductFormData) => {
    setSaving(true);
    const token = localStorage.getItem("luna-admin-token");
    try {
      if (editingProduct) {
        await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        toast("产品已更新", "success");
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        toast("产品已发布", "success");
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast("操作失败", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setSaving(true);
    const token = localStorage.getItem("luna-admin-token");
    try {
      await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast("产品已删除", "success");
      setDeletingProduct(null);
      fetchProducts();
    } catch {
      toast("删除失败", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    const token = localStorage.getItem("luna-admin-token");
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    fetchProducts();
  };

  if (showForm || editingProduct) {
    return (
      <div className="max-w-md mx-auto">
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
          loading={saving}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-wood-light">共 {products.length} 款产品 · {products.filter((p) => p.is_active).length} 款在售</div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          + 新增产品
        </Button>
      </div>

      <CategoryFilter selected={filter} onSelect={setFilter} />

      {loading ? (
        <div className="text-center py-12 text-wood-light text-sm">加载中...</div>
      ) : (
        <ProductList
          products={filtered}
          onEdit={(p) => setEditingProduct(p)}
          onDelete={(p) => setDeletingProduct(p)}
          onToggleActive={handleToggleActive}
        />
      )}

      <DeleteConfirmModal
        open={!!deletingProduct}
        productName={deletingProduct?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
        loading={saving}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ToastProvider>
      <ProductsPageInner />
    </ToastProvider>
  );
}
