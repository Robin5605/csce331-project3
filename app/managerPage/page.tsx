"use client";

import React, { useEffect, useMemo, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  categoryId: number | null;
  stock: number;
  cost: number; // API returns cost::float8, so it's a number
};

const ToolbarButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", ...props }) => (
  <button className={`px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 active:scale-[.99] ${className}`} {...props}>
    {children}
  </button>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-700 bg-white">
    {children}
  </span>
);

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-3 py-2 font-semibold text-gray-700 border-r last:border-r-0">{children}</th>
);
const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-3 py-2 text-gray-800 border-r last:border-r-0">{children}</td>
);

export default function MenuManagerPage() {
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (!res.ok) throw new Error(`GET /api/menu ${res.status}`);
      const data: MenuItem[] = await res.json();
      setRows(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      String(r.id).includes(q) ||
      String(r.categoryId ?? "").includes(q)
    );
  }, [rows, query]);

  // Add → POST /api/menu
  const onAdd = async () => {
    try {
      setError(null);
      const body = {
        name: "New Item",
        categoryId: null,
        stock: 0,
        cost: 0,
      };
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`POST /api/menu ${res.status}`);
      const created: MenuItem = await res.json();
      setRows((prev) => [...prev, created]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to add item");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900">
      <div className="w-full h-8 bg-neutral-800 text-gray-100 flex items-center justify-center text-sm">Manager — Menu</div>

      {/* Toolbar */}
      <div className="mx-auto max-w-6xl mt-4 rounded-xl border bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, ID, categoryId"
            className="flex-1 min-w-[220px] px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
          <ToolbarButton onClick={fetchMenu}>Refresh</ToolbarButton>
          <ToolbarButton onClick={onAdd}>Add Item</ToolbarButton>
          {/* Edit/Delete can be added after you implement PUT/DELETE */}
        </div>
        {error && <div className="mt-2 text-xs text-red-600">Error: {error}</div>}
      </div>

      {/* Table */}
      <div className="mx-auto max-w-6xl mt-3">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 border-b">
              <tr className="text-left">
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Category ID</Th>
                <Th>Stock</Th>
                <Th>Cost</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading…</td></tr>
              ) : filtered.length ? (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                    <Td>{r.id}</Td>
                    <Td>{r.name}</Td>
                    <Td>{r.categoryId ?? "—"}</Td>
                    <Td>{r.stock}</Td>
                    <Td>${r.cost.toFixed(2)}</Td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
          <Tag>{filtered.length} shown</Tag>
          <Tag>{rows.length} total</Tag>
        </div>
      </div>
    </div>
  );
}
