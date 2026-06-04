import { supabase, supabaseAdmin } from "./supabase";
import { Product, ProductCategory, OrderStatus, Order } from "@/types";
import { generateOrderId } from "./utils";

// ============================================================
// Detect if Supabase is configured (not a placeholder)
// ============================================================

const IS_REAL_SUPABASE =
  !process.env.NEXT_PUBLIC_DEMO_MODE &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

// ============================================================
// In-memory mock data (used when Supabase is not configured)
// ============================================================

const now = new Date().toISOString();
const dayAgo = new Date(Date.now() - 86400000).toISOString();

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "云朵草莓蛋糕",
    category: "蛋糕",
    price: 238,
    description: "新鲜草莓与轻盈奶油的完美邂逅。采用日本进口鲜奶油，搭配当日采摘的新鲜草莓，口感绵密香甜。",
    image_url: "",
    images: [],
    tags: ["🔥 热销", "⭐ 推荐"],
    is_active: true,
    is_featured: true,
    created_at: now,
  },
  {
    id: "p2",
    name: "鹿角可颂",
    category: "面包",
    price: 28,
    description: "酥脆的外皮包裹着浓郁的黄油香气，每一口都是幸福的味道。手工开酥，层层分明。",
    image_url: "",
    images: [],
    tags: ["🔥 热销"],
    is_active: true,
    is_featured: true,
    created_at: now,
  },
  {
    id: "p3",
    name: "鹿印曲奇",
    category: "饼干",
    price: 68,
    description: "可爱鹿角造型的黄油曲奇，酥脆香甜。选用新西兰黄油，纯手工制作。",
    image_url: "",
    images: [],
    tags: ["🆕 新品"],
    is_active: true,
    is_featured: true,
    created_at: now,
  },
  {
    id: "p4",
    name: "森林莓果慕斯",
    category: "甜点",
    price: 48,
    description: "混合莓果的酸甜与丝滑慕斯的完美组合。底层是手工烤制的巧克力蛋糕底。",
    image_url: "",
    images: [],
    tags: ["⭐ 推荐"],
    is_active: true,
    is_featured: true,
    created_at: now,
  },
  {
    id: "p5",
    name: "抹茶红豆卷",
    category: "甜点",
    price: 42,
    description: "日本宇治抹茶与甜蜜红豆的经典搭配。蛋糕体松软细腻，奶油内馅顺滑。",
    image_url: "",
    images: [],
    tags: [],
    is_active: true,
    is_featured: false,
    created_at: dayAgo,
  },
  {
    id: "p6",
    name: "森林莓果吐司",
    category: "面包",
    price: 42,
    description: "手工揉制的柔软吐司，加入蔓越莓和蓝莓干，每一片都看得见果粒。",
    image_url: "",
    images: [],
    tags: [],
    is_active: false,
    is_featured: false,
    created_at: dayAgo,
  },
  {
    id: "p7",
    name: "海盐焦糖拿铁",
    category: "饮品",
    price: 32,
    description: "醇厚拿铁搭配手工熬制海盐焦糖酱，甜中带咸，层次丰富。",
    image_url: "",
    images: [],
    tags: ["🆕 新品"],
    is_active: true,
    is_featured: false,
    created_at: dayAgo,
  },
  {
    id: "p8",
    name: "巧克力熔岩蛋糕",
    category: "蛋糕",
    price: 198,
    description: "比利时黑巧克力制作，切开后流出浓郁的巧克力岩浆。搭配香草冰淇淋更佳。",
    image_url: "",
    images: [],
    tags: ["🔥 热销", "⭐ 推荐"],
    is_active: true,
    is_featured: false,
    created_at: dayAgo,
  },
  {
    id: "p9",
    name: "桂花酒酿圆子",
    category: "甜点",
    price: 36,
    description: "传统酒酿圆子加入桂花点缀，清甜软糯，满满的都是小时候的味道。",
    image_url: "",
    images: [],
    tags: [],
    is_active: true,
    is_featured: false,
    created_at: dayAgo,
  },
  {
    id: "p10",
    name: "柠檬芝士挞",
    category: "甜点",
    price: 38,
    description: "酥脆的挞底配上清新柠檬芝士馅，酸酸甜甜，下午茶的完美伴侣。",
    image_url: "",
    images: [],
    tags: [],
    is_active: true,
    is_featured: false,
    created_at: dayAgo,
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "LN260604001",
    customer_name: "小鹿",
    customer_phone: "13812346789",
    notes: "生日快乐小鹿！蛋糕上请写这个名字。不要放坚果，有朋友过敏。下午3点送到。",
    items: [{ product_id: "p1", name: "云朵草莓蛋糕", price: 238, quantity: 1, size: "8寸" }],
    total_amount: 338,
    status: "pending",
    created_at: dayAgo,
  },
  {
    id: "LN260604002",
    customer_name: "小王",
    customer_phone: "18612341234",
    notes: "",
    items: [
      { product_id: "p2", name: "鹿角可颂", price: 28, quantity: 2 },
      { product_id: "p6", name: "森林莓果吐司", price: 42, quantity: 1 },
    ],
    total_amount: 98,
    status: "confirmed",
    created_at: dayAgo,
  },
  {
    id: "LN260604003",
    customer_name: "阿明",
    customer_phone: "13912345678",
    notes: "巧克力蛋糕要75%可可含量的那种，谢谢",
    items: [{ product_id: "p8", name: "巧克力熔岩蛋糕", price: 198, quantity: 1, size: "6寸" }],
    total_amount: 198,
    status: "completed",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Mutable copies for CRUD operations
let mockProducts = [...MOCK_PRODUCTS];
let mockOrders = [...MOCK_ORDERS];
let mockIdCounter = MOCK_PRODUCTS.length + 1;

// ============================================================
// Public Read
// ============================================================

export async function getFeaturedProducts(): Promise<Product[]> {
  if (IS_REAL_SUPABASE) {
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
  return mockProducts.filter((p) => p.is_active && p.is_featured).slice(0, 4);
}

export async function getAllActiveProducts(category?: ProductCategory): Promise<Product[]> {
  if (IS_REAL_SUPABASE) {
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
  const active = mockProducts.filter((p) => p.is_active);
  return category ? active.filter((p) => p.category === category) : active;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (IS_REAL_SUPABASE) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();
    if (error) return null;
    return data as Product;
  }
  return mockProducts.find((p) => p.id === id && p.is_active) ?? null;
}

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  notes: string;
  items: { product_id: string; name: string; price: number; quantity: number; size?: string }[];
  total_amount: number;
}): Promise<{ id: string }> {
  if (IS_REAL_SUPABASE) {
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
  const id = generateOrderId();
  const newOrder: Order = {
    id,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    notes: data.notes,
    items: data.items.map((i) => ({
      product_id: i.product_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
    })),
    total_amount: data.total_amount,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  mockOrders.unshift(newOrder);
  return { id };
}

// ============================================================
// Admin Queries
// ============================================================

export async function getAdminProducts(): Promise<Product[]> {
  if (IS_REAL_SUPABASE) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Product[];
  }
  return [...mockProducts];
}

export async function getAdminOrders(): Promise<Order[]> {
  if (IS_REAL_SUPABASE) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Order[];
  }
  return [...mockOrders];
}

export async function getAdminOrderById(id: string): Promise<Order | null> {
  if (IS_REAL_SUPABASE) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data as Order;
  }
  return mockOrders.find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (IS_REAL_SUPABASE) {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  mockOrders = mockOrders.map((o) => (o.id === id ? { ...o, status } : o));
}

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<string> {
  if (IS_REAL_SUPABASE) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(product)
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }
  const id = `p${mockIdCounter++}`;
  mockProducts.push({
    ...product,
    id,
    images: [],
    created_at: new Date().toISOString(),
  } as Product);
  return id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  if (IS_REAL_SUPABASE) {
    const { error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
    return;
  }
  mockProducts = mockProducts.map((p) => (p.id === id ? { ...p, ...updates } : p));
}

export async function deleteProduct(id: string): Promise<void> {
  if (IS_REAL_SUPABASE) {
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return;
  }
  mockProducts = mockProducts.filter((p) => p.id !== id);
}

export async function getDashboardStats(): Promise<{
  newOrders: number;
  activeProducts: number;
  todayRevenue: number;
  recentOrders: Order[];
}> {
  if (IS_REAL_SUPABASE) {
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    newOrders: mockOrders.filter((o) => o.status === "pending").length,
    activeProducts: mockProducts.filter((p) => p.is_active).length,
    todayRevenue: mockOrders
      .filter((o) => o.status !== "pending" && new Date(o.created_at) >= today)
      .reduce((sum, o) => sum + o.total_amount, 0),
    recentOrders: mockOrders.slice(0, 5),
  };
}
