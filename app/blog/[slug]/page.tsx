import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

function formatContent(content: string) {
  return content
    .trim()
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | King of Sports Collectibles",
    };
  }

  return {
    title: post.seoTitle,
    description: post.metaDescription,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const blocks = formatContent(post.content);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 lg:px-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-blue-300 transition hover:text-blue-200"
          >
            ← Back to Blog
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              {post.category}
            </span>
            <span className="text-sm text-slate-400">{post.publishedAt}</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {post.excerpt}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10 lg:px-12">
        <article className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl md:p-10">
          <div className="prose prose-invert max-w-none">
            {blocks.map((block, index) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="mt-10 text-3xl font-bold tracking-tight text-white"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }

              if (block.startsWith("### ")) {
                return (
                  <h3
                    key={index}
                    className="mt-8 text-2xl font-semibold text-white"
                  >
                    {block.replace("### ", "")}
                  </h3>
                );
              }

              if (block.startsWith("👉 ")) {
                return (
                  <div
                    key={index}
                    className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5 text-blue-100"
                  >
                    {block.replace("👉 ", "")}
                  </div>
                );
              }

              return (
                <p
                  key={index}
                  className="mt-6 text-lg leading-8 text-slate-300"
                >
                  {block}
                </p>
              );
            })}
          </div>
        </article>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-900">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Need Help With an Item?
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Get a professional appraisal
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                If you have a sports card, signed baseball, jersey, or other
                memorabilia and want to know what it may be worth, submit your
                item and we’ll help you take the next step.
              </p>
            </div>

            <div className="flex flex-col gap-4">
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