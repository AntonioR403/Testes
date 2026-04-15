import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BudgetBuddy",
  description: "Personal budget tracker scaffold",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
