import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Item not found
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          The collectible you’re looking for may have been removed, sold, or the
          link may be incorrect.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
        >
          Back to Shop
        </Link>
      </div>
    </main>
  );
}