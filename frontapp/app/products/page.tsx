"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";

interface Product {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  reservedStock?: number;
  availableStock?: number;
}

export default function ProductsPage() {
  const { addToCart, userId, setUserId, error: cartError, setError: setCartError } = useCart();
  const [sessionInput, setSessionInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: "", sku: "", stock: "", price: "" });
  const [createOpen, setCreateOpen] = useState(false);
  const [createResult, setCreateResult] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  async function fetchProducts() {
    try {
      const data = await api<Product[]>("/api/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreateResult(null);
    const stock = Number(createForm.stock);
    const price = Number(createForm.price);
    if (!createForm.name || !createForm.sku || isNaN(stock) || isNaN(price)) {
      setCreateError("Fill all fields with valid values");
      return;
    }
    try {
      await api<{ _id: string; name: string }>("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name: createForm.name,
          sku: createForm.sku,
          stock,
          price,
        }),
      });
      setCreateResult("Product created.");
      setCreateForm({ name: "", sku: "", stock: "", price: "" });
      fetchProducts();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Request failed");
    }
  }

  async function handleAddToCart(product: Product, quantity: number) {
    setCartError(null);
    setAddingId(product._id);
    try {
      await addToCart(product._id, quantity, product.name, product.price);
      await fetchProducts();
    } catch {
      // error already set in context
    } finally {
      setAddingId(null);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";
  const btnClass =
    "rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50";

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products</h1>
            <p className="mt-1 text-slate-600">
              Browse and add to cart. Stock is reserved for 10 minutes (concurrency-safe).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen((o) => !o)}
            className={btnClass}
          >
            {createOpen ? "Cancel" : "+ Add product"}
          </button>
        </div>

        {cartError && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {cartError}
          </div>
        )}

        {createOpen && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create new product</h2>
            <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <input
                placeholder="Product name"
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
              <input
                placeholder="SKU"
                value={createForm.sku}
                onChange={(e) => setCreateForm((f) => ({ ...f, sku: e.target.value }))}
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Stock"
                value={createForm.stock}
                onChange={(e) => setCreateForm((f) => ({ ...f, stock: e.target.value }))}
                className={inputClass}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={createForm.price}
                onChange={(e) => setCreateForm((f) => ({ ...f, price: e.target.value }))}
                className={inputClass}
              />
              <button type="submit" className={btnClass}>Create</button>
            </form>
            {createError && <p className="mt-3 text-sm text-red-600">{createError}</p>}
            {createResult && <p className="mt-3 text-sm text-teal-600">{createResult}</p>}
          </section>
        )}

        <div className="mt-10">
          {loading ? (
            <p className="text-slate-600">Loading products…</p>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600">
              No products yet. Add one using the button above.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const available = p.availableStock ?? p.stock;
                return (
                  <div
                    key={p._id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{p.sku}</p>
                    <p className="mt-2 text-lg font-semibold text-teal-600">
                      ${Number(p.price).toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Available: <strong>{available}</strong>
                      {p.reservedStock != null && p.reservedStock > 0 && (
                        <span className="text-slate-500"> (reserved: {p.reservedStock})</span>
                      )}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(p, 1)}
                        disabled={available < 1 || addingId === p._id}
                        className={`${btnClass} flex-1`}
                      >
                        {addingId === p._id ? "Adding…" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      
      </div>
    </div>
  );
}
