const services = [
  {
    title: "Sports Memorabilia Appraisals",
    description:
      "Get a market-based estimate for sports cards, autographs, jerseys, helmets, baseballs, photos, and rare memorabilia.",
    highlights: [
      "Market-based value guidance",
      "Condition and authentication review",
      "Great for collectors, sellers, and inherited items",
    ],
  },
  {
    title: "Consignment Services",
    description:
      "We help you turn valuable collectibles into cash through a trusted consignment process designed to attract serious buyers.",
    highlights: [
      "Seller guidance from start to finish",
      "Professional listing presentation",
      "Ideal for higher-value collectibles and memorabilia",
    ],
  },
  {
    title: "Direct Sales Support",
    description:
      "Want to sell your item outright or have it listed directly through our site? We make the process simple and collector-friendly.",
    highlights: [
      "Website listing opportunities",
      "Future direct-purchase marketplace",
      "Clear path for buyers and sellers",
    ],
  },
  {
    title: "Custom Framing",
    description:
      "Preserve and display your signed jerseys, photos, and memorabilia with custom framing options built to protect presentation and value.",
    highlights: [
      "Display-focused solutions",
      "Built for prized collector pieces",
      "Great for gifts, offices, and sports rooms",
    ],
  },
  {
    title: "Collection Reviews",
    description:
      "Not sure what your collection is worth or where to start? We help you identify value, priority items, and next-step opportunities.",
    highlights: [
      "Ideal for larger collections",
      "Helps uncover hidden value",
      "Useful for estate or downsizing situations",
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Submit Your Item or Request",
    description:
      "Send us your item details, photos, and what you’re looking to do — appraise, sell, frame, or review a collection.",
  },
  {
    step: "02",
    title: "We Evaluate the Best Path",
    description:
      "We review the item, market demand, comparable sales, condition, and the best route based on your goals.",
  },
  {
    step: "03",
    title: "Move Forward with Confidence",
    description:
      "Whether you want valuation guidance, a listing strategy, consignment support, or preservation help, we make the next step clear.",
  },
];

const faqs = [
  {
    question: "What types of items do you handle?",
    answer:
      "We work with sports cards, signed jerseys, baseballs, helmets, photos, graded cards, autographs, and other collectible memorabilia.",
  },
  {
    question: "Can I submit an item even if I do not know much about it?",
    answer:
      "Yes. Many collectors and families come to us with limited details. We can help assess what you have and guide you toward the best next step.",
  },
  {
    question: "Do you only help with high-end items?",
    answer:
      "No. We can help with everything from everyday collectibles to premium memorabilia. Some services may be a better fit depending on the item’s value.",
  },
  {
    question: "Will the website eventually allow direct purchases?",
    answer:
      "Yes. The long-term vision includes featured listings, direct sales, and a stronger marketplace experience for buyers and sellers.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Services
              </p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Premium support for collectors, sellers, and sports memorabilia
                owners
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                King of Sports Collectibles is built to help people understand,
                sell, preserve, and track the value of sports memorabilia. From
                appraisals and consignment to framing, our services are designed to make the collectibles world
                easier to navigate.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/get-appraised"
                  className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
                >
                  Get Item Appraised
                </a>
                <a
                  href="/contact"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[26px] border border-white/10 bg-slate-900 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Service Snapshot
                </p>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Core Focus</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Appraisals, consignment, direct sales, framing, and market
                      insights
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Built For</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Collectors, inherited collections, resellers, and sports
                      fans with valuable memorabilia
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Long-Term Vision</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      THE trusted sports memorabilia buy and sell marketplace 
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            What We Offer
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Services built around real collector needs
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Whether you want to know what an item is worth, sell it, or preserve it properly, each service is designed to give collectors
            a clear and valuable next step.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Premium Service
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {service.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {service.description}
              </p>

              <div className="mt-6 space-y-3">
                {service.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-200"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                A clean, simple process from first contact to next step
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                We want collectors to feel confident and informed, not confused.
                Our process is built to make things straightforward from the
                beginning.
              </p>
            </div>

            <div className="space-y-5">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[28px] border border-white/10 bg-slate-950 p-6"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-900 p-8 shadow-2xl md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Why Work With Us
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for trust, clarity, and long-term collector value
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                The collectibles world can be confusing. Our goal is to simplify
                decisions, provide honest guidance, and eventually create a
                better online experience for buying, selling, and tracking
                memorabilia.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950 p-6">
              <ul className="space-y-4 text-slate-200">
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Honest, market-based appraisal direction
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Clean selling and consignment pathways
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  A long-term vision beyond just a simple service site
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                FAQs
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Common questions from collectors and sellers
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                These answers help set expectations while also building trust for
                people who are discovering the brand for the first time.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[24px] border border-white/10 bg-slate-950 p-6"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Next Step
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to get started with your item?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Whether you want an appraisal, want to explore consignment, or
                simply need help understanding what you have, the next step is
                easy.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <a
                href="/get-appraised"
                className="rounded-2xl bg-blue-500 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-400"
              >
                Start an Appraisal Request
              </a>
              <a
                href="/contact"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Contact King of Sports Collectibles
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}