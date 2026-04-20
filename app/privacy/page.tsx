export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16 md:px-10 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-slate-300 leading-7">

          <section>
            <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
            <p className="mt-3">
              We collect information that you voluntarily provide when you submit forms,
              request an appraisal, inquire about consignment, or interact with our website.
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Details about your collectible items</li>
              <li>Any photos or descriptions you provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
            <p className="mt-3">
              We use your information to:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Provide appraisal estimates</li>
              <li>Respond to consignment or sales inquiries</li>
              <li>Communicate with you about your request</li>
              <li>Improve our services and website experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">3. Payments & Third Parties</h2>
            <p className="mt-3">
              Payments are securely processed through third-party providers such as Stripe.
              We do not store your payment information directly on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">4. Data Sharing</h2>
            <p className="mt-3">
              We do not sell or rent your personal information. We may share data only when necessary to:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Provide services you request</li>
              <li>Comply with legal obligations</li>
              <li>Protect our business and users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">5. Data Security</h2>
            <p className="mt-3">
              We take reasonable measures to protect your information, but no system is 100% secure.
              By using our site, you acknowledge this risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">6. Your Rights</h2>
            <p className="mt-3">
              You may request access, updates, or deletion of your personal information at any time
              by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">7. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Updates will be posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">8. Contact Us</h2>
            <p className="mt-3">
              If you have any questions about this Privacy Policy, you can contact us at:
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