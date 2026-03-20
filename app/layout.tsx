import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "King of Sports Collectibles",
  description:
    "Sports memorabilia sales, consignment, appraisals, custom framing, and collectible market insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Shop", href: "/shop" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <div className="min-h-screen bg-slate-950 text-white">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
              <a href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-black text-white shadow-lg shadow-blue-500/25">
                  K
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                    King of Sports
                  </p>
                  <p className="text-lg font-bold leading-none text-white">
                    Collectibles
                  </p>
                </div>
              </a>

              <nav className="hidden items-center gap-7 lg:flex">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="hidden lg:block">
                <a
                  href="/get-appraised"
                  className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Get Item Appraised
                </a>
              </div>

              <button
                type="button"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 lg:hidden"
              >
                Menu
              </button>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
