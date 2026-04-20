export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16 md:px-10 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-10 space-y-8 text-slate-300 leading-7">

          <section>
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using King of Sports Collectibles, you agree to be bound
              by these Terms of Service. If you do not agree, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">2. Services Provided</h2>
            <p className="mt-3">
              We provide services including sports memorabilia appraisals, consignment assistance,
              and marketplace listing support. All services are provided on a best-effort basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">3. Appraisal Disclaimer</h2>
            <p className="mt-3">
              All appraisal estimates are opinions based on available market data, condition,
              and comparable sales. Values are not guaranteed and may fluctuate based on market demand.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">4. Consignment Terms</h2>
            <p className="mt-3">
              By submitting an item for consignment, you confirm that you are the rightful owner
              of the item and have the authority to sell it. Final consignment terms, including
              fees and payment structure, will be agreed upon separately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">5. Marketplace Transactions</h2>
            <p className="mt-3">
              Transactions may be processed through third-party platforms such as Stripe.
              We are not responsible for issues arising from third-party payment systems,
              including delays, errors, or disputes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">6. User Responsibilities</h2>
            <p className="mt-3">
              You agree not to:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Provide false or misleading information</li>
              <li>Submit items you do not own</li>
              <li>Use the site for fraudulent or illegal activity</li>
              <li>Interfere with the operation of the website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
            <p className="mt-3">
              King of Sports Collectibles is not liable for any damages, losses, or missed opportunities
              resulting from the use of this site, including reliance on appraisal estimates or sales outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">8. Intellectual Property</h2>
            <p className="mt-3">
              All content on this website, including branding, text, and design, is the property of
              King of Sports Collectibles and may not be used without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">9. Changes to Terms</h2>
            <p className="mt-3">
              We may update these Terms at any time. Continued use of the site after changes
              means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">10. Contact Information</h2>
            <p className="mt-3">
              For questions regarding these Terms, contact:
            </p>
            <p className="mt-2 font-semibold text-white">
              kingofsportscollectibles@gmail.com
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}