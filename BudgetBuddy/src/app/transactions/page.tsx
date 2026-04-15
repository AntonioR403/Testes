"use client";

import { FormEvent, useEffect, useState } from "react";
import { TopNav } from "@/components/top-nav";

type Category = { id: string; name: string };
type Transaction = {
  id: string;
  amount: number;
  txType: "income" | "expense";
  description: string | null;
  txDate: string;
  category: Category;
};

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [txRes, catRes] = await Promise.all([fetch("/api/transactions"), fetch("/api/categories")]);
      const txBody = await txRes.json();
      const catBody = await catRes.json();
      setItems(txBody.data ?? []);
      setCategories(catBody.data ?? []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      amount: Number(form.get("amount")),
      txType: String(form.get("txType")),
      description: String(form.get("description") || ""),
      txDate: new Date(String(form.get("txDate"))).toISOString(),
      categoryId: String(form.get("categoryId")),
    };

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      event.currentTarget.reset();
      await load();
    }
  };

  return (
    <div className="space-y-4">
      <TopNav />
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <form className="grid gap-2 rounded border bg-white p-4 md:grid-cols-5" onSubmit={onCreate}>
        <input name="amount" type="number" step="0.01" required className="rounded border p-2" placeholder="Amount" />
        <select name="txType" className="rounded border p-2" defaultValue="expense">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select name="categoryId" className="rounded border p-2" required>
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input type="date" name="txDate" required className="rounded border p-2" />
        <input name="description" className="rounded border p-2" placeholder="Description" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white md:col-span-5">Add transaction</button>
      </form>

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}
      {!loading && items.length === 0 ? <p>No transactions yet.</p> : null}

      <ul className="space-y-2">
        {items.map((tx) => (
          <li key={tx.id} className="rounded border bg-white p-3">
            <div className="flex items-center justify-between">
              <span>
                {tx.category.name} · {tx.description || "No description"}
              </span>
              <span className={tx.txType === "expense" ? "text-red-700" : "text-emerald-700"}>
                {tx.txType === "expense" ? "-" : "+"}${tx.amount}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
