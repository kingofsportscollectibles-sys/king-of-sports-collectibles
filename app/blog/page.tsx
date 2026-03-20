import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Blog
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Collector insights, appraisal guidance, and selling advice
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              In-depth guides and insights to help you value, sell, and understand sports cards and memorabilia like a seasoned collector.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Latest Articles
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Content built for collectors and sellers
            </h2>
          </div>

          <Link
            href="/get-appraised"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Get an Appraisal
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                  {post.category}
                </span>
                <span className="text-sm text-slate-400">
                  {post.publishedAt}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-white">
                {post.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">{post.excerpt}</p>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-block font-semibold text-blue-300 transition hover:text-blue-200"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Need Help With an Item?
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn questions into action
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                If you have a sports card, signed baseball, jersey, or other
                memorabilia and want to know what it may be worth, we can help
                you take the next step.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Link
                href="/get-appraised"
                className="rounded-2xl bg-blue-500 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-400"
              >
                Start an Appraisal Request
              </Link>
              <Link
                href="/contact"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}