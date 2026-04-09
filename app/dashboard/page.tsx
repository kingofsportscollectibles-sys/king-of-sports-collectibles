"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DashboardItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: string;
  approval_status: string | null;
  listing_source: string | null;
  created_at: string;
  image_url: string | null;
};

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "seller" | "admin";
  stripe_account_id?: string | null;
  stripe_onboarding_complete?: boolean | null;
  stripe_charges_enabled?: boolean | null;
  stripe_payouts_enabled?: boolean | null;
  stripe_details_submitted?: boolean | null;
};

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function getApprovalBadgeClasses(status: string | null) {
  switch (status) {
    case "approved":
      return "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
    case "pending_review":
      return "border border-amber-400/20 bg-amber-500/10 text-amber-300";
    case "rejected":
      return "border border-red-400/20 bg-red-500/10 text-red-300";
    case "draft":
      return "border border-slate-400/20 bg-slate-500/10 text-slate-300";
    default:
      return "border border-slate-400/20 bg-slate-500/10 text-slate-300";
  }
}

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case "available":
      return "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
    case "pending":
      return "border border-amber-400/20 bg-amber-500/10 text-amber-300";
    case "sold":
      return "border border-slate-400/20 bg-slate-500/10 text-slate-300";
    default:
      return "border border-slate-400/20 bg-slate-500/10 text-slate-300";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [pageError, setPageError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [isStartingOnboarding, setIsStartingOnboarding] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      setUserId(null);
      setProfile(null);
      setItems([]);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setPageError("Unable to log out right now. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function handleStartPayoutSetup() {
    if (!profile?.id) return;

    try {
      setIsStartingOnboarding(true);
      setPageError("");
      setActionMessage("");

      const res = await fetch("/api/stripe/connect/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: profile.id,
          email: profile.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to start payout setup.");
      }

      if (!data.url) {
        throw new Error("No onboarding URL returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Unable to start payout setup."
      );
      setIsStartingOnboarding(false);
    }
  }

  async function loadDashboard() {
    setAuthLoading(true);
    setPageError("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      if (sessionError.message.toLowerCase().includes("jwt expired")) {
        await supabase.auth.signOut();
        setUserId(null);
        setProfile(null);
        setItems([]);
        setPageError("");
        setAuthLoading(false);
        router.push("/login");
        return;
      }

      setPageError(sessionError.message);
      setAuthLoading(false);
      return;
    }

    if (!session?.user) {
      setUserId(null);
      setProfile(null);
      setItems([]);
      setAuthLoading(false);
      return;
    }

    const user = session.user;
    setUserId(user.id);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(`
        id,
        email,
        display_name,
        role,
        stripe_account_id,
        stripe_onboarding_complete,
        stripe_charges_enabled,
        stripe_payouts_enabled,
        stripe_details_submitted
      `)
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setPageError(profileError.message);
      setAuthLoading(false);
      return;
    }

    if (profileData) {
      setProfile(profileData as Profile);
    } else {
      setProfile({
        id: user.id,
        email: user.email ?? null,
        display_name: user.user_metadata?.display_name ?? null,
        role: "seller",
      });
    }

    const { data: itemData, error: itemsError } = await supabase
      .from("items")
      .select(
        "id, title, slug, price, status, approval_status, listing_source, created_at, image_url"
      )
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (itemsError) {
      setPageError(itemsError.message);
      setAuthLoading(false);
      return;
    }

    setItems((itemData as DashboardItem[]) || []);
    setAuthLoading(false);
  }

  async function handleDelete(itemId: string) {
    const confirmed = window.confirm("Delete this listing?");
    if (!confirmed) return;

    try {
      setBusyItemId(itemId);
      setPageError("");
      setActionMessage("");

      const { error } = await supabase.from("items").delete().eq("id", itemId);

      if (error) {
        throw new Error(error.message);
      }

      setItems((current) => current.filter((item) => item.id !== itemId));
      setActionMessage("Listing deleted.");
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Unable to delete listing."
      );
    } finally {
      setBusyItemId(null);
    }
  }

  useEffect(() => {
    loadDashboard();

    const stripeState = searchParams.get("stripe");
    if (stripeState === "return") {
      setActionMessage("Returned from Stripe. Refreshing payout status...");
    }
    if (stripeState === "refresh") {
      setActionMessage("Please complete payout setup to continue.");
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadDashboard();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, searchParams]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      live: items.filter(
        (item) =>
          item.approval_status === "approved" && item.status === "available"
      ).length,
      pendingReview: items.filter(
        (item) => item.approval_status === "pending_review"
      ).length,
      sold: items.filter((item) => item.status === "sold").length,
    };
  }, [items]);

  const payoutReady =
    !!profile?.stripe_account_id &&
    !!profile?.stripe_payouts_enabled &&
    !!profile?.stripe_charges_enabled;

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-[28px] border border-white/10 bg-white/5 p-8">
          <p className="text-lg text-slate-300">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Seller Access Required
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Sign in to view your dashboard
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            You need an account before you can manage your marketplace listings.
          </p>

          {pageError ? (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
              {pageError}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 lg:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Seller Dashboard
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                View your submitted listings, monitor approval status, and manage
                your marketplace activity.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/sell"
                className="rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                + Create Listing
              </Link>

              <Link
                href="/shop"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Browse Shop
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-2xl border border-red-400/20 bg-red-500/10 px-6 py-4 font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "Logging Out..." : "Log Out"}
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Payout Setup
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {payoutReady ? "Stripe payouts are ready" : "Complete Stripe payout setup"}
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                  {payoutReady
                    ? "Your account is ready to accept direct marketplace payments."
                    : "Connect your Stripe account so buyers can purchase your listings and receive payouts securely."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className={`rounded-full px-3 py-1 font-semibold ${profile?.stripe_account_id ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300" : "border border-slate-400/20 bg-slate-500/10 text-slate-300"}`}>
                    Account ID {profile?.stripe_account_id ? "Added" : "Missing"}
                  </span>

                  <span className={`rounded-full px-3 py-1 font-semibold ${profile?.stripe_details_submitted ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300" : "border border-slate-400/20 bg-slate-500/10 text-slate-300"}`}>
                    Details {profile?.stripe_details_submitted ? "Submitted" : "Pending"}
                  </span>

                  <span className={`rounded-full px-3 py-1 font-semibold ${profile?.stripe_charges_enabled ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300" : "border border-slate-400/20 bg-slate-500/10 text-slate-300"}`}>
                    Charges {profile?.stripe_charges_enabled ? "Enabled" : "Pending"}
                  </span>

                  <span className={`rounded-full px-3 py-1 font-semibold ${profile?.stripe_payouts_enabled ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300" : "border border-slate-400/20 bg-slate-500/10 text-slate-300"}`}>
                    Payouts {profile?.stripe_payouts_enabled ? "Enabled" : "Pending"}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleStartPayoutSetup}
                  disabled={isStartingOnboarding}
                  className="rounded-2xl bg-green-500 px-6 py-4 font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isStartingOnboarding
                    ? "Redirecting..."
                    : payoutReady
                    ? "Update Payout Setup"
                    : "Set Up Payouts"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Total Listings</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Live Listings</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.live}</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Pending Review</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {stats.pendingReview}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Sold</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.sold}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 lg:px-12">
        {pageError ? (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
            {pageError}
          </div>
        ) : null}

        {actionMessage ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200">
            {actionMessage}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white">No listings yet</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-300">
              You have not submitted any marketplace listings yet. Create your
              first item to get started.
            </p>
            <div className="mt-8">
              <Link
                href="/sell"
                className="rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Create Your First Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">My Listings</h2>
                <p className="mt-2 text-slate-300">
                  Track which listings are live, pending review, or sold.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {items.map((item) => {
                const isApproved = item.approval_status === "approved";
                const busy = busyItemId === item.id;

                return (
                  <article
                    key={item.id}
                    className="rounded-[26px] border border-white/10 bg-slate-950/60 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-slate-300">
                              No Image
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-lg font-bold text-white">
                            ${Number(item.price).toFixed(2)}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            Submitted {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 lg:items-end">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                              item.status
                            )}`}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getApprovalBadgeClasses(
                              item.approval_status
                            )}`}
                          >
                            {item.approval_status === "pending_review"
                              ? "Pending Review"
                              : item.approval_status
                              ? item.approval_status.charAt(0).toUpperCase() +
                                item.approval_status.slice(1)
                              : "Unknown"}
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                            {item.listing_source || "marketplace"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {isApproved ? (
                            <Link
                              href={`/shop/${item.slug}`}
                              className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
                            >
                              View Listing
                            </Link>
                          ) : (
                            <span className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-400">
                              Not Public Yet
                            </span>
                          )}

                          <Link
                            href={`/dashboard/edit/${item.id}`}
                            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={busy}
                            className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {busy ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}