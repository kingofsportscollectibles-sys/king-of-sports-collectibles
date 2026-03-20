const pillars = [
  {
    title: "Appraisals",
    description:
      "We help collectors understand what their cards and memorabilia may be worth based on condition, authentication, rarity, and market demand.",
  },
  {
    title: "Consignment",
    description:
      "For valuable pieces, we aim to create a clean path to selling with trusted listing support and strong presentation.",
  },
  {
    title: "Collector Guidance",
    description:
      "Not everyone knows exactly what they have. We help people make smarter decisions about holding, selling, preserving, or showcasing their items.",
  },
];

const values = [
  {
    title: "Trust",
    description:
      "Collectors need honest guidance, not hype. We want every interaction to feel transparent and grounded in the real market.",
  },
  {
    title: "Clarity",
    description:
      "The memorabilia world can feel confusing. Our goal is to make the process easier to understand and easier to act on.",
  },
  {
    title: "Opportunity",
    description:
      "Every collectible has a story and sometimes real value. We want to help people uncover that value and decide what to do next.",
  },
];

const audience = [
  "Collectors who want an appraisal or second opinion",
  "People looking to sell or consign sports memorabilia",
  "Families sorting through inherited collections",
  "Fans looking for authentic collectibles",
  "Buyers searching for premium sports cards and signed items",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                About King of Sports Collectibles
              </p>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Built for collectors who want trust, clarity, and a smarter way
                to navigate sports memorabilia
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                King of Sports Collectibles was created to help people buy, sell,
                appraise, consign, and preserve sports collectibles with more
                confidence. Whether someone has a premium sports card, a signed
                jersey, an inherited collection, or a piece they simply want to
                understand better, the goal is to make the next step easier.
              </p>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                We are building this brand around a simple idea: collectors
                deserve a cleaner, more modern experience when it comes to
                understanding value, exploring selling options, and finding
                great memorabilia.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/get-appraised"
                  className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
                >
                  Get Item Appraised
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
                  Brand Mission
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">What We Want To Do</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Help collectors understand value, unlock opportunity, and
                      connect with the right path forward
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">What Makes Us Different</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      A service-first approach today with a long-term vision for
                      a stronger marketplace and collector platform
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Who We Serve</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Collectors, sellers, buyers, and families with sports
                      memorabilia that deserves more attention and clarity
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
            What We Stand For
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            More than a memorabilia site
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            King of Sports Collectibles is meant to grow into more than just a
            place to ask questions or browse listings. The vision is to build a
            trusted brand where people can learn, sell, shop, and make better
            collector decisions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg"
            >
              <div className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Core Pillar
              </div>
              <h3 className="text-2xl font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="mt-4 leading-7 text-slate-300">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Who We Help
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for real collectors and real situations
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Not everyone comes in with the same goal. Some people want to
                sell. Others want to insure, preserve, value, or simply
                understand what they have. The site is designed to meet people
                where they are.
              </p>
            </div>

            <div className="grid gap-4">
              {audience.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-slate-950 p-5 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Our Values
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              The foundation behind the brand
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              The best collector businesses are built on trust and reputation.
              That is exactly the kind of foundation we want to build here.
            </p>
          </div>

          <div className="space-y-5">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-2xl font-semibold text-white">
                  {value.title}
                </h3>
                <p className="mt-4 leading-7 text-slate-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Long-Term Vision
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Building a stronger destination for sports collectibles
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Today, the focus is on appraisals, consignment, direct sales,
                and collector education. Long term, the brand can grow into a
                stronger marketplace experience with better listing tools,
                deeper collectible insights, and a trusted place for buyers and
                sellers to connect.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-slate-950 p-6 shadow-2xl">
              <ul className="space-y-4 text-slate-200">
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Premium shop and featured collectible listings
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Consignment opportunities for valuable memorabilia
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Stronger collector resources through blog and SEO content
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Future marketplace and valuation tools as the platform grows
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Work With Us
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Have a collectible you want to understand or sell?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Whether you have one item or an entire collection, we want to
                help you figure out the smartest next move.
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
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}