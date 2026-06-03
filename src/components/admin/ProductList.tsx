"use client";
import { Product, CATEGORY_ICONS } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}

export function ProductList({ products, onEdit, onDelete, onToggleActive }: Props) {
  return (
    <div className="space-y-2">
      {products.length === 0 && (
        <p className="text-center text-wood-light text-xs py-8">暂无产品</p>
      )}
      {products.map((p) => (
        <div
          key={p.id}
          className={`card p-3 flex items-center gap-3 ${!p.is_active ? "opacity-50" : ""}`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            {CATEGORY_ICONS[p.category]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-wood truncate">{p.name}</div>
            <div className="text-[10px] text-wood-light">
              {CATEGORY_ICONS[p.category]} {p.category}
              <span className={`ml-2 ${p.is_active ? "text-green-600" : "text-gray-400"}`}>
                {p.is_active ? "● 在售" : "● 已下架"}
              </span>
            </div>
          </div>

          <div className={`text-xs font-bold flex-shrink-0 ${p.is_active ? "text-gold" : "text-gray-400 line-through"}`}>
            {formatPrice(p.price)}
          </div>

          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => onEdit(p)} className="w-7 h-7 rounded-md border border-gold-light text-[10px] flex items-center justify-center hover:bg-cream-100" title="编辑">✏️</button>
            <button onClick={() => onToggleActive(p)} className="w-7 h-7 rounded-md border border-gold-light text-[10px] flex items-center justify-center hover:bg-cream-100" title={p.is_active ? "下架" : "上架"}>{p.is_active ? "⬇" : "⬆"}</button>
            <button onClick={() => onDelete(p)} className="w-7 h-7 rounded-md border border-red-200 text-[10px] text-red-400 flex items-center justify-center hover:bg-red-50" title="删除">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}
