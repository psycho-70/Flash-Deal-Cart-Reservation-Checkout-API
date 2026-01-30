import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-teal-600">ShopNow</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Browse products, add them to your cart (stock is reserved for 10 minutes), and checkout. Try opening two tabs with different sessions to see concurrency in action.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="sr-only">Quick actions</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/products"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-teal-200 hover:shadow-md"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl text-teal-600 group-hover:bg-teal-200">
              📦
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Products</h3>
            <p className="mt-2 text-sm text-slate-600">
              View all products, add new ones, and add items to your cart.
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700">
              Shop now
              <span className="ml-1">→</span>
            </span>
          </Link>

          <Link
            href="/cart"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-teal-200 hover:shadow-md"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl text-teal-600 group-hover:bg-teal-200">
              🛒
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Cart</h3>
            <p className="mt-2 text-sm text-slate-600">
              See your reserved items, remove any you don’t want, then go to checkout.
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700">
              View cart
              <span className="ml-1">→</span>
            </span>
          </Link>

          <Link
            href="/checkout"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-teal-200 hover:shadow-md sm:col-span-2 lg:col-span-1"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl text-teal-600 group-hover:bg-teal-200">
              ✓
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Checkout</h3>
            <p className="mt-2 text-sm text-slate-600">
              Review your order and place it. Reserved stock is committed and order is created.
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700">
              Checkout
              <span className="ml-1">→</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
