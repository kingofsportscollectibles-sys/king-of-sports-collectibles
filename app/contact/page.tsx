import { Suspense } from "react";
import ContactPageClient from "./contact-page-client";

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white" />}>
      <ContactPageClient />
    </Suspense>
  );
}