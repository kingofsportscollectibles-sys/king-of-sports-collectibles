"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName.trim() || null,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user && !data.session) {
        setSuccessMessage(
          "Account created. Check your email to confirm your account, then sign in."
        );
        setTimeout(() => {
          router.push("/login");
        }, 1500);
        return;
      }

      setSuccessMessage("Account created successfully.");
      setTimeout(() => {
        router.push("/sell");
      }, 1200);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong creating your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          Create Account
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Join the marketplace
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          Create your seller account to list sports memorabilia and collectibles.
        </p>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        <form onSubmit={handleSignup} className="mt-8 grid gap-6">
          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-slate-200">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Kof Collectibles"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-300 hover:text-blue-200">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}