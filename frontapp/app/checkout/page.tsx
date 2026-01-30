"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, checkout, clearCart, isLoading, error, setError } = useCart();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [placing, setPlacing] = useState(false);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setPlacing(true);
    try {
      const { order: orderResult } = await checkout();
      setOrder(orderResult);
    } catch {
      // error set in context
    } finally {
      setPlacing(false);
    }
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (order && Object.keys(order).length > 0) {
    return (
      <div className="bg-slate-50 py-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-teal-800">Order confirmed</h1>
            <p className="mt-2 text-teal-700">Thank you. Your order has been placed.</p>
            <pre className="mt-6 max-h-80 overflow-auto rounded-lg bg-white p-4 text-left text-sm text-slate-800">
              {JSON.stringify(order, null, 2)}
            </pre>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-2 font-medium text-white hover:bg-teal-700"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !order) {
    return (
      <div className="bg-slate-50 py-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <p className="mt-2 text-slate-600">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-block text-teal-600 hover:underline">
              Browse products →
            </Link>
            <span className="mx-2 text-slate-400">|</span>
            <Link href="/cart" className="inline-block text-teal-600 hover:underline">
              View cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-1 text-slate-600">Review your order and place it.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Order summary</h2>
          <ul className="mt-4 space-y-2">
            {cart.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between text-sm text-slate-700"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between font-semibold text-slate-900">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <form onSubmit={handlePlaceOrder} className="mt-6">
            <button
              type="submit"
              disabled={isLoading || placing}
              className="w-full rounded-lg bg-teal-600 px-4 py-3 font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {placing || isLoading ? "Placing order…" : "Place order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
