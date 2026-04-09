import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

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
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <div className="min-h-screen bg-slate-950 text-white">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
