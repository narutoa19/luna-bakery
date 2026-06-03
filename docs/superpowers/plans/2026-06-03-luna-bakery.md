# 鹿呐烘焙 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete bakery brand website (鹿呐烘焙) with product display, online ordering, and admin management — a Next.js 14 H5 web app deployable to Vercel with Supabase backend.

**Architecture:** Next.js 14 App Router (SSG for product pages, SSR for admin), Tailwind CSS with Warm Cream theme, Supabase (PostgreSQL + Storage + Auth), JWT-based admin auth via API Routes. Mobile-first responsive design (375px baseline), single shared layout with consistent warm cream (#faf7f2/#4a3728/#c4a882) palette.

**Tech Stack:** Next.js 14, Tailwind CSS 3, Supabase (PostgreSQL + Storage), JWT (jose), Vercel deployment

**Source Layout:**
```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, metadata, global providers)
│   ├── page.tsx                # Homepage (hero + featured + story + footer)
│   ├── globals.css             # Tailwind directives + custom theme tokens
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx        # Product detail page
│   ├── cart/
│   │   └── page.tsx            # Shopping cart
│   ├── checkout/
│   │   └── page.tsx            # Checkout (info + submit)
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts        # GET /api/products (public)
│   │   ├── orders/
│   │   │   └── route.ts        # POST /api/orders (public submit)
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── route.ts    # POST /api/admin/login
│   │   │   ├── products/
│   │   │   │   └── route.ts    # GET/POST /api/admin/products
│   │   │   ├── products/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts # PUT/DELETE /api/admin/products/[id]
│   │   │   └── orders/
│   │   │       ├── route.ts    # GET /api/admin/orders
│   │   │       └── [id]/
│   │   │           └── route.ts # PATCH /api/admin/orders/[id] (status update)
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── page.tsx        # Dashboard
│   │       ├── layout.tsx      # Admin layout (auth guard + sidebar)
│   │       ├── products/
│   │       │   └── page.tsx    # Product CRUD list
│   │       └── orders/
│   │           └── page.tsx    # Order management
│   └── admin/
│       ├── login/
│       │   └── page.tsx        # Admin login page
│       ├── page.tsx            # Dashboard
│       ├── layout.tsx          # Admin layout (auth guard + nav)
│       └── products/
│           └── page.tsx        # Product CRUD
│       └── orders/
│           └── page.tsx        # Order management
├── components/
│   ├── ui/                     # Shared UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toggle.tsx
│   │   └── Toast.tsx
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── home/                   # Homepage-specific
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── BrandStory.tsx
│   │   └── ExpandableProducts.tsx
│   ├── product/                # Product components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ImageCarousel.tsx
│   │   ├── SizeSelector.tsx
│   │   └── QuantityControl.tsx
│   ├── cart/                   # Cart components
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── EmptyCart.tsx
│   ├── checkout/               # Checkout components
│   │   ├── ContactForm.tsx
│   │   ├── NotesInput.tsx
│   │   ├── OrderSummary.tsx
│   │   └── SuccessView.tsx
│   └── admin/                  # Admin components
│       ├── StatCard.tsx
│       ├── ProductForm.tsx
│       ├── ProductList.tsx
│       ├── OrderList.tsx
│       ├── OrderDetail.tsx
│       ├── DeleteConfirmModal.tsx
│       └── CategoryFilter.tsx
├── lib/
│   ├── supabase.ts             # Supabase client (server + browser)
│   ├── db.ts                   # Database query functions
│   ├── auth.ts                 # JWT auth helpers
│   ├── cart.ts                 # Cart state management (useContext)
│   └── utils.ts                # Formatting, cn() helper
├── context/
│   └── CartContext.tsx          # Cart provider
└── types/
    └── index.ts                # Shared TypeScript types
```

---

## Phase 1: Project Scaffold & Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`
- Create: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/types/index.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create Next.js project via CLI**

Run:
```bash
cd "c:/Users/30462/Desktop/my web"
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```
Expected: Project scaffolded with package.json, tsconfig, tailwind config

- [ ] **Step 2: Install additional dependencies**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr jose
npm install -D @types/node
```
Expected: Dependencies installed

- [ ] **Step 3: Configure Tailwind theme in [tailwind.config.ts](tailwind.config.ts)**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#faf7f2",
          100: "#f5f0e8",
          200: "#ede0d0",
        },
        wood: {
          DEFAULT: "#4a3728",
          light: "#8b7355",
        },
        gold: {
          DEFAULT: "#c4a882",
          dark: "#a88860",
          light: "#e8d5b0",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Noto Serif SC", "serif"],
        sans: ["PingFang SC", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Write global CSS in [src/app/globals.css](src/app/globals.css)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cream-50 text-wood font-sans antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-wood text-cream-50 rounded-btn px-6 py-3 text-sm tracking-widest
           hover:bg-opacity-90 transition-all duration-200 active:scale-[0.98];
  }
  .btn-outline {
    @apply border border-gold rounded-btn px-6 py-3 text-sm text-wood-light tracking-widest
           bg-white hover:bg-cream-100 transition-all duration-200 active:scale-[0.98];
  }
  .card {
    @apply bg-white rounded-card shadow-sm;
  }
  .input-field {
    @apply w-full px-3 py-2.5 border border-gold-light rounded-lg text-sm
           bg-white text-wood placeholder:text-wood-light/50
           focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 5: Write types in [src/types/index.ts](src/types/index.ts)**

```ts
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image_url: string;
  images: string[];
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export type ProductCategory = "蛋糕" | "面包" | "饼干" | "甜点" | "饮品";

export const CATEGORIES: ProductCategory[] = ["蛋糕", "面包", "饼干", "甜点", "饮品"];

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  "蛋糕": "🎂",
  "面包": "🥐",
  "饼干": "🍪",
  "甜点": "🍮",
  "饮品": "☕",
};

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export type OrderStatus = "pending" | "confirmed" | "completed";

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  notes: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

export interface AdminAuth {
  token: string;
  expires_at: number;
}
```

- [ ] **Step 6: Write utils in [src/lib/utils.ts](src/lib/utils.ts)**

```ts
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return `¥${price}`;
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function generateOrderId(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const d = now.getDate().toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `LN${y}${m}${d}${rand}`;
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind theme and types"
```

---

### Task 2: Supabase Client & Environment Setup

**Files:**
- Create: `.env.local.example`
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Create environment file [.env.local.example](.env.local.example)**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=luna2026
JWT_SECRET=your-random-secret-at-least-32-chars
```

- [ ] **Step 2: Write Supabase client in [src/lib/supabase.ts](src/lib/supabase.ts)**

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side (anon key, RLS-enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (service role, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Supabase client configuration"
```

---

## Phase 2: Database Schema & Seed

### Task 3: Database Schema (Supabase SQL)

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Write migration SQL in [supabase/schema.sql](supabase/schema.sql)**

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('蛋糕', '面包', '饼干', '甜点', '饮品')),
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id VARCHAR(20) PRIMARY KEY,
  customer_name VARCHAR(50) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  notes TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- RLS: Public read for active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

-- RLS: Admin full access (using service_role bypasses RLS)
CREATE POLICY "Admin full access" ON products
  FOR ALL USING (true);

-- RLS: Public can insert orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read own orders by phone" ON orders
  FOR SELECT USING (true);

-- Storage bucket for product images
-- Run these in Supabase Dashboard > Storage:
-- 1. Create bucket: "product-images" (public)
-- 2. Policy: Allow public SELECT, authenticated INSERT/UPDATE/DELETE

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 2: Write seed data SQL**

Append to `supabase/schema.sql`:

```sql
-- Seed data: sample products
INSERT INTO products (name, category, price, description, image_url, tags, is_featured) VALUES
('云朵草莓蛋糕', '蛋糕', 238, '新鲜草莓与轻盈奶油的完美邂逅。采用日本进口鲜奶油，搭配当季新鲜草莓，每一口都是云朵般的绵密。', '/images/placeholder-cake.jpg', ARRAY['🔥 热销', '⭐ 推荐'], true),
('鹿角可颂', '面包', 28, '手工开酥，层层分明。法国AOP黄油，72小时低温发酵，外酥内软。', '/images/placeholder-croissant.jpg', ARRAY['🔥 热销'], true),
('森林莓果吐司', '面包', 42, '天然酵种发酵，莓果干与坚果交织。无添加，每一片都是森林的味道。', '/images/placeholder-toast.jpg', ARRAY['🆕 新品'], true),
('鹿印曲奇', '饼干', 58, '黄油曲奇搭配杏仁片，鹿形压花。酥脆香甜，下午茶绝配。', '/images/placeholder-cookie.jpg', ARRAY['⭐ 推荐'], true),
('焦糖布丁', '甜点', 32, '法式焦糖布丁，香草籽加持。丝滑细腻，焦糖脆壳下的温柔。', '/images/placeholder-pudding.jpg', ARRAY['🆕 新品'], false),
('抹茶红豆蛋糕卷', '蛋糕', 168, '日本宇治抹茶与北海道红豆。松软蛋糕体，每一口都是京都的味道。', '/images/placeholder-matcha.jpg', ARRAY['⭐ 推荐'], false);
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add database schema and seed data"
```

---

## Phase 3: Shared Components & Layout

### Task 4: UI Primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/Toggle.tsx`, `src/components/ui/Toast.tsx`

- [ ] **Step 1: Write Button component [src/components/ui/Button.tsx](src/components/ui/Button.tsx)**

```tsx
"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-btn font-sans tracking-widest transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-wood text-cream-50 hover:bg-opacity-90",
    outline: "border border-gold bg-white text-wood-light hover:bg-cream-100",
    danger: "bg-red-100 text-red-600 border border-red-200 hover:bg-red-200",
    ghost: "text-wood-light hover:bg-cream-100",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Write Input component [src/components/ui/Input.tsx](src/components/ui/Input.tsx)**

```tsx
"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-wood font-semibold tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn("input-field", error && "border-red-300", className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-wood font-semibold tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <textarea ref={ref} className={cn("input-field resize-none", className)} {...props} />
    </div>
  )
);
Textarea.displayName = "Textarea";
```

- [ ] **Step 3: Write Modal component [src/components/ui/Modal.tsx](src/components/ui/Modal.tsx)**

```tsx
"use client";
import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={cn("bg-cream-50 rounded-card p-6 max-w-md w-full shadow-lg animate-in", className)}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write Toggle component [src/components/ui/Toggle.tsx](src/components/ui/Toggle.tsx)**

```tsx
"use client";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-gold" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
```

- [ ] **Step 5: Write Toast component [src/components/ui/Toast.tsx](src/components/ui/Toast.tsx)**

```tsx
"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "px-4 py-3 rounded-lg text-sm shadow-md animate-in",
              t.type === "success" && "bg-green-50 text-green-800 border border-green-200",
              t.type === "error" && "bg-red-50 text-red-800 border border-red-200",
              t.type === "info" && "bg-cream-100 text-wood border border-gold-light"
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add shared UI primitives (Button, Input, Modal, Toggle, Toast)"
```

---

### Task 5: Layout Components

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`

- [ ] **Step 1: Write Header component [src/components/layout/Header.tsx](src/components/layout/Header.tsx)**

```tsx
"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-cream-50/80 backdrop-blur-md border-b border-gold-light/30">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦌</span>
          <span className="text-base font-serif font-bold text-wood tracking-[3px]">鹿呐烘焙</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-white text-[10px] rounded-full flex items-center justify-center font-sans">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Write Footer component [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)**

```tsx
export function Footer() {
  return (
    <footer className="bg-wood text-cream-100 py-10 mt-auto">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="text-3xl mb-3">🦌</div>
        <h3 className="font-serif text-lg tracking-[4px] mb-2">鹿呐烘焙</h3>
        <p className="text-xs text-cream-200/60 mb-6">用鹿的灵韵，焙出生活的甜</p>
        <div className="flex justify-center gap-6 text-xs text-cream-200/50 mb-4">
          <span>📍 地址待填写</span>
          <span>📞 电话待填写</span>
        </div>
        <p className="text-[10px] text-cream-200/30">
          © 2026 鹿呐烘焙 All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Header and Footer layout components"
```

---

### Task 6: Cart Context & Root Layout

**Files:**
- Create: `src/context/CartContext.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write Cart context [src/context/CartContext.tsx](src/context/CartContext.tsx)**

```tsx
"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("luna-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("luna-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, size }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalAmount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
```

- [ ] **Step 2: Update Root layout [src/app/layout.tsx](src/app/layout.tsx)**

```tsx
import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "鹿呐烘焙",
  description: "用鹿的灵韵，焙出生活的甜",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Cart context provider and root layout"
```

---

## Phase 4: Frontend Pages

### Task 7: Homepage — Hero & Brand Story

**Files:**
- Create: `src/components/home/HeroSection.tsx`, `src/components/home/BrandStory.tsx`
- Create: `src/app/page.tsx` (partial)

- [ ] **Step 1: Write Hero section [src/components/home/HeroSection.tsx](src/components/home/HeroSection.tsx)**

```tsx
export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-200/40 via-cream-50 to-cream-50" />
      {/* Decorative blur orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-48 h-48 bg-cream-200/40 rounded-full blur-3xl" />

      <div className="relative max-w-lg mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="text-5xl sm:text-6xl mb-6 animate-in">🦌</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wood tracking-[6px] mb-4">
          鹿呐烘焙
        </h1>
        <p className="text-sm text-gold tracking-[4px] mb-3 font-serif">
          LUNA BAKERY
        </p>
        <p className="text-wood-light text-sm leading-relaxed max-w-xs mx-auto">
          用鹿的灵韵，焙出生活的甜
        </p>
        <div className="mt-8">
          <a href="#featured" className="btn-primary inline-block">
            探索我们的产品
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write Brand Story section [src/components/home/BrandStory.tsx](src/components/home/BrandStory.tsx)**

```tsx
export function BrandStory() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-2xl mb-4">🌿</div>
        <h2 className="font-serif text-2xl text-wood tracking-[3px] mb-6">我们的故事</h2>
        <p className="text-wood-light text-sm leading-loose max-w-sm mx-auto">
          鹿呐烘焙，诞生于对自然的敬畏与对甜点的热爱。
          我们相信，每一份甜点都应该是大自然的馈赠——
          选用当季鲜果、进口乳制品、天然原料，
          用匠人的双手，焙出温暖人心的味道。
        </p>
        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <div className="font-serif text-2xl text-gold font-bold">100%</div>
            <div className="text-xs text-wood-light mt-1">天然原料</div>
          </div>
          <div className="w-px bg-gold-light/50" />
          <div>
            <div className="font-serif text-2xl text-gold font-bold">当日</div>
            <div className="text-xs text-wood-light mt-1">新鲜现做</div>
          </div>
          <div className="w-px bg-gold-light/50" />
          <div>
            <div className="font-serif text-2xl text-gold font-bold">0</div>
            <div className="text-xs text-wood-light mt-1">添加剂</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Hero and Brand Story homepage sections"
```

---

### Task 8: Homepage — Featured Products & Blur Gradient Expand

**Files:**
- Create: `src/components/home/FeaturedProducts.tsx`, `src/components/home/ExpandableProducts.tsx`
- Create: `src/components/product/ProductCard.tsx`, `src/components/product/ProductGrid.tsx`
- Create: `src/lib/db.ts` (partial)

- [ ] **Step 1: Write DB query helpers [src/lib/db.ts](src/lib/db.ts) (partial)**

```ts
import { supabase, supabaseAdmin } from "./supabase";
import { Product, Order, OrderStatus, ProductCategory } from "@/types";

// -- Public Read --

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error) throw error;
  return data as Product[];
}

export async function getAllActiveProducts(category?: ProductCategory): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as Product;
}
```

- [ ] **Step 2: Write ProductCard [src/components/product/ProductCard.tsx](src/components/product/ProductCard.tsx)**

```tsx
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const icon = CATEGORY_ICONS[product.category];

  return (
    <Link href={`/product/${product.id}`} className="card p-3 block hover:shadow-md transition-shadow group">
      {/* Product image placeholder */}
      <div className="w-full aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-5xl mb-3 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="group-hover:scale-110 transition-transform">{icon}</span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold text-wood truncate">{product.name}</h3>
          {product.tags.length > 0 && (
            <span className="text-[10px] text-gold whitespace-nowrap ml-2">{product.tags[0]}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-wood-light">{icon} {product.category}</span>
          <span className="font-serif text-base font-bold text-gold">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Write FeaturedProducts section [src/components/home/FeaturedProducts.tsx](src/components/home/FeaturedProducts.tsx)**

```tsx
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="featured" className="py-12 px-4 bg-cream-50">
      <div className="max-w-lg mx-auto">
        <h2 className="font-serif text-2xl text-wood tracking-[3px] text-center mb-2">明星产品</h2>
        <p className="text-xs text-wood-light text-center mb-8">每一款，都是鹿的用心之作</p>

        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write ExpandableProducts [src/components/home/ExpandableProducts.tsx](src/components/home/ExpandableProducts.tsx)**

```tsx
"use client";
import { useState, useEffect } from "react";
import { Product, ProductCategory, CATEGORIES, CATEGORY_ICONS } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface Props {
  products: Product[];
}

export function ExpandableProducts({ products }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<ProductCategory | null>(null);

  const filtered = filter ? products.filter((p) => p.category === filter) : products;

  // Blur effect: next 4 products after the first 4 (shown as blurred ghost)
  const ghostProducts = products.slice(4, 8);

  return (
    <section className="relative">
      {/* Blur gradient layer — only visible when collapsed */}
      {!expanded && ghostProducts.length > 0 && (
        <div className="relative pb-4">
          {/* Ghost cards (blurred) */}
          <div className="max-w-lg mx-auto px-4 grid grid-cols-2 gap-3" style={{ filter: "blur(6px)", transform: "scale(0.95)", opacity: 0.5, pointerEvents: "none" }}>
            {ghostProducts.map((p) => (
              <div key={p.id} className="card p-3">
                <div className="w-full aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-5xl">
                  {CATEGORY_ICONS[p.category]}
                </div>
                <div className="mt-2">
                  <div className="font-serif text-sm font-semibold text-wood">{p.name}</div>
                  <div className="text-xs text-gold font-bold">¥{p.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient mask */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: "linear-gradient(to bottom, transparent 0%, #faf7f2 70%, #faf7f2 100%)" }}
          />

          {/* CTA button */}
          <div className="absolute bottom-8 left-0 right-0 text-center z-10">
            <button
              onClick={() => setExpanded(true)}
              className="btn-primary shadow-lg"
            >
              查看全部{products.length}款产品 ↓
            </button>
          </div>
        </div>
      )}

      {/* Expanded view */}
      {expanded && (
        <div className="py-12 px-4 bg-cream-50">
          <div className="max-w-lg mx-auto">
            {/* Back link */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-wood-light hover:text-wood flex items-center gap-1"
              >
                ← 返回首页
              </button>
              <span className="text-xs text-wood-light">
                共 {products.length} 款产品
              </span>
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                  !filter ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
                }`}
              >
                全部
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat === filter ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    filter === cat ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Collapse button */}
            <div className="text-center mt-8 mb-4">
              <button
                onClick={() => { setExpanded(false); setFilter(null); }}
                className="text-xs text-wood-light hover:text-wood"
              >
                ↑ 收起
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 5: Write homepage [src/app/page.tsx](src/app/page.tsx)**

```tsx
import { getFeaturedProducts, getAllActiveProducts } from "@/lib/db";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ExpandableProducts } from "@/components/home/ExpandableProducts";
import { BrandStory } from "@/components/home/BrandStory";

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const allProducts = await getAllActiveProducts();

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featured} />
      <ExpandableProducts products={allProducts} />
      <BrandStory />
    </>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add homepage with featured products, blur expand, and DB queries"
```

---

### Task 9: Product Detail Page

**Files:**
- Create: `src/app/product/[id]/page.tsx`
- Create: `src/components/product/ImageCarousel.tsx`, `src/components/product/SizeSelector.tsx`, `src/components/product/QuantityControl.tsx`

- [ ] **Step 1: Write ImageCarousel [src/components/product/ImageCarousel.tsx](src/components/product/ImageCarousel.tsx)**

```tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/types";
import { ProductCategory } from "@/types";

interface Props {
  images: string[];
  category: ProductCategory;
  productName: string;
}

export function ImageCarousel({ images, category, productName }: Props) {
  const [current, setCurrent] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div className="relative w-full aspect-square bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center overflow-hidden">
        {hasImages ? (
          <img src={images[current]} alt={productName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">{CATEGORY_ICONS[category]}</span>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === current ? "bg-wood" : "bg-gold/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write SizeSelector [src/components/product/SizeSelector.tsx](src/components/product/SizeSelector.tsx)**

```tsx
"use client";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface Size {
  label: string;
  price: number;
  servings: string;
}

interface Props {
  sizes: Size[];
  selected: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: Props) {
  return (
    <div>
      <label className="text-xs text-wood font-semibold tracking-wider mb-2 block">选择规格</label>
      <div className="flex gap-2">
        {sizes.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.label)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-center text-xs border transition-all",
              selected === s.label
                ? "border-gold bg-gold/5 text-wood"
                : "border-gold-light text-wood-light hover:border-gold/50"
            )}
          >
            <div className="font-semibold">{s.label}</div>
            <div className="text-[10px] mt-0.5">{formatPrice(s.price)}</div>
            <div className="text-[10px] text-wood-light/70">{s.servings}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write QuantityControl [src/components/product/QuantityControl.tsx](src/components/product/QuantityControl.tsx)**

```tsx
"use client";
interface Props {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export function QuantityControl({ quantity, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-wood font-semibold tracking-wider">数量</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          className="w-7 h-7 rounded-full border border-gold-light flex items-center justify-center text-wood-light hover:border-gold disabled:opacity-30"
        >
          −
        </button>
        <span className="text-sm font-semibold text-wood w-6 text-center">{quantity}</span>
        <button
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="w-7 h-7 rounded-full border border-gold-light flex items-center justify-center text-wood-light hover:border-gold disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write Product Detail page [src/app/product/[id]/page.tsx](src/app/product/[id]/page.tsx)**

```tsx
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import { ProductDetailClient } from "./client";

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
```

- [ ] **Step 5: Write client component for product detail [src/app/product/[id]/client.tsx](src/app/product/[id]/client.tsx)**

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Product, CATEGORY_ICONS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { ImageCarousel } from "@/components/product/ImageCarousel";
import { QuantityControl } from "@/components/product/QuantityControl";

interface Props {
  product: Product;
}

// For now, simple single size. Cake category gets size options.
const CAKE_SIZES = [
  { label: "6寸", price: 0, servings: "2-3人" },
  { label: "8寸", price: 100, servings: "4-6人" },
  { label: "10寸", price: 230, servings: "8-10人" },
];

export function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("6寸");

  const hasSizes = product.category === "蛋糕";
  const currentPrice = hasSizes
    ? product.price + (CAKE_SIZES.find((s) => s.label === selectedSize)?.price ?? 0)
    : product.price;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
    toast("已加入购物车", "success");
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Back nav */}
      <div className="px-4 py-3">
        <Link href="/" className="text-xs text-wood-light hover:text-wood flex items-center gap-1">
          ← 返回产品列表
        </Link>
      </div>

      {/* Image carousel */}
      <ImageCarousel images={product.images} category={product.category} productName={product.name} />

      {/* Product info */}
      <div className="px-4 py-6 space-y-4">
        {/* Title & tags */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-serif text-xl font-bold text-wood tracking-[2px]">{product.name}</h1>
            <p className="text-[10px] text-gold tracking-wider mt-0.5">
              {CATEGORY_ICONS[product.category]} {product.category}
            </p>
          </div>
          {product.tags.length > 0 && (
            <span className="bg-cream-100 px-2 py-1 rounded text-[10px] text-wood-light">
              {product.tags[0]}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-gold">{formatPrice(currentPrice)}</span>
          {hasSizes && currentPrice !== product.price && (
            <>
              <span className="text-xs text-wood-light line-through">{formatPrice(product.price)}</span>
              <span className="text-[10px] text-white bg-gold px-1.5 py-0.5 rounded">8折</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-wood-light leading-relaxed">{product.description}</p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />

        {/* Size selector (cake only) */}
        {hasSizes && (
          <div>
            <label className="text-xs text-wood font-semibold tracking-wider mb-2 block">选择规格</label>
            <div className="flex gap-2">
              {CAKE_SIZES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s.label)}
                  className={`flex-1 py-2.5 rounded-lg text-center text-xs border transition-all ${
                    selectedSize === s.label
                      ? "border-gold bg-gold/5 text-wood"
                      : "border-gold-light text-wood-light"
                  }`}
                >
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-[10px] mt-0.5">{formatPrice(product.price + s.price)}</div>
                  <div className="text-[10px] text-wood-light/70">{s.servings}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <QuantityControl quantity={quantity} onChange={setQuantity} />

        {/* Notes hint */}
        <div className="bg-cream-100 rounded-lg p-3 flex items-center gap-3">
          <span className="text-lg">✍️</span>
          <div>
            <div className="text-xs text-wood font-semibold">需要定制祝福语？</div>
            <div className="text-[10px] text-wood-light">下单时可填写备注，如"生日快乐，小鹿"</div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
            加入购物车
          </Button>
          <Button
            variant="primary"
            className="flex-[1.5]"
            onClick={() => { handleAddToCart(); window.location.href = "/cart"; }}
          >
            立即购买
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add product detail page with carousel, size selector, and add-to-cart"
```

---

### Task 10: Shopping Cart Page

**Files:**
- Create: `src/app/cart/page.tsx`
- Create: `src/components/cart/CartItem.tsx`, `src/components/cart/CartSummary.tsx`, `src/components/cart/EmptyCart.tsx`

- [ ] **Step 1: Write EmptyCart [src/components/cart/EmptyCart.tsx](src/components/cart/EmptyCart.tsx)**

```tsx
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-6">🛒</div>
      <h2 className="font-serif text-lg text-wood tracking-[2px] mb-2">购物车是空的</h2>
      <p className="text-xs text-wood-light mb-6">快去挑选喜欢的产品吧~</p>
      <Link href="/" className="btn-primary inline-block">
        去逛逛
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Write CartItem [src/components/cart/CartItem.tsx](src/components/cart/CartItem.tsx)**

```tsx
"use client";
import { CartItem as CartItemType, CATEGORY_ICONS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { QuantityControl } from "@/components/product/QuantityControl";

interface Props {
  item: CartItemType;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
  const icon = CATEGORY_ICONS[item.product.category];

  return (
    <div className="card p-3 flex gap-3">
      <div className="w-16 h-16 bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
        {item.product.image_url ? (
          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          icon
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-wood truncate">{item.product.name}</h3>
            {item.size && <span className="text-[10px] text-wood-light">{item.size}</span>}
          </div>
          <button onClick={onRemove} className="text-xs text-wood-light/50 hover:text-red-500 ml-2">✕</button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-serif text-sm font-bold text-gold">
            {formatPrice(item.product.price * item.quantity)}
          </span>
          <QuantityControl quantity={item.quantity} onChange={onUpdateQuantity} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write CartSummary [src/components/cart/CartSummary.tsx](src/components/cart/CartSummary.tsx)**

```tsx
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
```

- [ ] **Step 4: Write Cart page [src/app/cart/page.tsx](src/app/cart/page.tsx)**

```tsx
"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, totalAmount, totalItems, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-serif text-lg font-bold text-wood tracking-[3px] mb-6">🛒 购物车</h1>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onUpdateQuantity={(qty) => updateQuantity(item.product.id, qty)}
            onRemove={() => removeItem(item.product.id)}
          />
        ))}
      </div>

      <CartSummary totalAmount={totalAmount} itemCount={totalItems} />

      <Link href="/checkout" className="block mt-6">
        <Button variant="primary" className="w-full">
          去结算 →
        </Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add shopping cart page with item management and summary"
```

---

### Task 11: Checkout Page

**Files:**
- Create: `src/app/checkout/page.tsx`
- Create: `src/components/checkout/ContactForm.tsx`, `src/components/checkout/NotesInput.tsx`, `src/components/checkout/OrderSummary.tsx`, `src/components/checkout/SuccessView.tsx`
- Modify: `src/lib/db.ts` (add `createOrder`)

- [ ] **Step 1: Add createOrder to [src/lib/db.ts](src/lib/db.ts)**

Append:
```ts
import { generateOrderId } from "./utils";

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  notes: string;
  items: { product_id: string; name: string; price: number; quantity: number; size?: string }[];
  total_amount: number;
}): Promise<{ id: string }> {
  const id = generateOrderId();
  const { error } = await supabase
    .from("orders")
    .insert({
      id,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      notes: data.notes,
      items: JSON.stringify(data.items),
      total_amount: data.total_amount,
      status: "pending",
    });
  if (error) throw error;
  return { id };
}
```

- [ ] **Step 2: Write ContactForm [src/components/checkout/ContactForm.tsx](src/components/checkout/ContactForm.tsx)**

```tsx
"use client";
import { Input } from "@/components/ui/Input";

interface Props {
  phone: string;
  name: string;
  onPhoneChange: (v: string) => void;
  onNameChange: (v: string) => void;
  errors: { phone?: string; name?: string };
}

export function ContactForm({ phone, name, onPhoneChange, onNameChange, errors }: Props) {
  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-xs text-wood font-semibold tracking-wider">📱 联系信息</h3>
      <Input
        label="手机号"
        type="tel"
        placeholder="输入手机号"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        error={errors.phone}
      />
      <Input
        label="称呼"
        placeholder="如何称呼您？"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        error={errors.name}
      />
    </div>
  );
}
```

- [ ] **Step 3: Write NotesInput [src/components/checkout/NotesInput.tsx](src/components/checkout/NotesInput.tsx)**

```tsx
"use client";
import { Textarea } from "@/components/ui/Input";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function NotesInput({ value, onChange }: Props) {
  return (
    <div className="card p-4">
      <h3 className="text-xs text-wood font-semibold tracking-wider mb-2">✍️ 备注与定制要求</h3>
      <Textarea
        placeholder="定制祝福语、口味偏好、配送时间都可以写在这里..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
      <p className="text-[10px] text-gold mt-2">
        💡 定制祝福语、口味偏好、配送时间都可以写在这里
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Write OrderSummary [src/components/checkout/OrderSummary.tsx](src/components/checkout/OrderSummary.tsx)**

```tsx
"use client";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export function OrderSummary() {
  const { items, totalAmount } = useCart();
  const shipping = totalAmount >= 99 ? 0 : 15;

  return (
    <div className="card p-4">
      <h3 className="text-xs text-wood font-semibold tracking-wider mb-3">📋 订单摘要</h3>
      <div className="space-y-1.5 text-xs">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between">
            <span className="text-wood-light truncate mr-4">
              {item.product.name}{item.size ? ` (${item.size})` : ""} × {item.quantity}
            </span>
            <span className="text-wood flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gold-light mt-3 pt-3 flex justify-between text-sm font-bold">
        <span className="text-wood">合计</span>
        <span className="text-gold">{formatPrice(totalAmount + shipping)}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write SuccessView [src/components/checkout/SuccessView.tsx](src/components/checkout/SuccessView.tsx)**

```tsx
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
```

- [ ] **Step 6: Write Checkout page [src/app/checkout/page.tsx](src/app/checkout/page.tsx)**

```tsx
"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/checkout/ContactForm";
import { NotesInput } from "@/components/checkout/NotesInput";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { SuccessView } from "@/components/checkout/SuccessView";
import { EmptyCart } from "@/components/cart/EmptyCart";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; name?: string }>({});

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <SuccessView orderId={orderId} totalAmount={totalAmount} />
      </div>
    );
  }

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone.trim())) {
      errs.phone = "请输入正确的手机号";
    }
    if (!name.trim()) {
      errs.name = "请输入称呼";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          notes: notes.trim(),
          items: items.map((i) => ({
            product_id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            size: i.size,
          })),
          total_amount: totalAmount,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const data = await res.json();
      setOrderId(data.id);
      clearCart();
      setSubmitted(true);
    } catch {
      alert("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/cart" className="text-xs text-wood-light hover:text-wood">← 返回</Link>
        <h1 className="font-serif text-lg font-bold text-wood tracking-[2px]">确认订单</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ContactForm
          phone={phone}
          name={name}
          onPhoneChange={setPhone}
          onNameChange={setName}
          errors={errors}
        />
        <NotesInput value={notes} onChange={setNotes} />
        <OrderSummary />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "提交中..." : "提交订单"}
        </Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 7: Create API route for orders [src/app/api/orders/route.ts](src/app/api/orders/route.ts)**

```ts
import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, notes, items, total_amount } = body;

    if (!customer_name || !customer_phone || !items?.length || !total_amount) {
      return NextResponse.json({ error: "缺少必填信息" }, { status: 400 });
    }

    const result = await createOrder({ customer_name, customer_phone, notes, items, total_amount });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "提交失败，请重试" }, { status: 500 });
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add checkout page with three-step flow and order API"
```

---

## Phase 5: Admin Panel

### Task 12: Admin Auth (JWT + Login)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: Write auth helpers [src/lib/auth.ts](src/lib/auth.ts)**

```ts
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "luna2026";

export async function signToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function validatePassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}
```

- [ ] **Step 2: Write login API [src/app/api/admin/login/route.ts](src/app/api/admin/login/route.ts)**

```ts
import { NextRequest, NextResponse } from "next/server";
import { validatePassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || !(await validatePassword(password))) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const token = await signToken();
  return NextResponse.json({ token });
}
```

- [ ] **Step 3: Write admin login page [src/app/admin/login/page.tsx](src/app/admin/login/page.tsx)**

```tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("密码错误");
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("luna-admin-token", token);
      router.push("/admin");
    } catch {
      setError("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🦌</div>
          <h1 className="font-serif text-xl font-bold text-wood tracking-[4px]">鹿呐烘焙</h1>
          <p className="text-xs text-gold tracking-[2px] mt-1">管理后台</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field text-center"
              autoFocus
            />
            {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "验证中..." : "进入后台"}
          </Button>
          <p className="text-[10px] text-gold text-center">密码登录，简单安全</p>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write admin layout (auth guard) [src/app/admin/layout.tsx](src/app/admin/layout.tsx)**

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "📊 仪表盘" },
  { href: "/admin/products", label: "🍰 产品管理" },
  { href: "/admin/orders", label: "📋 订单管理" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Skip auth check on login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("luna-admin-token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthed(true);
    }
    setLoading(false);
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("luna-admin-token");
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-gold text-sm">加载中...</div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Admin header */}
      <header className="bg-white border-b border-gold-light/30 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🦌</span>
            <span className="text-sm font-serif font-bold text-wood tracking-[2px]">管理后台</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-wood-light hover:text-wood">
            退出
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab navigation */}
        <nav className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 text-center py-2 rounded-md text-xs transition-colors",
                pathname === item.href
                  ? "bg-wood text-cream-50"
                  : "text-wood-light hover:bg-cream-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add admin auth (JWT login) and admin layout with nav"
```

---

### Task 13: Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/StatCard.tsx`

- [ ] **Step 1: Add admin DB queries to [src/lib/db.ts](src/lib/db.ts)**

Append:
```ts
// -- Admin Queries --

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Product[];
}

export async function getAdminOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function getAdminOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(product)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const { error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getDashboardStats(): Promise<{
  newOrders: number;
  activeProducts: number;
  todayRevenue: number;
  recentOrders: Order[];
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersResult, productsResult] = await Promise.all([
    supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("products").select("*").eq("is_active", true),
  ]);

  const orders = (ordersResult.data || []) as Order[];
  const activeProducts = (productsResult.data || []).length;

  const newOrders = orders.filter((o) => o.status === "pending").length;
  const todayRevenue = orders
    .filter((o) => o.status !== "pending" && new Date(o.created_at) >= today)
    .reduce((sum, o) => sum + o.total_amount, 0);

  return {
    newOrders,
    activeProducts,
    todayRevenue,
    recentOrders: orders.slice(0, 5),
  };
}
```

- [ ] **Step 2: Write StatCard [src/components/admin/StatCard.tsx](src/components/admin/StatCard.tsx)**

```tsx
interface Props {
  value: string | number;
  label: string;
  accent?: boolean;
}

export function StatCard({ value, label, accent }: Props) {
  return (
    <div className="card p-4 text-center">
      <div className={`text-xl font-bold ${accent ? "text-gold" : "text-wood"}`}>{value}</div>
      <div className="text-[10px] text-wood-light mt-1">{label}</div>
    </div>
  );
}
```

- [ ] **Step 3: Write Admin API route [src/app/api/admin/stats/route.ts](src/app/api/admin/stats/route.ts)**

```ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "获取数据失败" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Write Dashboard page [src/app/admin/page.tsx](src/app/admin/page.tsx)**

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/Button";
import type { Order } from "@/types";

interface DashboardData {
  newOrders: number;
  activeProducts: number;
  todayRevenue: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("luna-admin-token");
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-wood-light text-sm">加载中...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500 text-sm">加载失败</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-sm font-semibold text-wood">👋 欢迎回来</h1>
        <p className="text-xs text-wood-light mt-1">鹿呐烘焙 · 管理后台</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard value={data.newOrders} label="🆕 新订单" accent />
        <StatCard value={data.activeProducts} label="🍰 在售产品" />
        <StatCard value={formatPrice(data.todayRevenue)} label="💰 今日收入" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
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

      {/* Recent orders */}
      <div>
        <h2 className="text-xs font-semibold text-wood tracking-wider mb-3">📌 最近订单</h2>
        <div className="space-y-2">
          {data.recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders#${order.id}`}
              className="card p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  order.status === "pending" ? "bg-orange-400" : "bg-green-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-wood truncate">
                  {order.items[0]?.name}{order.items.length > 1 ? ` 等${order.items.length}件` : ""}
                </div>
                <div className="text-[10px] text-wood-light">
                  {order.customer_name} · {order.customer_phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")} · {formatDate(order.created_at)}
                </div>
              </div>
              <div className="text-xs font-bold text-gold flex-shrink-0">
                {formatPrice(order.total_amount)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add admin dashboard with stats, quick actions, and recent orders"
```

---

### Task 14: Admin Product CRUD

**Files:**
- Create: `src/app/admin/products/page.tsx`
- Create: `src/components/admin/ProductList.tsx`, `src/components/admin/ProductForm.tsx`, `src/components/admin/DeleteConfirmModal.tsx`, `src/components/admin/CategoryFilter.tsx`

- [ ] **Step 1: Write CategoryFilter [src/components/admin/CategoryFilter.tsx](src/components/admin/CategoryFilter.tsx)**

```tsx
"use client";
import { ProductCategory, CATEGORIES, CATEGORY_ICONS } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  selected: ProductCategory | null;
  onSelect: (cat: ProductCategory | null) => void;
}

export function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-3 py-1 rounded-full text-xs transition-colors",
          !selected ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
        )}
      >
        全部
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={cn(
            "px-3 py-1 rounded-full text-xs transition-colors",
            selected === cat ? "bg-wood text-cream-50" : "bg-white text-wood-light border border-gold-light"
          )}
        >
          {CATEGORY_ICONS[cat]} {cat}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write ProductForm [src/components/admin/ProductForm.tsx](src/components/admin/ProductForm.tsx)**

```tsx
"use client";
import { useState, FormEvent } from "react";
import { Product, ProductCategory, CATEGORIES, CATEGORY_ICONS } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

interface Props {
  product?: Product | null; // null = new, product = edit
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

      {/* Image */}
      <div>
        <label className="text-[10px] text-wood font-semibold tracking-wider block mb-1.5">📸 产品图片</label>
        <Input placeholder="粘贴图片URL（后续支持直接上传）" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      {/* Name */}
      <Input label="产品名称" placeholder="如：云朵草莓蛋糕" value={name} onChange={(e) => setName(e.target.value)} required />

      {/* Category + Price */}
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

      {/* Description */}
      <Textarea label="产品简介" placeholder="简短介绍食材、口感、卖点..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

      {/* Tags */}
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

      {/* Toggles */}
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

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>取消</Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
          {loading ? "保存中..." : isEdit ? "💾 保存修改" : "🚀 立即发布"}
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Write DeleteConfirmModal [src/components/admin/DeleteConfirmModal.tsx](src/components/admin/DeleteConfirmModal.tsx)**

```tsx
"use client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({ open, productName, onConfirm, onCancel, loading }: Props) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full mx-auto mb-4 flex items-center justify-center text-xl">
          🗑️
        </div>
        <h3 className="text-sm font-semibold text-wood mb-1">确认删除？</h3>
        <p className="text-xs text-wood-light mb-4">
          {productName} 将从产品列表中永久移除
        </p>
        <div className="bg-red-50 rounded-lg p-3 text-[11px] text-red-600 mb-5">
          ⚠️ 删除后无法恢复，确定要继续吗？
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>取消</Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? "删除中..." : "确认删除"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: Write ProductList [src/components/admin/ProductList.tsx](src/components/admin/ProductList.tsx)**

```tsx
"use client";
import { Product, CATEGORY_ICONS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Toggle } from "@/components/ui/Toggle";

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
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            {CATEGORY_ICONS[p.category]}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-wood truncate">{p.name}</div>
            <div className="text-[10px] text-wood-light">
              {CATEGORY_ICONS[p.category]} {p.category}
              <span className={`ml-2 ${p.is_active ? "text-green-600" : "text-gray-400"}`}>
                {p.is_active ? "● 在售" : "● 已下架"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className={`text-xs font-bold flex-shrink-0 ${p.is_active ? "text-gold" : "text-gray-400 line-through"}`}>
            {formatPrice(p.price)}
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(p)}
              className="w-7 h-7 rounded-md border border-gold-light text-[10px] flex items-center justify-center hover:bg-cream-100"
              title="编辑"
            >
              ✏️
            </button>
            <button
              onClick={() => onToggleActive(p)}
              className="w-7 h-7 rounded-md border border-gold-light text-[10px] flex items-center justify-center hover:bg-cream-100"
              title={p.is_active ? "下架" : "上架"}
            >
              {p.is_active ? "⬇" : "⬆"}
            </button>
            <button
              onClick={() => onDelete(p)}
              className="w-7 h-7 rounded-md border border-red-200 text-[10px] text-red-400 flex items-center justify-center hover:bg-red-50"
              title="删除"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Write Admin Products API routes**

Create [src/app/api/admin/products/route.ts](src/app/api/admin/products/route.ts):
```ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAdminProducts, createProduct } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const products = await getAdminProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "获取产品失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = await createProduct(body);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "创建产品失败" }, { status: 500 });
  }
}
```

Create [src/app/api/admin/products/[id]/route.ts](src/app/api/admin/products/[id]/route.ts):
```ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { updateProduct, deleteProduct } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const body = await request.json();
    await updateProduct(params.id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新产品失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除产品失败" }, { status: 500 });
  }
}
```

- [ ] **Step 6: Write Products admin page [src/app/admin/products/page.tsx](src/app/admin/products/page.tsx)**

```tsx
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-wood-light">共 {products.length} 款产品 · {products.filter((p) => p.is_active).length} 款在售</div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          + 新增产品
        </Button>
      </div>

      {/* Category filter */}
      <CategoryFilter selected={filter} onSelect={setFilter} />

      {/* Product list */}
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

      {/* Delete modal */}
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
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add admin product CRUD with form, list, delete modal, and API routes"
```

---

### Task 15: Admin Order Management

**Files:**
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/components/admin/OrderList.tsx`, `src/components/admin/OrderDetail.tsx`

- [ ] **Step 1: Write OrderList [src/components/admin/OrderList.tsx](src/components/admin/OrderList.tsx)**

```tsx
"use client";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  statusFilter: OrderStatus | null;
  onStatusFilterChange: (s: OrderStatus | null) => void;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "待确认",
  confirmed: "已确认",
  completed: "已完成",
};

export function OrderList({ orders, onSelect, onStatusChange, statusFilter, onStatusFilterChange }: Props) {
  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <div className="space-y-4">
      {/* Status filter tabs */}
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

      {/* Orders */}
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
              {order.items.map((i) => `${i.name} ×${i.quantity}`).join("、")}
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
```

- [ ] **Step 2: Write OrderDetail [src/components/admin/OrderDetail.tsx](src/components/admin/OrderDetail.tsx)**

```tsx
"use client";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Props {
  order: Order;
  onBack: () => void;
  onStatusChange: (status: OrderStatus) => void;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "待确认",
  confirmed: "已确认",
  completed: "已完成",
};

export function OrderDetail({ order, onBack, onStatusChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs text-wood-light hover:text-wood">← 返回</button>
        <h2 className="text-sm font-serif font-bold text-wood tracking-[2px]">订单详情 {order.id}</h2>
      </div>

      {/* Status actions */}
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

      {/* Customer info */}
      <div className="card p-4">
        <label className="text-[10px] text-gold block mb-1">客户信息</label>
        <div className="text-xs text-wood">👤 {order.customer_name} · 📱 {order.customer_phone}</div>
        <div className="text-[10px] text-wood-light mt-1">下单时间：{formatDate(order.created_at)}</div>
      </div>

      {/* Order items */}
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

      {/* Notes — highlighted */}
      {order.notes && (
        <div className="bg-gradient-to-r from-cream-100 to-cream-50 border border-gold-light border-l-[3px] border-l-gold rounded-card p-4">
          <label className="text-[10px] text-gold block mb-1">✍️ 客户备注（核心信息）</label>
          <p className="text-sm text-wood font-serif leading-relaxed">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write Orders API route [src/app/api/admin/orders/route.ts](src/app/api/admin/orders/route.ts)**

```ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAdminOrders } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const orders = await getAdminOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "获取订单失败" }, { status: 500 });
  }
}
```

Create [src/app/api/admin/orders/[id]/route.ts](src/app/api/admin/orders/[id]/route.ts):
```ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  try {
    const { status } = await request.json();
    await updateOrderStatus(params.id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新订单失败" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Write Orders admin page [src/app/admin/orders/page.tsx](src/app/admin/orders/page.tsx)**

```tsx
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
    // Update selected order if viewing
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
          onStatusChange={handleStatusChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add admin order management with list, detail, and status updates"
```

---

## Phase 6: Polish & Deploy

### Task 16: Metadata, Error/Not-Found Pages, and Final Polish

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`

- [ ] **Step 1: Write not-found page [src/app/not-found.tsx](src/app/not-found.tsx)**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🦌</div>
      <h1 className="font-serif text-2xl text-wood tracking-[3px] mb-2">404</h1>
      <p className="text-sm text-wood-light mb-8">页面不存在，可能已经被吃掉啦~</p>
      <Link href="/" className="btn-primary inline-block">
        返回首页
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Write error page [src/app/error.tsx](src/app/error.tsx)**

```tsx
"use client";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🍰</div>
      <h1 className="font-serif text-xl text-wood tracking-[3px] mb-2">出了点问题</h1>
      <p className="text-sm text-wood-light mb-8">请刷新页面重试</p>
      <button onClick={reset} className="btn-primary">
        刷新
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add error and not-found pages"
```

---

### Task 17: Environment Setup & First Run

- [ ] **Step 1: Create `.env.local` from example**

```bash
cp .env.local.example .env.local
```

- [ ] **Step 2: Set up Supabase**

Instructions:
1. Go to https://supabase.com → Create new project
2. Copy project URL and anon key to `.env.local`
3. Copy service_role key to `.env.local` (find in Project Settings > API)
4. Set `ADMIN_PASSWORD` and `JWT_SECRET` in `.env.local`
5. Go to SQL Editor → paste contents of `supabase/schema.sql` → Run
6. Go to Storage → Create bucket "product-images" → Make public

- [ ] **Step 3: Run dev server**

```bash
npm run dev
```
Expected: App runs at http://localhost:3000

- [ ] **Step 4: Verify all pages**

Open in browser:
- http://localhost:3000 — Homepage with hero, featured, expand
- http://localhost:3000/product/[id] — Product detail
- http://localhost:3000/cart — Cart
- http://localhost:3000/checkout — Checkout flow
- http://localhost:3000/admin/login — Admin login
- http://localhost:3000/admin — Dashboard (after login)
- http://localhost:3000/admin/products — Product CRUD
- http://localhost:3000/admin/orders — Order management

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add env setup and finalize"
```

---

## Summary

| Phase | Tasks | Files Created |
|-------|-------|---------------|
| 1. Scaffold | 1-2 | package.json, tailwind config, globals.css, types, utils, supabase client |
| 2. Database | 3 | Schema SQL with seed data |
| 3. Shared | 4-6 | UI primitives, Header/Footer, Cart context, Root layout |
| 4. Frontend | 7-11 | Homepage, Product detail, Cart, Checkout + API |
| 5. Admin | 12-15 | Login, Dashboard, Products CRUD, Orders + all API routes |
| 6. Polish | 16-17 | Error pages, env setup, first run verification |

**Total: 17 tasks, ~40 files**

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
JWT_SECRET=
```
