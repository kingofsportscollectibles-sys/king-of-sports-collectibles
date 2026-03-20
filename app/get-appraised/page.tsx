"use client";

import { useState } from "react";

export default function GetAppraisedPage() {
  const [status, setStatus] = useState<
    | "idle"
    | "submitting"
    | "success"
    | "missing-api-key"
    | "missing-fields"
    | "email-failed"
    | "file-too-large"
    | "too-many-files"
    | "bad-file-type"
    | "server-error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/appraisal", {
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
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 lg:px-12">
          <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Get Appraised
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Get Your Item Appraised
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Submit the details of your sports card or memorabilia and attach a
            few photos so we can review the item more accurately.
          </p>

          {status === "success" && (
            <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-emerald-200">
              Your appraisal request was sent successfully.
            </div>
          )}

          {status !== "idle" &&
            status !== "submitting" &&
            status !== "success" && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-red-200">
                {status === "missing-api-key" &&
                  "The email service is not configured yet. Please check the RESEND_API_KEY in .env.local."}
                {status === "missing-fields" &&
                  "Please fill in all required fields."}
                {status === "email-failed" &&
                  "Your form was submitted, but the email could not be sent. Please try again."}
                {status === "file-too-large" &&
                  "One of your files is too large. Please keep each image under 5 MB."}
                {status === "too-many-files" &&
                  "Please upload no more than 3 images."}
                {status === "bad-file-type" &&
                  "Only JPG, PNG, WEBP, and GIF images are allowed."}
                {status === "server-error" &&
                  "Something went wrong on the server. Please try again."}
              </div>
            )}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl"
          >
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

            <input
              name="itemName"
              type="text"
              placeholder="Item Name / Player / Year"
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <select
              name="itemType"
              required
              defaultValue=""
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="" disabled className="bg-slate-900">
                Type of Item
              </option>
              <option className="bg-slate-900">Sports Card</option>
              <option className="bg-slate-900">Signed Jersey</option>
              <option className="bg-slate-900">Signed Baseball</option>
              <option className="bg-slate-900">Signed Helmet</option>
              <option className="bg-slate-900">Photo</option>
              <option className="bg-slate-900">Other Memorabilia</option>
            </select>

            <textarea
              name="details"
              rows={6}
              placeholder="Tell us about the item, condition, authentication, grading, and anything else relevant..."
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />

            <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Upload up to 3 photos
              </label>
              <input
                name="photos"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-400"
              />
              <p className="mt-2 text-xs text-slate-400">
                Accepted: JPG, PNG, WEBP, GIF. Max 3 images, 5 MB each.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-2xl bg-blue-500 px-6 py-4 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting"
                ? "Submitting..."
                : "Submit Appraisal Request"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}