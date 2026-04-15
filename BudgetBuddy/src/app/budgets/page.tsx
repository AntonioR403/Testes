"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/top-nav";
import { apiUrl } from "@/lib/api-base";

type Budget = {
  id: string;
  amount: number;
  categoryId: string;
  month: string;
  category: { name: string };
};

type Category = { id: string; name: string };

export default function BudgetsPage() {
  const [items, setItems] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const month = useMemo(() => new Date().toISOString(), []);

  const load = async () => {
    setLoading(true);
    try {
      const [budgetRes, categoryRes] = await Promise.all([
        fetch(`${apiUrl("/budgets")}?month=${encodeURIComponent(month)}`),
        fetch(apiUrl("/categories")),
      ]);
      const budgetBody = await budgetRes.json();
      const categoryBody = await categoryRes.json();
      setItems(budgetBody.data ?? []);
      setCategories(categoryBody.data ?? []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [month]);

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      amount: Number(form.get("amount")),
      categoryId: String(form.get("categoryId")),
      month,
    };

    const res = await fetch(apiUrl("/budgets"), {
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
      <h1 className="text-2xl font-semibold">Budgets</h1>
      <form className="grid gap-2 rounded border bg-white p-4 md:grid-cols-3" onSubmit={onCreate}>
        <select name="categoryId" className="rounded border p-2" required>
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input name="amount" type="number" step="0.01" className="rounded border p-2" placeholder="Monthly amount" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Add budget</button>
      </form>

      {loading ? <p>Loading budgets...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}
      {!loading && items.length === 0 ? <p>No budgets set for this month.</p> : null}

      <ul className="space-y-2">
        {items.map((budget) => (
          <li key={budget.id} className="rounded border bg-white p-3">
            {budget.category.name}: ${budget.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
