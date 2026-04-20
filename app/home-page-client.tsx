"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function HomePageClient({
  featuredItems,
}: {
  featuredItems: Item[];
}) {
  const [status, setStatus] = useState<
    | "idle"
    | "submitting"
    | "success"
    | "missing-api-key"
    | "missing-fields"
    | "email-failed"
    | "server-error"
  >("idle");

  const services = [
    {
      title: "Appraisals",
      description:
        "Get a market-based estimate for sports cards, autographs, jerseys, helmets, balls, and other memorabilia.",
    },
    {
      title: "Consignment",
      description:
        "Let us help you sell valuable collectibles through a trusted process designed to maximize buyer interest.",
    },
    {
      title: "Direct Sales",
      description:
        "We help collectors move quality items through featured listings and direct buyer interest.",
    },
  ];

  const trackerStats = [
    { label: "Items Appraised", value: "150+" },
    { label: "Collector Leads", value: "75+" },
    { label: "Featured Listings", value: "25+" },
  ];

  const heroItem = featuredItems[0] ?? null;

  async function handleHomepageLeadSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/homepage-lead", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus(result.error || "server-error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("server-error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-300">
                Appraisals • Consignment • Collectibles
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Sports collectible appraisals and consignment built for serious collectors
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                King of Sports Collectibles helps collectors understand what
                their items are worth, explore consignment options, and move
                valuable memorabilia with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#lead-form"
                  className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400"
                >
                  Get Item Appraised
                </a>
                <a
                  href="#consignment-section"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Consignment
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {trackerStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[24px] border border-white/10 bg-slate-900 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                      Featured Collectible
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Recent Spotlight
                    </h2>
                  </div>

                  {heroItem && (
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Featured
                    </span>
                  )}
                </div>

                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950 p-8 text-center">
                  {heroItem?.image_url ? (
                    <Image
                      src={heroItem.image_url}
                      alt={heroItem.title}
                      width={800}
                      height={800}
                      className="mx-auto h-52 w-full max-w-md rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="mx-auto flex h-52 w-full max-w-md items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
                      Featured Item Preview
                    </div>
                  )}

                  <h3 className="mt-6 text-2xl font-semibold">
                    {heroItem?.title || "Featured Listing Coming Soon"}
                  </h3>

                  <p className="mt-2 text-slate-400">
                    {heroItem?.description
                      ? heroItem.description.length > 110
                        ? `${heroItem.description.slice(0, 110)}...`
                        : heroItem.description
                      : "Examples of featured sports collectibles and memorabilia can be highlighted here as social proof."}
                  </p>

                  {heroItem && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <span className="text-3xl font-bold text-white">
                        ${Number(heroItem.price).toFixed(2)}
                      </span>
                      <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                        {heroItem.category || heroItem.item_type || "Featured"}
                      </span>
                    </div>
                  )}

                  {heroItem ? (
                    <Link
                      href={`/shop/${heroItem.slug}`}
                      className="mt-6 inline-block rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
                    >
                      View Item
                    </Link>
                  ) : (
                    <a
                      href="#lead-form"
                      className="mt-6 inline-block rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
                    >
                      Start With an Appraisal
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            What We Do
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for collectors who want value, visibility, and trust
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            From quick appraisal requests to full-service consignment and direct
            sales support, the business is built to help collectors make smart
            next moves.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <h3 className="text-xl font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Appraisal Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Get a clearer idea of what your collectible may be worth
              </h2>

              <div className="mt-8 space-y-4">
                {[
                  "Submit photos and key details about your card, autograph, jersey, helmet, ball, or memorabilia item.",
                  "We review condition, authentication, comparable sales, and overall market demand.",
                  "You receive guidance on estimated value and the best next step, whether that is hold, consign, or sell.",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-2 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>

              <a
                href="#lead-form"
                className="mt-8 inline-block rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
              >
                Request an Appraisal
              </a>
            </div>

            <div id="consignment-section">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Consignment Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn valuable items into serious buyer interest
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                If you have quality memorabilia or cards and want help selling,
                consignment gives you a cleaner path than handling everything
                yourself.
              </p>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-slate-950 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Best For</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Valuable Items
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Goal</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Better Exposure
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Focus</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Serious Buyers
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4 text-slate-200">
                  <li>• We help review the item and selling potential</li>
                  <li>• We identify the best path to market the piece</li>
                  <li>• We help turn interest into a sale-focused process</li>
                </ul>

                <a
                  href="#lead-form"
                  className="mt-8 inline-block rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Ask About Consignment
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="featured-items"
        className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Featured Items
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Showcase a few standout collectibles as proof of quality
            </h2>
          </div>
          <a
            href="#lead-form"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Ask About Selling Yours
          </a>
        </div>

        {featuredItems.length === 0 ? (
          <div className="mt-12 rounded-[24px] border border-white/10 bg-white/5 p-10 text-center text-slate-300">
            Featured items will appear here once they are added in Supabase.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={600}
                    height={600}
                    className="h-52 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
                    Image Placeholder
                  </div>
                )}

                <div className="mt-5">
                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                    {item.category || item.item_type || "Collectible"}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-2xl font-bold text-white">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  <Link
                    href={`/shop/${item.slug}`}
                    className="mt-5 inline-block rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-white/10 bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Appraisal or Consignment
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Start with the service that fits your goal
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Some collectors just want to know what they have. Others are
                ready to move a valuable item. This form helps us point you in
                the right direction quickly.
              </p>

              <ul className="mt-8 space-y-4 text-slate-200">
                <li>• Choose appraisal if you want market-based guidance</li>
                <li>• Choose consignment if you want help selling</li>
                <li>• Add details so we can respond more effectively</li>
              </ul>
            </div>

            <div
              id="lead-form"
              className="rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl"
            >
              <h3 className="text-2xl font-semibold text-white">
                Get started with your item
              </h3>
              <p className="mt-2 text-slate-400">
                Tell us whether you need an appraisal or consignment help and we’ll follow up with the right next step.
              </p>

              {status === "success" && (
                <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-emerald-200">
                  Your request was sent successfully.
                </div>
              )}

              {status !== "idle" &&
                status !== "submitting" &&
                status !== "success" && (
                  <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-red-200">
                    {status === "missing-api-key" &&
                      "The email service is not configured yet. Please check the RESEND_API_KEY in .env.local."}
                    {status === "missing-fields" &&
                      "Please fill in all required fields."}
                    {status === "email-failed" &&
                      "Your request could not be sent. Please try again."}
                    {status === "server-error" &&
                      "Something went wrong on the server. Please try again."}
                  </div>
                )}

              <form
                onSubmit={handleHomepageLeadSubmit}
                className="mt-6 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <select
                  name="serviceNeeded"
                  required
                  defaultValue=""
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="" disabled className="bg-slate-900">
                    Select Service Needed
                  </option>
                  <option value="Appraisal" className="bg-slate-900">
                    Appraisal
                  </option>
                  <option value="Consignment" className="bg-slate-900">
                    Consignment
                  </option>
                  <option value="Sell My Item" className="bg-slate-900">
                    Sell My Item
                  </option>
                </select>

                <textarea
                  name="details"
                  rows={5}
                  placeholder="Tell us about your item, player, condition, authentication, and what you are hoping to do with it..."
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-white">
                King of Sports Collectibles
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Sports memorabilia sales, consignment, appraisals, and framing.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
              <Link href="/services" className="transition hover:text-white">
                Services
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
              <Link href="/terms" className="transition hover:text-white">
  Terms of Service
</Link>
<Link href="/privacy" className="transition hover:text-white">
  Privacy Policy
</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}