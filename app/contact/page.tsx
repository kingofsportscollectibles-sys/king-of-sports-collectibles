"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const contactOptions = [
  {
    title: "Appraisals",
    description:
      "Want to know what your sports card or memorabilia may be worth? Start here for valuation guidance.",
  },
  {
    title: "Consignment",
    description:
      "Have a valuable item and want help selling it? Reach out to discuss listing and consignment options.",
  },
  {
    title: "Custom Framing",
    description:
      "Protect and display your signed jerseys, photos, and memorabilia with presentation-focused framing support.",
  },
  {
    title: "General Questions",
    description:
      "Not sure where to start? Contact us and we’ll point you in the right direction.",
  },
];

const reasons = [
  "Submit an item for appraisal",
  "Ask about selling or consignment",
  "Get help with a collection review",
  "Inquire about framing options",
  "Reach out with buyer questions",
];

export default function ContactPage() {
      const searchParams = useSearchParams();
  const itemFromUrl = searchParams.get("item") || "";
  const [status, setStatus] = useState<
    | "idle"
    | "submitting"
    | "success"
    | "missing-api-key"
    | "missing-fields"
    | "email-failed"
    | "server-error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
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
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Contact
              </p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let’s talk about your sports collectibles
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Whether you want an appraisal, need help selling a valuable
                item, or just have a question about your memorabilia, King of Sports Collectibles is built to help
                you take the next step with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/get-appraised"
                  className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
                >
                  Start an Appraisal
                </a>
                <a
                  href="/shop"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Browse the Shop
                </a>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[26px] border border-white/10 bg-slate-900 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Ways We Can Help
                </p>

                <div className="mt-6 space-y-4">
                  {reasons.map((reason) => (
                    <div
                      key={reason}
                      className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-slate-200"
                    >
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Reach Out
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start the conversation
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Use the form to reach out about appraisals, selling, framing, or general questions.
            </p>

            <div className="mt-8 space-y-4">
              {contactOptions.map((option) => (
                <div
                  key={option.title}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {option.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold text-white">
              Contact King of Sports Collectibles
            </h3>
            <p className="mt-2 text-slate-400">
              Tell us a little about your item or question and we’ll guide you
              toward the best next step.
            </p>

            {status === "success" && (
              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-emerald-200">
                Your inquiry was sent successfully.
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
                    "Your inquiry could not be sent. Please try again."}
                  {status === "server-error" &&
                    "Something went wrong on the server. Please try again."}
                </div>
              )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <input
                name="phone"
                type="text"
                placeholder="Phone Number (Optional)"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              />

              <select
                name="inquiryType"
                required
                defaultValue=""
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
              >
                <option value="" disabled className="bg-slate-900">
                  What do you need help with?
                </option>
                <option className="bg-slate-900">Appraisal</option>
                <option className="bg-slate-900">Consignment</option>
                <option className="bg-slate-900">Sell My Item</option>
                <option className="bg-slate-900">Custom Framing</option>
                <option className="bg-slate-900">General Question</option>
              </select>

              <input
  name="itemName"
  type="text"
  placeholder="Item Name / Player / Team / Year (Optional)"
  defaultValue={itemFromUrl}
  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
/>

              <textarea
                name="message"
                rows={6}
                placeholder="Tell us about your item or question..."
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}