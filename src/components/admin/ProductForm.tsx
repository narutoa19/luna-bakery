"use client";
import { useState, FormEvent, useRef, useCallback } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TAG_OPTIONS = ["🔥 热销", "🆕 新品", "⭐ 推荐"];
  const [tags, setTags] = useState<string[]>(product?.tags || []);

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    const token = localStorage.getItem("luna-admin-token");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "上传失败");
        return;
      }
      const data = await res.json();
      setImageUrl(data.url);
    } catch {
      alert("上传失败，请检查网络");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

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

      {/* Image upload */}
      <div>
        <label className="text-[10px] text-wood font-semibold tracking-wider block mb-1.5">📸 产品图片</label>
        {imageUrl ? (
          <div className="relative mb-2">
            <img src={imageUrl} alt="预览" className="w-full h-48 object-cover rounded-lg border border-gold-light" />
            <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded hover:bg-black/70">移除</button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-gold bg-gold/5" : "border-gold-light hover:border-gold/50"} ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="text-3xl mb-2">{uploading ? "⏳" : "📷"}</div>
            <div className="text-xs text-wood-light">{uploading ? "上传中..." : "点击上传或拖拽图片到此处"}</div>
            <div className="text-[10px] text-gold mt-1">支持 JPG/PNG/WebP，最大 5MB</div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file); }} />
        <div className="mt-2">
          <Input placeholder="或直接粘贴图片URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
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
