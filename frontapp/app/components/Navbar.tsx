"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="text-xl">🛒</span>
          <span>ShopNow</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-6">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="relative rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/checkout"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
