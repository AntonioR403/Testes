import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">BudgetBuddy</h1>
      <p>Scaffold ready. Use the links below to navigate.</p>
      <nav className="flex gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/transactions">Transactions</Link>
        <Link href="/budgets">Budgets</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </nav>
    </div>
  );
}
