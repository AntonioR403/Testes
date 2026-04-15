import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <AuthForm mode="signup" />
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </section>
  );
}
