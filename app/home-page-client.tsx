"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

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
        "Browse featured collectibles and memorabilia available for purchase directly through King of Sports Collectibles.",
    },
    {
      title: "Custom Framing",
      description:
        "Preserve and display your prized signed jerseys, photos, and memorabilia with clean custom framing options.",
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
                Buy • Sell • Appraise
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                The modern home for sports collectibles and memorabilia
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                King of Sports Collectibles helps collectors buy, sell,
            appraise, and preserve valuable sports memorabilia with
                confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#lead-form"
                  className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400"
                >
                  Get Item Appraised
                </a>
                <a
                  href="#featured-items"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Shop Featured Items
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
                      Marketplace Preview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Featured Listing
                    </h2>
                  </div>

                  {heroItem && (
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Available
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
                      Item Image Placeholder
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
                      : "Browse our latest featured sports collectibles and memorabilia."}
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
                      View Listing
                    </Link>
                  ) : (
                    <Link
                      href="/shop"
                      className="mt-6 inline-block rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
                    >
                      Visit Shop
                    </Link>
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
            sales support, the site is built to serve buyers, sellers, and
            collectors.
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
                How It Works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                A simple path from item question to next move
              </h2>

              <div className="mt-8 space-y-4">
                {[
                  "Submit photos and details of your sports card or memorabilia.",
                  "We review the item, market demand, comps, and sale potential.",
                  "You decide whether to appraise, sell, consign, frame, or hold.",
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
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Why Collectors Work With Us
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                A cleaner, simpler way to buy, sell, and appraise collectibles
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                We focus on helping collectors understand what they have,
                explore selling options, and shop quality memorabilia through a
                trusted, easy-to-use experience.
              </p>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-slate-950 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Focused On</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Appraisals
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Built For</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Collectors
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                    <p className="text-sm text-slate-400">Designed To</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Build Trust
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4 text-slate-200">
                  <li>• Market-based appraisals and selling guidance</li>
                  <li>• Quality featured listings and memorabilia sales</li>
                  <li>• Consignment support for valuable items</li>
                </ul>
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
              Featured Listings
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A preview of what buyers can shop directly on the site
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
                For Sellers & Collectors
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Whether you want to sell or just know the value of what you have,
                we can help
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                The goal is simple: make it easier for collectors to understand
                their items, unlock value, and connect with the right buyers.
              </p>

              <ul className="mt-8 space-y-4 text-slate-200">
                <li>• Market-based appraisals</li>
                <li>• Consignment options for valuable items</li>
                <li>• Direct website listings and sales</li>
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
                Tell us a little about your item and we’ll help point you in the
                right direction.
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
                    Service Needed
                  </option>
                  <option className="bg-slate-900">Appraisal</option>
                  <option className="bg-slate-900">Consignment</option>
                  <option className="bg-slate-900">Sell My Item</option>
                  <option className="bg-slate-900">Custom Framing</option>
                </select>

                <textarea
                  name="details"
                  rows={5}
                  placeholder="Tell us about your item..."
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

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Blog & Insights
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn how to value, sell, and understand your collectibles
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Articles designed to help collectors make smarter decisions and
              understand what their items are worth.
            </p>
          </div>

          <Link
            href="/blog"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            View All Articles
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <article
              key={post.slug}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                  {post.category}
                </span>
                <span className="text-sm text-slate-400">
                  {post.publishedAt}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-white">
                {post.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-300">{post.excerpt}</p>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-block font-semibold text-blue-300 transition hover:text-blue-200"
              >
                Read More →
              </Link>
            </article>
          ))}
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
              <Link href="/shop" className="transition hover:text-white">
                Shop
              </Link>
              <Link href="/blog" className="transition hover:text-white">
                Blog
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}