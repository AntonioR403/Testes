import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <AuthForm mode="login" />
      <p>
        No account? <Link href="/signup">Sign up</Link>
      </p>
    </section>
  );
}
