"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AdminItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: string;
  approval_status: string | null;
  listing_source: string | null;
  seller_id: string | null;
  seller_name: string | null;
  contact_email: string | null;
  created_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  featured: boolean;
  image_url: string | null;
};

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "seller" | "admin";
};

function formatDate(value: string | null) {
  if (!value) return "—";
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

export default function AdminListingsPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [pageError, setPageError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  async function loadAdminPage() {
    setAuthLoading(true);
    setPageError("");
    setActionMessage("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      setPageError(sessionError.message);
      setAuthLoading(false);
      return;
    }

    if (!session?.user) {
      setProfile(null);
      setItems([]);
      setAuthLoading(false);
      return;
    }

    const user = session.user;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, display_name, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setPageError(profileError.message);
      setAuthLoading(false);
      return;
    }

    if (!profileData || profileData.role !== "admin") {
      setProfile(profileData as Profile);
      setItems([]);
      setAuthLoading(false);
      return;
    }

    setProfile(profileData as Profile);

    const { data: itemData, error: itemsError } = await supabase
      .from("items")
      .select(
        "id, title, slug, price, status, approval_status, listing_source, seller_id, seller_name, contact_email, created_at, submitted_at, approved_at, featured, image_url"
      )
      .order("created_at", { ascending: false });

    if (itemsError) {
      setPageError(itemsError.message);
      setAuthLoading(false);
      return;
    }

    setItems((itemData as AdminItem[]) || []);
    setAuthLoading(false);
  }

  useEffect(() => {
    loadAdminPage();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAdminPage();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function updateItem(
    itemId: string,
    updates: Partial<AdminItem>,
    successText: string
  ) {
    try {
      setBusyItemId(itemId);
      setPageError("");
      setActionMessage("");

      const { error } = await supabase.from("items").update(updates).eq("id", itemId);

      if (error) {
        throw new Error(error.message);
      }

      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      );

      setActionMessage(successText);
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Something went wrong updating the listing."
      );
    } finally {
      setBusyItemId(null);
    }
  }

  async function deleteItem(itemId: string) {
    const confirmed = window.confirm("Delete this listing permanently?");
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
        error instanceof Error ? error.message : "Something went wrong deleting the listing."
      );
    } finally {
      setBusyItemId(null);
    }
  }

  const stats = useMemo(() => {
    return {
      total: items.length,
      pendingReview: items.filter((item) => item.approval_status === "pending_review").length,
      approved: items.filter((item) => item.approval_status === "approved").length,
      rejected: items.filter((item) => item.approval_status === "rejected").length,
    };
  }, [items]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-white/5 p-8">
          <p className="text-lg text-slate-300">Loading admin listings...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Admin Access Required
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Sign in to access admin listings
          </h1>
          <div className="mt-8">
            <Link
              href="/login"
              className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (profile.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
            Restricted
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            You do not have admin access
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            This page is only available to marketplace admins.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Admin Listings
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Listing Review Center
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                Review marketplace submissions, approve listings, reject low-quality entries,
                and manage live inventory.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Seller Dashboard
              </Link>
              <Link
                href="/shop"
                className="rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Browse Shop
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Total Listings</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Pending Review</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.pendingReview}</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Approved</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.approved}</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Rejected</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
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

        <div className="grid gap-5">
          {items.map((item) => {
            const busy = busyItemId === item.id;

            return (
              <article
                key={item.id}
                className="rounded-[26px] border border-white/10 bg-white/5 p-6 shadow-xl"
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-slate-300">No Image</span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 text-xl font-bold text-white">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getApprovalBadgeClasses(
                            item.approval_status
                          )}`}
                        >
                          {item.approval_status || "unknown"}
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                          {item.listing_source || "marketplace"}
                        </span>

                        {item.featured && (
                          <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="mt-4 space-y-1 text-sm text-slate-400">
                        <p>Seller: {item.seller_name || "Unknown Seller"}</p>
                        <p>Email: {item.contact_email || "—"}</p>
                        <p>Created: {formatDate(item.created_at)}</p>
                        <p>Submitted: {formatDate(item.submitted_at)}</p>
                        <p>Approved: {formatDate(item.approved_at)}</p>
                        <p>Slug: /shop/{item.slug}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:items-end">
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={busy}
                        onClick={() =>
                          updateItem(
                            item.id,
                            {
                              approval_status: "approved",
                              status: "available",
                              approved_at: new Date().toISOString(),
                            },
                            "Listing approved."
                          )
                        }
                        className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Approve
                      </button>

                      <button
                        disabled={busy}
                        onClick={() =>
                          updateItem(
                            item.id,
                            {
                              approval_status: "rejected",
                            },
                            "Listing rejected."
                          )
                        }
                        className="rounded-2xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reject
                      </button>

                      <button
                        disabled={busy}
                        onClick={() =>
                          updateItem(
                            item.id,
                            {
                              status: "sold",
                            },
                            "Listing marked as sold."
                          )
                        }
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Mark Sold
                      </button>

                      <button
                        disabled={busy}
                        onClick={() =>
                          updateItem(
                            item.id,
                            {
                              featured: !item.featured,
                            },
                            item.featured ? "Listing unfeatured." : "Listing featured."
                          )
                        }
                        className="rounded-2xl border border-purple-400/20 bg-purple-500/10 px-4 py-3 font-semibold text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {item.featured ? "Unfeature" : "Feature"}
                      </button>

                      <button
                        disabled={busy}
                        onClick={() => deleteItem(item.id)}
                        className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {item.approval_status === "approved" ? (
                        <Link
                          href={`/shop/${item.slug}`}
                          className="rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400"
                        >
                          View Public Page
                        </Link>
                      ) : (
                        <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-400">
                          Not Public Yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}