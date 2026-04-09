import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import QuickBuyButton from "@/components/QuickBuyButton";

export const dynamic = "force-dynamic";

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
  seller_payment_ready: boolean | null;
};

const shopCategories = [
  "Sports Cards",
  "Signed Jerseys",
  "Autographed Baseballs",
  "Helmets",
  "Photos",
  "Game-Used",
  "Graded Cards",
  "Featured Deals",
];

const benefits = [
  {
    title: "Collector-Focused Listings",
    description:
      "Each listing is designed to highlight the details buyers care about most, from condition to authentication.",
  },
  {
    title: "Future Direct Checkout",
    description:
      "The long-term plan is to support direct purchases through the website for a smoother buying experience.",
  },
  {
    title: "Seller Opportunity",
    description:
      "Over time, sellers will be able to submit items for approval and listing directly on the marketplace.",
  },
];

async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("approval_status", "approved")
    .in("status", ["available", "pending", "sold"])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase shop fetch error:", error);
    return [];
  }

  return data ?? [];
}

export default async function ShopPage() {
  const items = await getItems();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Shop Collectibles
              </p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Browse sports collectibles, memorabilia, and featured listings
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Explore available sports cards, autographs, signed memorabilia,
                and premium collectibles listed through King of Sports
                Collectibles.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
                >
                  Ask About an Item
                </a>
                <a
                  href="/get-appraised"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Sell or Consign Yours
                </a>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[26px] border border-white/10 bg-slate-900 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Marketplace Vision
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Today</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Featured listings and inquiry-based sales
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Next</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Direct website purchases and a stronger inventory system
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Future</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Seller submissions, approved listings, and a full
                      marketplace experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {shopCategories.map((category) => (
              <button
                key={category}
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Shop available sports collectibles
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Explore current inventory from King of Sports Collectibles, featuring graded cards, signed memorabilia, and other collector-worthy items available for purchase or inquiry.
            </p>
          </div>

          <a
            href="/contact"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Need Help Finding Something?
          </a>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-[28px] border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-2xl font-semibold text-white">
              No live listings yet
            </h3>
            <p className="mt-4 text-slate-300">
              Add your first item in Supabase and it will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const isAvailable = item.status === "available";
              const isSold = item.status === "sold";
              const canQuickBuy = isAvailable && !!item.seller_payment_ready;

              return (
                <article
                  key={item.id}
                  className="group rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:bg-white/[0.07]"
                >
                  <div className="relative">
                    <Image
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.title}
                      width={600}
                      height={600}
                      className="h-60 w-full rounded-[22px] object-cover"
                    />

                    {!item.image_url && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-[22px] bg-black/35 text-sm font-medium text-white">
                        No Image
                      </div>
                    )}

                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                        isAvailable
                          ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                          : isSold
                          ? "border border-slate-400/20 bg-slate-500/10 text-slate-300"
                          : "border border-amber-400/20 bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {isAvailable ? "Available" : isSold ? "Sold" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                      {item.category || item.item_type || "Collectible"}
                    </span>

                    <h3 className="mt-4 text-2xl font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 leading-7 text-slate-300">
                      {item.description || "No description available yet."}
                    </p>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-2xl font-bold text-white">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {canQuickBuy ? <QuickBuyButton itemId={item.id} /> : null}

                        <Link
                          href={`/shop/${item.slug}`}
                          className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {isSold ? (
                      <p className="mt-3 text-sm text-slate-300">
                        This item has been sold.
                      </p>
                    ) : isAvailable && !item.seller_payment_ready ? (
                      <p className="mt-3 text-sm text-amber-300">
                        Checkout available soon
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Why This Marketplace Works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built to make buying and selling sports collectibles easier
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                The goal is to create a shop that feels trustworthy, clean, and
                easy to use while also leaving room for a full marketplace
                system, seller submissions, and future checkout automation.
              </p>
            </div>

            <div className="grid gap-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-[26px] border border-white/10 bg-slate-950 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}