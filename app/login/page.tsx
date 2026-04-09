"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push("/sell");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong signing in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          Seller Sign In
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome back
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          Sign in to manage your marketplace listings.
        </p>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleLogin} className="mt-8 grid gap-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Need an account?{" "}
          <Link href="/signup" className="font-semibold text-blue-300 hover:text-blue-200">
            Create one here
          </Link>
        </p>
      </div>
    </main>
  );
}