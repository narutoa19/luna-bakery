"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
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

// Size surcharge lookup
const CAKE_SIZE_SURCHARGES: Record<string, number> = {
  "6寸": 0,
  "8寸": 100,
  "10寸": 230,
};

function getSizePrice(basePrice: number, size?: string): number {
  if (!size) return basePrice;
  return basePrice + (CAKE_SIZE_SURCHARGES[size] || 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("luna-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("luna-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1, size?: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.size === size
      );
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

  const removeItem = useCallback((productId: string, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && (size === undefined || i.size === size))
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter(
            (i) => !(i.product.id === productId && (size === undefined || i.size === size))
          )
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && (size === undefined || i.size === size)
            ? { ...i, quantity }
            : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + getSizePrice(i.product.price, i.size) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalAmount, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
