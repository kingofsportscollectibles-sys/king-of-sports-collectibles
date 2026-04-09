"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "seller" | "admin";
};

const sportOptions = ["MLB", "NFL", "NBA", "NHL", "Golf", "Soccer", "NCAA", "Other"];

const categoryOptions = [
  "Sports Cards",
  "Signed Jerseys",
  "Autographed Baseballs",
  "Helmets",
  "Photos",
  "Game-Used",
  "Graded Cards",
  "Tickets",
  "Bats",
  "Balls",
  "Programs",
  "Other",
];

const itemTypeOptions = [
  "Card",
  "Jersey",
  "Baseball",
  "Football",
  "Basketball",
  "Helmet",
  "Photo",
  "Bat",
  "Ticket",
  "Program",
  "Equipment",
  "Other",
];

const conditionOptions = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
  "Game Used",
  "Used",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from("items")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export default function SellPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [player, setPlayer] = useState("");
  const [team, setTeam] = useState("");
  const [sport, setSport] = useState("");
  const [year, setYear] = useState("");
  const [itemType, setItemType] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [authentication, setAuthentication] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const previewSlug = useMemo(() => slugify(title || "your-item-title"), [title]);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setAuthLoading(true);
      setPageError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setPageError(sessionError.message);
        setAuthLoading(false);
        return;
      }

      if (!session?.user) {
        setUserId(null);
        setProfile(null);
        setAuthLoading(false);
        return;
      }

      const user = session.user;
      setUserId(user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, display_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        setPageError(profileError.message);
        setAuthLoading(false);
        return;
      }

      if (!profileData) {
        const newProfile = {
          id: user.id,
          email: user.email ?? null,
          display_name: user.user_metadata?.display_name ?? null,
          role: "seller" as const,
        };

        const { error: insertProfileError } = await supabase
          .from("profiles")
          .insert(newProfile);

        if (!mounted) return;

        if (insertProfileError) {
          setPageError(insertProfileError.message);
          setAuthLoading(false);
          return;
        }

        setProfile(newProfile);
      } else {
        setProfile(profileData as Profile);
      }

      setAuthLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      setSubmitError(sessionError.message);
      return;
    }

    if (!session?.user) {
      setSubmitError("You must be logged in to submit a listing.");
      return;
    }

    const currentUser = session.user;

    if (!title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setSubmitError("Please enter a valid price.");
      return;
    }

    setIsSubmitting(true);

    try {
      const baseSlug = slugify(title);
      const finalSlug = await generateUniqueSlug(baseSlug);

      const payload = {
        title: title.trim(),
        slug: finalSlug,
        price: Number(price),
        description: description.trim() || null,
        player: player.trim() || null,
        team: team.trim() || null,
        sport: sport.trim() || null,
        year: year ? Number(year) : null,
        item_type: itemType.trim() || null,
        category: category.trim() || null,
        condition: condition.trim() || null,
        authentication: authentication.trim() || null,
        image_url: imageUrl.trim() || null,
        status: "pending",
        featured: false,
        seller_id: currentUser.id,
        seller_name:
          profile?.display_name?.trim() ||
          profile?.email?.split("@")[0] ||
          "Marketplace Seller",
        contact_email: profile?.email ?? currentUser.email ?? null,
        approval_status: "pending_review",
        listing_source: "marketplace",
        submitted_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("items").insert(payload);

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage(
        "Your listing was submitted successfully and is now pending review."
      );

      setTitle("");
      setPrice("");
      setDescription("");
      setPlayer("");
      setTeam("");
      setSport("");
      setYear("");
      setItemType("");
      setCategory("");
      setCondition("");
      setAuthentication("");
      setImageUrl("");

      setTimeout(() => {
        router.push("/shop");
      }, 1500);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong submitting your listing."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-8">
          <p className="text-lg text-slate-300">Loading seller access...</p>
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
            Sign in to list an item
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            You need an account before you can submit a marketplace listing.
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
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 lg:px-12">
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center text-sm font-medium text-blue-300 transition hover:text-blue-200"
            >
              ← Back to Shop
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Marketplace Seller Submission
              </p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                List your sports collectible
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Submit your item for review. Once approved, it will appear in the King
                of Sports Collectibles marketplace.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Step 1</p>
                  <p className="mt-2 font-semibold text-white">Complete the form</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Step 2</p>
                  <p className="mt-2 font-semibold text-white">We review the listing</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Step 3</p>
                  <p className="mt-2 font-semibold text-white">Approved items go live</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Seller Preview
              </p>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Title</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {title || "Your item title will appear here"}
                </p>

                <p className="mt-5 text-sm text-slate-400">Estimated URL</p>
                <p className="mt-2 break-all text-slate-200">/shop/{previewSlug}</p>

                <p className="mt-5 text-sm text-slate-400">Price</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {price ? `$${Number(price).toFixed(2)}` : "$0.00"}
                </p>

                <p className="mt-5 text-sm text-slate-400">Seller</p>
                <p className="mt-2 text-slate-200">
                  {profile?.display_name || profile?.email || "Marketplace Seller"}
                </p>

                <p className="mt-5 text-sm text-slate-400">Listing status on submit</p>
                <p className="mt-2 text-amber-300">Pending Review</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10 lg:px-12">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl md:p-8">
          {pageError ? (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
              {pageError}
            </div>
          ) : null}

          {submitError ? (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
              {submitError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-200">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="1996 Kobe Bryant Topps RC PSA 10"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-200">
                  Price *
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250.00"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe the item, condition, provenance, and anything a buyer should know."
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="player" className="mb-2 block text-sm font-medium text-slate-200">
                  Player
                </label>
                <input
                  id="player"
                  type="text"
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                  placeholder="Kobe Bryant"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>

              <div>
                <label htmlFor="team" className="mb-2 block text-sm font-medium text-slate-200">
                  Team
                </label>
                <input
                  id="team"
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Lakers"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>

              <div>
                <label htmlFor="year" className="mb-2 block text-sm font-medium text-slate-200">
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  min="1800"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="1996"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="sport" className="mb-2 block text-sm font-medium text-slate-200">
                  Sport
                </label>
                <select
                  id="sport"
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                >
                  <option value="">Select sport</option>
                  {sportOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="itemType"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Item Type
                </label>
                <select
                  id="itemType"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                >
                  <option value="">Select type</option>
                  {itemTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Condition
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="authentication"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Authentication
                </label>
                <input
                  id="authentication"
                  type="text"
                  value={authentication}
                  onChange={(e) => setAuthentication(e.target.value)}
                  placeholder="PSA / JSA / Beckett / None"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="imageUrl"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Image URL
                </label>
               <input
  id="imageUrl"
  type="url"
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
  placeholder="Optional (you can add later)"
  className="..."
/>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950 p-5">
              <h2 className="text-lg font-semibold text-white">What happens next?</h2>
              <p className="mt-3 leading-7 text-slate-300">
                Your listing will be saved with a{" "}
                <span className="font-semibold text-amber-300">Pending Review</span> status.
                After approval, it will appear in the marketplace.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Listing"}
              </button>

              <Link
                href="/shop"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}