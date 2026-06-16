import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const C = {
  purple: "#352F63",
  green: "#8BCDA1",
  coral: "#E9847E",
  yellow: "#FCBC12",
  navy: "#343F49",
  midPurple: "#6464AF",
  light: "#F3F3F3",
};

export const metadata: Metadata = {
  title: "Privacy Policy — Paddy's Homecoming | Flying Tumbler",
  description: "Privacy policy for the Paddy's Homecoming sweepstakes by Flying Tumbler Irish Whiskey.",
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen" style={{ background: C.purple }}>
      <div className="grain-overlay absolute inset-0 pointer-events-none z-[1]" aria-hidden />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center py-4 px-6">
        <Link href="/">
          <Image
            src="/assets/wordmark-horizontal-pigeon.png"
            alt="Flying Tumbler — Back to entry"
            width={200}
            height={40}
            className="brightness-0 invert h-8 w-auto cursor-pointer"
          />
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-5 pb-16">
        {/* Hero badge */}
        <div className="text-center pt-4 pb-8">
          <div
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase mb-4"
            style={{ background: C.yellow, color: C.navy }}
          >
            Privacy Policy
          </div>
          <h1 className="font-display text-[28px] sm:text-[34px] font-extrabold text-white leading-tight">
            Your Privacy Matters
          </h1>
          <p className="text-white/50 text-sm mt-2">
            Last updated: June 13, 2026
          </p>
        </div>

        {/* Policy card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
        >
          <div className="p-6 sm:p-8 space-y-6 text-[14px] leading-relaxed" style={{ color: C.navy }}>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                1. Who We Are
              </h2>
              <p>
                This privacy policy applies to the &ldquo;Paddy&rsquo;s Homecoming&rdquo; sweepstakes
                website at homecoming.flyingtumbler.com (the &ldquo;Site&rdquo;), operated by
                MHW, Ltd. d/b/a Flying Tumbler, located at 1129 Northern Blvd, Suite 312, Manhasset,
                NY 11030 (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;Sponsor&rdquo;).
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                2. Information We Collect
              </h2>
              <p>When you enter the sweepstakes, we collect:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><span className="font-semibold">Identity information:</span> first name, last name, date of birth.</li>
                <li><span className="font-semibold">Contact information:</span> email address, zip code, state.</li>
                <li><span className="font-semibold">Store selection:</span> the store you indicate when entering.</li>
                <li><span className="font-semibold">Referral data:</span> if you share your referral link, we track which entries came from your link so we can award bonus entries.</li>
              </ul>
              <p className="mt-3">If you claim a gift-with-purchase item, we additionally collect:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><span className="font-semibold">Shipping information:</span> full name, street address, city, state, zip code, and phone number.</li>
                <li><span className="font-semibold">Purchase verification:</span> a photo of your receipt and the store where you purchased the product.</li>
              </ul>
              <p className="mt-3">If you upload a photo for a bonus entry, we collect the image you submit.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Administer the sweepstakes, including verifying eligibility and selecting the winner.</li>
                <li>Process and fulfil gift-with-purchase merch claims.</li>
                <li>Send you transactional emails related to your entry (confirmation, winner notification).</li>
                <li>Send you marketing communications about Flying Tumbler Irish Whiskey, from which you may unsubscribe at any time.</li>
                <li>Improve our promotions and understand how participants interact with the Site.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                4. Third-Party Services
              </h2>
              <p>We share your information with the following categories of service providers, solely for the purposes described above:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><span className="font-semibold">Email service provider (Mailchimp):</span> to send transactional and marketing emails.</li>
                <li><span className="font-semibold">Fulfilment provider (Printful):</span> to print and ship merch items. We share only the shipping address, phone number, and product selection needed to fulfil your order.</li>
                <li><span className="font-semibold">Hosting and data storage (Vercel, Upstash):</span> to host the Site and store entry data securely.</li>
              </ul>
              <p className="mt-2">
                We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                5. Data Retention
              </h2>
              <p>
                We retain your entry data for the duration of the sweepstakes period and for a
                reasonable period afterwards (up to 12 months after the draw date) for legal
                compliance, winner verification, and prize fulfilment. Marketing consent data is
                retained until you unsubscribe. Gift-with-purchase shipping data is retained until
                fulfilment is complete plus 90 days for customer service purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                6. Your Rights & Choices
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><span className="font-semibold">Unsubscribe:</span> every marketing email includes an unsubscribe link. Click it at any time to stop receiving promotional communications.</li>
                <li><span className="font-semibold">Access or deletion:</span> you may request access to, correction of, or deletion of your personal information by emailing us at{" "}
                  <a href="mailto:privacy@flyingtumbler.com" className="underline" style={{ color: C.green }}>privacy@flyingtumbler.com</a>.
                </li>
                <li><span className="font-semibold">California residents:</span> under the CCPA, you have the right to know what personal information we collect, request its deletion, and opt out of its sale (we do not sell your data). To exercise these rights, contact us at the email above.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                7. Cookies & Analytics
              </h2>
              <p>
                The Site uses essential cookies required for the entry form to function correctly. We
                may use basic analytics (page views, entry counts) to understand traffic and
                improve the promotion. We do not use third-party advertising trackers or retargeting
                pixels on this Site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                8. Security
              </h2>
              <p>
                We implement reasonable technical and organisational measures to protect your
                personal information against unauthorised access, alteration, disclosure, or
                destruction. However, no method of transmission over the internet or electronic
                storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                9. Children&rsquo;s Privacy
              </h2>
              <p>
                This Site and sweepstakes are intended for individuals who are 21 years of age or
                older. We do not knowingly collect personal information from anyone under 21. If
                we learn that we have collected information from a person under 21, we will delete
                that information promptly.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                10. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be posted on
                this page with an updated &ldquo;Last updated&rdquo; date. Your continued use of the
                Site after any changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                11. Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy or our data practices, please
                contact us at:
              </p>
              <p className="mt-2">
                MHW, Ltd. d/b/a Flying Tumbler<br />
                1129 Northern Blvd, Suite 312, Manhasset, NY 11030<br />
                <a href="mailto:privacy@flyingtumbler.com" className="underline" style={{ color: C.green }}>privacy@flyingtumbler.com</a>
              </p>
            </section>

            <div
              className="rounded-xl p-4 text-center text-sm"
              style={{ background: C.light, color: C.navy }}
            >
              <p className="font-semibold">Please drink responsibly.</p>
              <p className="text-xs mt-1 opacity-60">
                Flying Tumbler Irish Whiskey &middot; 43% ABV &middot; Single Malt &amp; Grain
              </p>
            </div>
          </div>
        </div>

        {/* Back to entry CTA */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: C.green, color: "white" }}
          >
            Enter the Sweepstakes
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center py-10 px-6">
          <Image
            src="/assets/circle-coordinates.png"
            alt=""
            width={48}
            height={48}
            className="mx-auto opacity-30"
          />
          <p className="text-white/20 text-xs font-mono mt-3">
            &copy; {new Date().getFullYear()} Flying Tumbler Irish Whiskey
          </p>
        </footer>
      </div>
    </div>
  );
}
