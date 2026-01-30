import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="text-lg">🛒</span>
              ShopNow
            </Link>
            <p className="mt-3 text-sm text-slate-600">
              Your one-stop shop for products. Browse, reserve, and checkout with ease.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-slate-600 hover:text-slate-900">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-slate-600 hover:text-slate-900">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-sm text-slate-600 hover:text-slate-900">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ShopNow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
