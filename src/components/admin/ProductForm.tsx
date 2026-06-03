"use client";
import { useState, FormEvent } from "react";
import { Product, ProductCategory, CATEGORIES, CATEGORY_ICONS } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

interface Props {
  product?: Product | null;
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface ProductFormData {
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  image_url: string;
}

export function ProductForm({ product, onSave, onCancel, loading }: Props) {
  const isEdit = !!product;
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState<ProductCategory>(product?.category || "蛋糕");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");

  const TAG_OPTIONS = ["🔥 热销", "🆕 新品", "⭐ 推荐"];
  const [tags, setTags] = useState<string[]>(product?.tags || []);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isNaN(Number(price))) return;

    await onSave({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      tags,
      is_active: isActive,
      is_featured: isFeatured,
      image_url: imageUrl.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-serif font-bold text-wood tracking-[2px]">
        {isEdit ? "编辑产品" : "新增产品"}
      </h2>

      <div>
        <label className="text-[10px] text-wood font-semibold tracking-wider block mb-1.5">📸 产品图片</label>
        <Input placeholder="粘贴图片URL（后续支持直接上传）" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <Input label="产品名称" placeholder="如：云朵草莓蛋糕" value={name} onChange={(e) => setName(e.target.value)} required />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-wood font-semibold tracking-wider block mb-1.5">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="input-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
            ))}
          </select>
        </div>
        <Input label="价格 ¥" type="number" placeholder="238" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>

      <Textarea label="产品简介" placeholder="简短介绍食材、口感、卖点..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

      <div>
        <label className="text-[10px] text-wood font-semibold tracking-wider block mb-1.5">标签（可选）</label>
        <div className="flex gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] border transition-colors ${
                tags.includes(tag)
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-gold-light text-wood-light"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gold-light">
          <div>
            <div className="text-xs font-semibold text-wood">上架状态</div>
            <div className="text-[10px] text-wood-light">关闭后前台不显示</div>
          </div>
          <Toggle checked={isActive} onChange={setIsActive} />
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gold-light">
          <div>
            <div className="text-xs font-semibold text-wood">明星产品</div>
            <div className="text-[10px] text-wood-light">显示在首页明星产品区</div>
          </div>
          <Toggle checked={isFeatured} onChange={setIsFeatured} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
          {loading ? "保存中..." : isEdit ? "💾 保存修改" : "🚀 立即发布"}
        </Button>
      </div>
    </form>
  );
}
