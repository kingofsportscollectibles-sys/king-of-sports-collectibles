import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Item = {
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
  status: string;
  featured: boolean;
  image_url: string | null;
};

async function getItem(slug: string): Promise<Item | null> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Supabase item fetch error:", error);
    return null;
  }

  return data;
}

export default async function ShopItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) {
    notFound();
  }

  const statusStyles =
    item.status === "available"
      ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
      : item.status === "pending"
      ? "border border-amber-400/20 bg-amber-500/10 text-amber-300"
      : "border border-slate-400/20 bg-slate-500/10 text-slate-300";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center text-sm font-medium text-blue-300 transition hover:text-blue-200"
            >
              ← Back to Shop
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={1200}
                    height={1200}
                    className="h-auto w-full rounded-[24px] object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-[500px] items-center justify-center rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                  {item.category || item.item_type || "Collectible"}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                {item.featured && (
                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    Featured Listing
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {item.title}
              </h1>

              <p className="mt-6 text-4xl font-bold text-white">
                ${Number(item.price).toFixed(2)}
              </p>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                {item.description || "No description available yet."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Player</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.player || "—"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Team</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.team || "—"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Sport</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.sport || "—"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Year</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.year || "—"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Item Type</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.item_type || "—"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Condition</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.condition || "—"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:col-span-2">
                  <p className="text-sm text-slate-400">Authentication</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.authentication || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`/contact?item=${encodeURIComponent(item.title)}`}
                  className="rounded-2xl bg-blue-500 px-6 py-4 text-center font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
                >
                  Inquire About This Item
                </Link>

                <Link
                  href="/get-appraised"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Sell a Similar Item
                </Link>
              </div>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">
                  Buyer Notes
                </h2>
                <p className="mt-3 leading-7 text-slate-300">
                  Interested in this item? Use the inquiry button above and we
                  can answer questions about availability, condition, shipping,
                  and next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}