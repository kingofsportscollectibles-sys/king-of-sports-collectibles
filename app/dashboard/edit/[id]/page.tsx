"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type EditableItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string | null;
  player: string | null;
  team: string | null;
  sport: string | null;
  year: number | null;
  item_type: string | null;
  category: string | null;
  condition: string | null;
  authentication: string | null;
  image_url: string | null;
  seller_id: string | null;
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

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
  const [originalSlug, setOriginalSlug] = useState("");

  const previewSlug = useMemo(() => slugify(title || "your-item-title"), [title]);

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      setPageError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setPageError(sessionError.message);
        setLoading(false);
        return;
      }

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("items")
        .select(
          "id, title, slug, price, description, player, team, sport, year, item_type, category, condition, authentication, image_url, seller_id"
        )
        .eq("id", id)
        .eq("seller_id", session.user.id)
        .maybeSingle();

      if (error) {
        setPageError(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setPageError("Listing not found or you do not have access to edit it.");
        setLoading(false);
        return;
      }

      const item = data as EditableItem;

      setTitle(item.title ?? "");
      setPrice(item.price?.toString() ?? "");
      setDescription(item.description ?? "");
      setPlayer(item.player ?? "");
      setTeam(item.team ?? "");
      setSport(item.sport ?? "");
      setYear(item.year?.toString() ?? "");
      setItemType(item.item_type ?? "");
      setCategory(item.category ?? "");
      setCondition(item.condition ?? "");
      setAuthentication(item.authentication ?? "");
      setImageUrl(item.image_url ?? "");
      setOriginalSlug(item.slug ?? "");
      setLoading(false);
    }

    if (id) {
      loadItem();
    }
  }, [id, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const newSlug = title.trim() ? slugify(title) : originalSlug;

      const updates = {
        title: title.trim(),
        slug: newSlug,
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
        approval_status: "pending_review",
      };

      const { error } = await supabase.from("items").update(updates).eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage("Listing updated and sent back for review.");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Unable to update listing."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/5 p-8">
          Loading listing editor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10 lg:px-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-blue-300 transition hover:text-blue-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Edit Listing
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Update your listing
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Editing a listing sends it back to pending review so changes can be checked before it goes live.
          </p>

          {pageError ? (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
              {pageError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Player
                </label>
                <input
                  type="text"
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Team
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Year
                </label>
                <input
                  type="number"
                  min="1800"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Sport
                </label>
                <select
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
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Item Type
                </label>
                <select
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
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Category
                </label>
                <select
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
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Condition
                </label>
                <select
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
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Authentication
                </label>
                <input
                  type="text"
                  value={authentication}
                  onChange={(e) => setAuthentication(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Updated URL Preview</p>
              <p className="mt-2 break-all text-slate-200">/shop/{previewSlug}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <Link
                href="/dashboard"
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