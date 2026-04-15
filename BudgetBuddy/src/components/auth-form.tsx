"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { mode: "login" | "signup" };

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const endpoint = mode === "signup" ? "/api/signup" : "/api/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Request failed");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded border bg-white p-4 shadow-sm">
      {mode === "signup" && (
        <input required name="name" placeholder="Name" className="w-full rounded border p-2" />
      )}
      <input required type="email" name="email" placeholder="Email" className="w-full rounded border p-2" />
      <input
        required
        minLength={8}
        type="password"
        name="password"
        placeholder="Password"
        className="w-full rounded border p-2"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="rounded bg-slate-900 px-4 py-2 text-white">
        {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
