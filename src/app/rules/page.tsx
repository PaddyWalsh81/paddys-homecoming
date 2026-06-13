import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════════
   CAMPAIGN CONFIG — swap these values for each quarterly campaign
   ═══════════════════════════════════════════════════════════════════════ */
const CAMPAIGN = {
  name: "Paddy's Homecoming",
  startDate: "June 13, 2026",
  endDate: "December 31, 2026",
  drawDate: "January 15, 2027",
  winnerNotifyDays: 5,
  responseDays: 7,
  prize: "two (2) round-trip economy class airline tickets from a major U.S. gateway airport to Dublin, Ireland",
  prizeARV: "$1,000",
  amoeEmail: "paddyshomecoming@flyingtumbler.com",
  amoeSubject: "Paddy's Homecoming Entry",
  sponsor: "MHW, Ltd. d/b/a Flying Tumbler",
  sponsorAddress: "1129 Northern Blvd, Suite 312, Manhasset, NY 11030",
  sponsorPhone: "516-869-9170",
  website: "https://paddys-homecoming.vercel.app",
};

/* ── colour tokens ── */
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
  title: `Official Rules — ${CAMPAIGN.name} | Flying Tumbler`,
  description: `Official sweepstakes rules for the ${CAMPAIGN.name} promotion by Flying Tumbler Irish Whiskey.`,
};

export default function RulesPage() {
  return (
    <div className="relative min-h-screen" style={{ background: C.purple }}>
      {/* Grain overlay */}
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
            Official Rules
          </div>
          <h1
            className="font-display text-[28px] sm:text-[34px] font-extrabold text-white leading-tight"
          >
            {CAMPAIGN.name} Sweepstakes
          </h1>
          <p className="text-white/50 text-sm mt-2">
            Effective {CAMPAIGN.startDate}
          </p>
        </div>

        {/* Rules card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
        >
          <div className="p-6 sm:p-8 space-y-6 text-[14px] leading-relaxed" style={{ color: C.navy }}>

            {/* 1. NO PURCHASE NECESSARY */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                1. NO PURCHASE NECESSARY
              </h2>
              <p>
                NO PURCHASE OR PAYMENT OF ANY KIND IS NECESSARY TO ENTER OR WIN.
                A PURCHASE WILL NOT INCREASE YOUR CHANCES OF WINNING. VOID WHERE PROHIBITED BY LAW.
              </p>
            </section>

            {/* 2. SPONSOR */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                2. SPONSOR
              </h2>
              <p>
                The &ldquo;{CAMPAIGN.name}&rdquo; Sweepstakes (the &ldquo;Sweepstakes&rdquo;) is sponsored by{" "}
                {CAMPAIGN.sponsor}, located at {CAMPAIGN.sponsorAddress} (the &ldquo;Sponsor&rdquo;).
              </p>
            </section>

            {/* 3. ELIGIBILITY */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                3. ELIGIBILITY
              </h2>
              <p>
                The Sweepstakes is open to legal residents of the fifty (50) United States and the
                District of Columbia who are twenty-one (21) years of age or older at the time of
                entry. Employees, officers, and directors of Sponsor, its parent companies,
                subsidiaries, affiliates, distributors, retailers, advertising and promotion
                agencies, and any other entity involved in the development or administration of
                this Sweepstakes, and their immediate family members (spouse, parents, siblings,
                and children) and household members (whether or not related) of each such
                employee, officer, or director, are not eligible to participate. This Sweepstakes
                is subject to all applicable federal, state, and local laws and regulations and is
                void where prohibited.
              </p>
            </section>

            {/* 4. SWEEPSTAKES PERIOD */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                4. SWEEPSTAKES PERIOD
              </h2>
              <p>
                The Sweepstakes begins at 12:00:01 AM Eastern Time (&ldquo;ET&rdquo;) on{" "}
                {CAMPAIGN.startDate} and ends at 11:59:59 PM ET on {CAMPAIGN.endDate}{" "}
                (the &ldquo;Sweepstakes Period&rdquo;). The Sponsor&rsquo;s computer is the
                official timekeeping device for this Sweepstakes.
              </p>
            </section>

            {/* 5. HOW TO ENTER */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                5. HOW TO ENTER
              </h2>

              <p className="font-semibold mt-3 mb-1">Online Entry:</p>
              <p>
                During the Sweepstakes Period, visit{" "}
                <a
                  href={CAMPAIGN.website}
                  className="underline"
                  style={{ color: C.green }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CAMPAIGN.website}
                </a>{" "}
                or scan the QR code on any participating in-store point-of-sale material.
                Complete and submit the entry form with your first name, last name, email address,
                date of birth, state, and zip code. You may optionally identify the store where
                you encountered the promotion. All entry information must be valid and complete.
                Limit one (1) entry per person per email address per day during the Sweepstakes
                Period.
              </p>

              <p className="font-semibold mt-4 mb-1">Bonus Entries:</p>
              <p>
                After completing your initial entry, you may earn additional entries through the
                following methods:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <span className="font-semibold">Referral:</span> Share your unique referral
                  link with a friend. When a referred friend completes a valid entry, both you and
                  your friend each receive one (1) bonus entry.
                </li>
                <li>
                  <span className="font-semibold">Photo Upload:</span> Upload an original
                  photograph featuring the Flying Tumbler product (&ldquo;The Bird&rdquo;) as
                  seen at a store, bar, or restaurant. One (1) bonus entry will be awarded per
                  approved photo upload. By uploading a photo, you grant Sponsor a non-exclusive,
                  royalty-free, worldwide license to use, reproduce, modify, and display your
                  photo in connection with this Sweepstakes and Sponsor&rsquo;s marketing
                  activities.
                </li>
              </ul>

              <p className="font-semibold mt-4 mb-1">
                Alternative Method of Entry (&ldquo;AMOE&rdquo;):
              </p>
              <p>
                To enter without making a purchase or visiting a participating retail location,
                send an email to{" "}
                <a
                  href={`mailto:${CAMPAIGN.amoeEmail}`}
                  className="underline"
                  style={{ color: C.green }}
                >
                  {CAMPAIGN.amoeEmail}
                </a>{" "}
                with the subject line &ldquo;{CAMPAIGN.amoeSubject}&rdquo; and include your full
                name, date of birth, email address, and zip code in the body of the email. AMOE
                entries will receive one (1) entry. Limit one (1) AMOE entry per person per email
                address per day. AMOE entries must be received during the Sweepstakes Period.
              </p>
            </section>

            {/* 6. PRIZE */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                6. PRIZE
              </h2>
              <p>
                One (1) Grand Prize: The winner will receive {CAMPAIGN.prize}.
                Approximate Retail Value (&ldquo;ARV&rdquo;): {CAMPAIGN.prizeARV}.
              </p>
              <p className="mt-2">
                Prize details, including airline, travel dates, and departure city, are at the
                sole discretion of the Sponsor. Travel must be completed within twelve (12) months
                of the date the winner is notified. The winner and their travel companion must
                travel on the same itinerary. The travel companion must be twenty-one (21) years
                of age or older at the time of travel. The prize does not include ground
                transportation, meals, accommodation, travel insurance, passport or visa fees,
                personal expenses, or any other costs not explicitly stated herein.
              </p>
              <p className="mt-2">
                The prize is non-transferable, non-exchangeable, and no cash equivalent or
                substitution will be provided, except at the Sponsor&rsquo;s sole discretion.
                Sponsor reserves the right to substitute a prize of equal or greater value if the
                advertised prize becomes unavailable for any reason. The winner is solely
                responsible for all applicable taxes, including federal, state, and local income
                taxes, associated with the prize.
              </p>
            </section>

            {/* 7. WINNER SELECTION & NOTIFICATION */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                7. WINNER SELECTION & NOTIFICATION
              </h2>
              <p>
                On or about {CAMPAIGN.drawDate}, one (1) potential winner will be selected in a
                random drawing from among all eligible entries received during the Sweepstakes
                Period. The drawing will be conducted by the Sponsor or its designated
                representative, whose decisions are final and binding on all matters relating to
                this Sweepstakes.
              </p>
              <p className="mt-2">
                The potential winner will be notified by email within{" "}
                {CAMPAIGN.winnerNotifyDays} business days of the drawing. The potential winner
                must respond within {CAMPAIGN.responseDays} days of notification with a valid
                mailing address and may be required to complete and return an Affidavit of
                Eligibility, a Liability Release, and, where lawful, a Publicity Release within
                the same period. If the potential winner cannot be contacted, does not respond
                within the required timeframe, is found to be ineligible, or does not comply with
                these Official Rules, the prize will be forfeited and an alternate winner may be
                selected at the Sponsor&rsquo;s discretion.
              </p>
            </section>

            {/* 8. ODDS */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                8. ODDS OF WINNING
              </h2>
              <p>
                The odds of winning depend on the total number of eligible entries received during
                the Sweepstakes Period.
              </p>
            </section>

            {/* 9. GENERAL CONDITIONS */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                9. GENERAL CONDITIONS
              </h2>
              <p>
                By entering, each entrant agrees to comply with these Official Rules and the
                decisions of the Sponsor, which are final and binding in all respects. Sponsor
                reserves the right, in its sole discretion, to disqualify any individual who
                tampers with the entry process, violates these Official Rules, or acts in a
                disruptive, unsportsmanlike, or inappropriate manner. Sponsor further reserves the
                right to cancel, terminate, modify, or suspend the Sweepstakes if it is not
                capable of running as planned due to infection by computer virus, bugs, tampering,
                unauthorized intervention, fraud, technical failures, or any other cause beyond
                the reasonable control of the Sponsor that corrupts or affects the administration,
                security, fairness, or proper conduct of the Sweepstakes.
              </p>
              <p className="mt-2">
                Entries generated by script, macro, bot, or any automated means are void. Entries
                that are incomplete, illegible, corrupted, or received outside the Sweepstakes
                Period will be disqualified. Sponsor is not responsible for lost, late,
                misdirected, garbled, or incomplete entries or for any technical malfunctions,
                human errors, or other issues affecting the ability to enter or the administration
                of the Sweepstakes.
              </p>
            </section>

            {/* 10. RELEASE & LIMITATION OF LIABILITY */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                10. RELEASE & LIMITATION OF LIABILITY
              </h2>
              <p>
                By participating, entrants agree to release, discharge, indemnify, and hold
                harmless the Sponsor, its parent companies, subsidiaries, affiliates, distributors,
                advertising and promotion agencies, and all of their respective officers, directors,
                employees, agents, and representatives (collectively, the &ldquo;Released
                Parties&rdquo;) from and against any and all claims, damages, losses, costs, and
                expenses (including reasonable attorneys&rsquo; fees) arising out of or related
                to participation in the Sweepstakes, acceptance or use of the prize, or any
                prize-related travel or activity.
              </p>
              <p className="mt-2">
                The Released Parties are not responsible for: (a) any incorrect or inaccurate
                information; (b) technical failures of any kind; (c) unauthorized human
                intervention in any part of the Sweepstakes; (d) technical or human error in the
                administration of the Sweepstakes or the processing of entries; or (e) any injury
                or damage to persons or property which may be caused, directly or indirectly, in
                whole or in part, from entrant&rsquo;s participation in the Sweepstakes or
                receipt or use of the prize.
              </p>
            </section>

            {/* 11. PRIVACY */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                11. PRIVACY
              </h2>
              <p>
                Information collected from entrants is subject to the Sponsor&rsquo;s privacy
                practices. Personal information will be used for the administration of this
                Sweepstakes and may be used by the Sponsor for marketing communications. By
                entering, you consent to Sponsor&rsquo;s collection and use of your personal
                information as described herein and to receiving email communications from
                Sponsor. You may unsubscribe from future marketing emails at any time by clicking
                the unsubscribe link in any email received from Sponsor.
              </p>
            </section>

            {/* 12. DISPUTES */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                12. DISPUTES & GOVERNING LAW
              </h2>
              <p>
                Except where prohibited, entrants agree that: (a) any and all disputes, claims,
                and causes of action arising out of or connected with this Sweepstakes, or the
                prize awarded, shall be resolved individually, without resort to any form of class
                action; (b) any and all claims, judgments, and awards shall be limited to actual
                out-of-pocket costs incurred, but in no event attorneys&rsquo; fees; and (c)
                under no circumstances will an entrant be permitted to obtain awards for, and
                each entrant hereby waives all rights to claim, indirect, punitive, incidental,
                and consequential damages and any other damages other than for actual
                out-of-pocket expenses. All issues and questions concerning the construction,
                validity, interpretation, and enforceability of these Official Rules shall be
                governed by the laws of the State of New York, without regard to its conflict of
                laws provisions.
              </p>
            </section>

            {/* 13. WINNERS LIST */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                13. WINNER&rsquo;S NAME
              </h2>
              <p>
                To obtain the name of the winner (available after {CAMPAIGN.drawDate}), send a
                self-addressed stamped envelope to: {CAMPAIGN.name} Winner, c/o{" "}
                {CAMPAIGN.sponsor}, {CAMPAIGN.sponsorAddress}. Requests must be received within
                sixty (60) days of the drawing date.
              </p>
            </section>

            {/* 14. SPONSOR INFO */}
            <section>
              <h2 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>
                14. SPONSOR
              </h2>
              <p>
                {CAMPAIGN.sponsor}
                <br />
                {CAMPAIGN.sponsorAddress}
                <br />
                {CAMPAIGN.sponsorPhone}
              </p>
            </section>

            {/* Responsible drinking notice */}
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
