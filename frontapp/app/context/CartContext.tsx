"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../lib/api";

const USER_ID_KEY = "shopnow_user_id";

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = "user_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

interface CartContextValue {
  userId: string;
  setUserId: (id: string) => void;
  cart: CartItem[];
  addToCart: (
    productId: string,
    quantity: number,
    name: string,
    price: number
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  checkout: () => Promise<{ order: Record<string, unknown> }>;
  clearCart: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (s: string | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUserIdState(getOrCreateUserId());
  }, []);

  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_ID_KEY, id);
    }
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity: number, name: string, price: number) => {
      if (!userId) return;
      setError(null);
      setIsLoading(true);
      try {
        await api<{ message: string }>("/api/cart/reserve", {
          method: "POST",
          body: JSON.stringify({ userId, productId, quantity }),
        });
        setCart((prev) => {
          const i = prev.findIndex((x) => x.productId === productId);
          if (i >= 0) {
            const next = [...prev];
            next[i] = {
              ...next[i],
              quantity: next[i].quantity + quantity,
            };
            return next;
          }
          return [...prev, { productId, quantity, name, price }];
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add to cart");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!userId) return;
      setError(null);
      setIsLoading(true);
      try {
        await api<{ message: string }>("/api/cart/cancel", {
          method: "POST",
          body: JSON.stringify({ userId, productId }),
        });
        setCart((prev) => prev.filter((x) => x.productId !== productId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const checkout = useCallback(async () => {
    if (!userId || cart.length === 0) return { order: {} };
    setError(null);
    setIsLoading(true);
    try {
      const data = await api<{ message: string; order: Record<string, unknown> }>(
        "/api/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            userId,
            items: cart.map((x) => ({ productId: x.productId, quantity: x.quantity })),
          }),
        }
      );
      setCart([]);
      return { order: data.order };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, cart]);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(
    () => ({
      userId,
      setUserId,
      cart,
      addToCart,
      removeFromCart,
      checkout,
      clearCart,
      isLoading,
      error,
      setError,
    }),
    [
      userId,
      setUserId,
      cart,
      addToCart,
      removeFromCart,
      checkout,
      clearCart,
      isLoading,
      error,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
