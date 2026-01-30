"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, isLoading, error, setError } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleRemove(productId: string) {
    setError(null);
    setRemovingId(productId);
    try {
      await removeFromCart(productId);
    } finally {
      setRemovingId(null);
    }
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Your cart</h1>
        <p className="mt-1 text-slate-600">
          Reserved items. Remove any you don’t want, then proceed to checkout.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-block text-teal-600 hover:underline">
              Browse products →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-nowrap"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-500">
                      ${Number(item.price).toFixed(2)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    disabled={isLoading || removingId === item.productId}
                    className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {removingId === item.productId ? "Removing…" : "Remove"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900">Subtotal</span>
                <span className="text-xl font-bold text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <Link
                href="/checkout"
                className={`mt-4 block w-full rounded-lg bg-teal-600 px-4 py-3 text-center font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 ${isLoading ? "pointer-events-none opacity-70" : ""}`}
              >
                Proceed to checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
