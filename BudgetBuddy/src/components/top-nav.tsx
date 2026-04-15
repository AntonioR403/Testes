import Link from "next/link";

export function TopNav() {
  return (
    <nav className="mb-4 flex gap-4 border-b pb-2">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/transactions">Transactions</Link>
      <Link href="/budgets">Budgets</Link>
    </nav>
  );
}
