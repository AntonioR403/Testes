"use client";

import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/top-nav";
import { apiUrl } from "@/lib/api-base";

function badgeForUsage(usage: number) {
  if (usage >= 100) return "bg-red-100 text-red-700";
  if (usage >= 80) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function DashboardPage() {
  const currentMonth = useMemo(() => new Date().toISOString(), []);

  return (
    <div className="space-y-6">
      <TopNav />
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <DashboardData month={currentMonth} />
    </div>
  );
}

async function getData(month: string) {
  const response = await fetch(`${apiUrl("/dashboard")}?month=${encodeURIComponent(month)}`);
  if (!response.ok) throw new Error("Failed to load dashboard");
  return response.json();
}

function DashboardData({ month }: { month: string }) {
  const [state, setState] = useState<{ loading: boolean; error?: string; data?: any }>({ loading: true });

  useEffect(() => {
    getData(month)
      .then((data) => setState({ loading: false, data: data.data }))
      .catch((error: Error) => setState({ loading: false, error: error.message }));
  }, [month]);

  if (state.loading) return <p>Loading dashboard...</p>;
  if (state.error) return <p className="text-red-600">{state.error}</p>;
  if (!state.data) return <p>No data available.</p>;

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <Stat title="Income" value={state.data.totals.income} />
        <Stat title="Expense" value={state.data.totals.expense} />
        <Stat title="Net" value={state.data.totals.net} />
      </section>
      <section className="rounded border bg-white p-4">
        <h2 className="mb-3 font-semibold">Budget usage</h2>
        {state.data.budgetUsage.length === 0 ? (
          <p className="text-sm text-slate-500">No budgets created yet.</p>
        ) : (
          <ul className="space-y-2">
            {state.data.budgetUsage.map((item: any) => (
              <li key={item.budgetId} className="flex items-center justify-between">
                <span>{item.categoryName}</span>
                <span className={`rounded px-2 py-1 text-xs ${badgeForUsage(item.usagePercent)}`}>
                  {item.usagePercent}% ({item.spent}/{item.budgetAmount})
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-xl font-semibold">{value.toFixed(2)}</p>
    </div>
  );
}
