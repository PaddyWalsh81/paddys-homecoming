# Paddy's Homecoming — Full Design Brief for Claude Design

**Project:** Paddy's Homecoming Consumer Sweepstakes
**Brand:** Flying Tumbler Irish Whiskey
**Date:** 10 June 2026
**Prepared by:** Patrick Walsh / Claude

---

## INSTRUCTION TO CLAUDE DESIGN

This brief covers the complete visual design package for the **Paddy's Homecoming** consumer sweepstakes — a "Win 2 Flights to Ireland" programme deployed across all US markets via QR-code POS at retail stores. Every deliverable must follow the **Flying Tumbler brand design system** in Claude Design. If the FT brand design system is available, use it as the primary source for colours, typography, layout principles, and brand elements. Where the system doesn't specify, this brief provides the rules.

Every asset must feel like Flying Tumbler — **adventurous, Irish, playful, warm, craft-driven, and never corporate.** Use real brand photography (bottling runs, casks, Irish countryside, Paddy the Pigeon, bottle renders) throughout. No asset should feel like a wall of text or a generic template. The brand has incredible imagery — use it liberally.

---

## 1. BRAND GUIDELINES

### Colour Palette

| Name | Hex | Role |
|------|-----|------|
| **De York (Green)** | #8BCDA1 | Primary brand colour. Headers, section bars, CTA buttons, key accents |
| **Sunglo (Coral)** | #E9847E | Secondary accent. Alerts, badges, highlights, secondary CTAs |
| **Lightning Yellow** | #FCBC12 | Emphasis. Prize callouts, urgency, highlights, badges |
| **Port Gore (Purple)** | #352F63 | Deep accent. Backgrounds, footers, hero sections, premium feel |
| **Oxford Blue** | #343F49 | Body text (never pure black). Headings where dark text is needed |
| **Wild Sand** | #F3F3F3 | Light backgrounds, alternating sections |
| **Tree Poppy (Orange)** | #F7911E | Tertiary accent. The Tippler product colour |
| **Mid Gray** | #6464AF | Secondary purple accent |
| **Quill Gray** | #CCCCCD | Subtle borders, dividers |
| **White** | #FFFFFF | White |

**Primary trio for all key design:** De York #8BCDA1, Sunglo #E9847E, Lightning Yellow #FCBC12.
**Hero/premium backgrounds:** Port Gore #352F63 (deep purple), often with gradient to De York green.

### Typography

- **Headlines/Display:** Bold, confident. Use the brand's display typeface if available in the FT design system. Otherwise: a clean, slightly rounded sans-serif (not corporate/stiff)
- **Body:** Clean sans-serif, highly legible. Minimum 14px for digital, 10pt for print
- **Tone:** Playful, cheeky, warm. Never formal or stiff. The copy reads like a mate telling you about something brilliant

### Brand Elements to Use

- **Paddy the Pigeon** — the tumbler pigeon mascot with aviator goggles. Central character. Appears on bottle, POS, and all brand materials. Use the illustrated version liberally
- **The Bird logo** — circular badge with "FLYING TUMBLER" arced, bird mascot centre, coordinates "52°44'N / 6°52'W"
- **Product renders** — bottle shots, pack shots from the brand asset library
- **Irish countryside photography** — Carlow, green fields, stone walls, Mount Leinster
- **Bottling/craft photography** — bottling day shots, cask imagery, hands-on production
- **Brand graphic elements** — stamps, clouds, compass/coordinate markings
- **Gradient backgrounds** — the brand uses diagonal gradients (e.g., Port Gore → De York, Coral → Purple)

### Product: The Bird Irish Whiskey

- Single Malt + Grain blend, triple distilled
- **43% ABV (86 proof)** — current US bottling (note: newer bottlings are 44%, but all US stock is 43%)
- Bourbon cask aged, minimum 5 years
- Non-chill filtered, no added colour
- 700mL bottle
- Tasting notes: Almond, white chocolate, vanilla, apple pie, citrus, baking spices
- Awards: Spirits Business Global Irish Whiskey Masters Silver 2025, IWSC 91 points 2025
- **Do NOT include retail pricing on any consumer-facing materials.** Retailers set their own prices. POS should leave space for the retailer to attach their own shelf tag or price clip (e.g., magic eight) where appropriate.

### Brand Story (Use in Copy)

Created by brothers Patrick and Thomas Walsh from County Carlow, Ireland. Inspired by the tumbler pigeon — known for aerial acrobatics and always returning home. "Adventure in every bottle." Home: Larch Grove — family farm since 1944, now converting outbuildings into bonded maturation warehouses. The name comes from Mount Leinster, a 3,000ft peak where the wind is fierce enough to tumble anything airborne.

*"A modern take on Irish whiskey with adventure in every drop and home in every sip."*

---

## 2. THE PROGRAMME — PADDY'S HOMECOMING

### Concept

Co-branded POS materials at retail accounts featuring a consumer sweepstakes: **Win 2 Return Flights to Ireland**. Consumers scan a QR code on in-store POS, enter via a landing page, and join a draw.

**Important:** The QR code links to the entry page. **Do NOT print the URL on any POS material.** The QR code does the work — consumers scan, not type. No URL text should appear on any consumer-facing asset.

### Why This Programme Exists

Flying Tumbler doesn't have the resources to deploy brand ambassadors into every retail account for in-store tastings and demonstrations. This programme is designed to do the heavy lifting without boots on the ground: eye-catching POS draws consumer attention to the product on the shelf, tells the brand story, and gives people a compelling reason to pick up the bottle. The sweepstakes gives consumers a reason to engage, and the entry flow builds a direct marketing relationship with every person who scans. It's a pull strategy — get noticed, tell the story, earn the sale, build the list.

The execution model is simple: we create all the creative, provide it to distributor reps (or dovetail with distributor print rooms), and the distributor rep places the POS at the account. No additional staffing, no ambassador coordination, no tasting logistics. Clean, scalable, and effective.

### Prize

2 return economy flights to Ireland for the winner + 1 guest. Draw date: 31 December 2026.

### Markets

Massachusetts, New Hampshire, New York, Washington DC, Maryland.

### Legal Lines (Must Appear on All Consumer-Facing Materials)

- **NO PURCHASE NECESSARY**
- Must be 21+ and a US resident
- Void where prohibited
- "See official rules" (no URL printed — direct to QR code or entry page)
- AMOE (Alternate Means of Entry) via email: paddyshomecoming@flyingtumbler.com

### How It Works (Consumer Flow)

1. Consumer sees POS in-store → scans QR code
2. Age gate (21+ DOB check)
3. Entry form: first name, last name, email, date of birth, zip code, store selector (state → store)
4. Confirmation page with referral link + brand content
5. Optional: share referral link for bonus entries / upload photo with The Bird for bonus entry
6. 4-email welcome sequence over 10 days

---

## 3. DELIVERABLE: LANDING PAGE

### What Exists

A Next.js app is live at paddys-homecoming.vercel.app. The code handles all functionality (age gate, form, store selector, confirmation, referral tracking, UGC uploads, admin dashboard). What it needs is **visual design polish** to bring it on-brand.

### Pages to Design

#### 3a. Age Gate
- Full-screen overlay, brand-immersive
- Headline: "Are you 21 or over?"
- Date of birth input (month/day/year dropdowns or date picker)
- Background: brand photography or illustrated scene with Paddy the Pigeon
- FT logo prominent
- Warm, welcoming tone — not clinical

#### 3b. Main Entry Page (Hero + Form)
- **Hero section:** Full-width, brand-immersive
  - Headline: "Paddy's Homecoming" (large, display type)
  - Subhead: "Win 2 Return Flights to Ireland"
  - Visual: Paddy the Pigeon with aviator goggles, Irish landscape, plane/flight motif
  - Prize callout box with Lightning Yellow accent
- **Entry form:**
  - Fields: First name, Last name, Email, Date of birth, Zip code, State selector → Store selector
  - CTA button: "Enter to Win" or "Send Paddy Home" — De York green or Coral
  - Clean, inviting, not intimidating
- **Below fold:**
  - How it works (3 steps with icons)
  - About Flying Tumbler (brand story snippet + bottle render)
  - Legal text and official rules link

#### 3c. Confirmation / Thank You Page
- Celebratory feel — "You're in! Paddy's got you on the list"
- Personal referral link prominently displayed with share CTA
- Referral mechanic explanation (share → friend enters → both get bonus entry)
- UGC upload option (photo with The Bird for bonus entry)
- Brand content: cocktail recipes, product story, store locator prompt
- Social share buttons

### Design Direction

- Mobile-first (most scans will be from phones in-store)
- Fast-loading, clean, scroll-friendly
- Irish countryside vibes but modern and fun — not cliché shamrocks
- Paddy the Pigeon as the through-line character
- Green (#8BCDA1) as the dominant colour with Purple (#352F63) and Yellow (#FCBC12) accents
- The feel should be: "my mate's whiskey brand is doing something cool" — not "corporate spirits promotion"
- **Rich brand imagery throughout:** Use real photography from the FT brand asset library for hero backgrounds, section dividers, and visual breaks. Irish countryside, bottling, casks, bottle renders, Paddy the Pigeon illustrations. The landing page should feel immersive and visual — like stepping into the brand world, not filling in a form on a blank page.

---

## 4. DELIVERABLE: 4-EMAIL WELCOME SEQUENCE

These emails are triggered when someone enters the sweepstakes. They must be **Mailchimp-compatible** (600px max width, table-based HTML layout, inline CSS, all images hosted externally or base64). Each email should feel like a continuation of the landing page experience — same brand energy, same character.

### Email 1 — Entry Confirmation (Sent Immediately)

**Subject line:** You're in! Paddy's got you on the list.
**From:** Flying Tumbler <hello@flyingtumbler.com>

**Content:**
- Header: Paddy's Homecoming branding with Pigeon mascot
- Personalised greeting using first name
- Confirmation they're entered, mention of their store
- Prize reminder box: "2 Return Flights to Ireland"
- Bonus entry mechanics:
  - 1. Share your referral link → both get bonus entry
  - 2. Upload a photo with The Bird → free bonus entry
- Personalised referral link prominently displayed with CTA button
- Programme end date: December 31, 2026
- Footer: FT branding, legal text, unsubscribe

**Design notes:** Celebratory energy. The consumer just entered — make them feel good about it. Use Lightning Yellow (#FCBC12) for the prize callout. Coral (#E9847E) for CTA buttons. Port Gore (#352F63) for header/footer backgrounds. **Include brand imagery**: bottle render in the header, Paddy the Pigeon illustration, and Irish landscape photography as section backgrounds. This email should feel rich and visual, not just text boxes.

### Email 2 — Brand Story (Day 2)

**Subject line:** The Bird who flew home
**From:** Flying Tumbler <hello@flyingtumbler.com>

**Content:**
- Header: brand scene (Irish countryside, distillery, casks)
- Story sections with visual breaks:
  - **Born in County Carlow** — Mount Leinster, the wind, the barley, the water
  - **The Liquid** — Single malt + grain, 5yr bourbon cask, 43% ABV, non-chill filtered. "Smooth enough to sip neat. Bold enough to stand tall in a cocktail."
  - **Meet Paddy** — the pigeon mascot, his journey across America, heading home to Ireland. "That's the homecoming you're part of."
- Pull quote: "Next time you see The Bird on the shelf, you'll know the story behind it."
- Referral reminder CTA
- Footer with branding

**Design notes:** Storytelling email. This should feel like a mini-magazine spread. **Pull real brand photography from the asset library:** Irish landscape shots for "Born in County Carlow," cask and bottling photography for "The Liquid," and the Paddy the Pigeon illustration for "Meet Paddy." Each story section should have a different coloured accent bar (Green, Yellow, Coral) with a relevant image alongside or behind the text. The tone is warm and personal — like the founder writing to you directly.

### Email 3 — Cocktail Recipes (Day 5)

**Subject line:** 3 ways to drink The Bird
**From:** Flying Tumbler <hello@flyingtumbler.com>

**Content:**
- Header: cocktail imagery (warm, lifestyle)
- 3 recipe cards, each with distinct visual identity:
  - **The Paddy's Old Fashioned** (Green accent)
    - 2 oz The Bird, 0.5 oz simple syrup, 2 dashes Angostura, orange peel
    - Method: Stir in mixing glass, strain over large ice cube, express orange peel
  - **The Homecoming Highball** (Yellow accent)
    - 2 oz The Bird, 4 oz ginger ale, lime squeeze, fresh mint
    - Method: Fill tall glass with ice, pour, top, garnish
  - **The Bird Neat** (Purple accent)
    - 2 oz The Bird, few drops of water, no ice
    - Method: Glencairn or rocks glass, add water, let breathe, sip slowly. "At 43% and non-chill filtered, you get the full story in every glass."
- Each recipe card: ingredients on left, method on right (or stacked on mobile)
- Share CTA + UGC photo reminder
- Footer with branding

**Design notes:** This should be the most visually rich email. Recipe cards should look like something you'd tear out of a magazine. **Use cocktail photography from the brand asset library** — there are lifestyle shots of cocktails, bottles, and bar scenes. If specific cocktail images aren't available, use warm, atmospheric bottle/bar photography as section backgrounds. Each recipe gets its own brand colour. The "Neat" serve should feel premium and contemplative.

### Email 4 — Referral Nudge (Day 10)

**Subject line:** Your referral link is lonely
**From:** Flying Tumbler <hello@flyingtumbler.com>

**Content:**
- Header: playful, Paddy the Pigeon looking expectant
- Opening: "Quick question: do you like free flights to Ireland? Of course you do."
- The deal: "Every friend who enters = another entry for you"
- Personalised referral link in a prominent dashed-border box
- 3-step how it works:
  1. Share your link (text, WhatsApp, group chat)
  2. Friend enters the sweepstakes
  3. You both get closer to Ireland
- UGC photo reminder
- Countdown/urgency: "The draw is December 31, 2026"
- Bold final CTA: "Share Now & Stack Your Entries"
- Footer with branding

**Design notes:** This is the push email. It should feel energetic and urgent without being spammy. Use the full brand colour palette — Yellow for urgency, Coral for CTAs, Green for the final big CTA. Paddy the Pigeon should feature prominently. The referral link box should be the visual centrepiece. The tone is cheeky and fun — "your link is lonely" sets the personality.

### Email Design Rules (All 4)

- Max width: 600px
- Table-based HTML layout with inline CSS (Mailchimp/email client compatibility)
- Arial or system sans-serif font stack
- All images must be hosted externally (Mailchimp image hosting or CDN)
- Use Mailchimp merge tags: `*|FNAME|*` (first name), `*|LNAME|*` (last name), `*|REFCODE|*` (referral code), `*|SSTORE|*` (store name), `*|MMERGE25|*` (state), `*|UNSUB|*` (unsubscribe)
- Every email includes: referral CTA, unsubscribe link, legal footer
- Background: #F3F3F3 (Wild Sand) behind the main container
- Main container: white with rounded corners
- Headers: gradient backgrounds using brand colours
- CTA buttons: Coral (#E9847E) primary, De York (#8BCDA1) secondary
- Text colour: Oxford Blue (#343F49), never pure black
- Under 100KB per email for deliverability

---

## 5. DELIVERABLE: POS SUITE

All POS materials are co-branded — each store gets their name on the piece. A QR code on each piece links to the entry page. **No URL text appears on any POS — the QR code does the work.** Every piece must include the legal line: "NO PURCHASE NECESSARY. 21+ US residents."

**Pricing rule:** Do NOT include any retail price on POS materials. Retailers set their own pricing. Where appropriate (especially shelf talkers), leave physical space for the retailer to attach their own price tag, magic eight, or shelf label.

**No printed URL on any POS asset.** Consumers scan the QR code — they don't type a URL. Keep all POS clean of web addresses.

### 5a. Shelf Talker — 3.5" × 5.5"

**Purpose:** Sits on the shelf rail next to the bottle
**Must include:**
- Paddy the Pigeon mascot (prominent)
- "WIN 2 FLIGHTS TO IRELAND" headline
- QR code (large enough to scan easily)
- "Scan to Enter" instruction
- Store name placeholder: "[STORE NAME]"
- NO PURCHASE NECESSARY legal line
- FT logo
- Bottle render or product imagery

**Design direction:** This is the primary scan trigger. The QR code and headline must dominate. Port Gore (#352F63) background with Lightning Yellow (#FCBC12) prize text works well. The pigeon should look like he's inviting you to scan.

### 5b. Case Card — 5.5" × 8.5"

**Purpose:** Inserts into/sits on top of a case stack or floor display
**Must include:**
- Everything from shelf talker, plus:
- Brief "How to Enter" steps (scan → enter → win)
- "Share with a mate for bonus entries" call-out
- Tasting notes snapshot
- Larger format allows for more brand imagery

**Design direction:** Landscape or portrait orientation. More room for storytelling. Show the bottle render alongside the QR and prize messaging. Use the brand's gradient backgrounds. This is the second most common scan point.

### 5c. Counter Tent Card — 4" × 6" (folded tent)

**Purpose:** Sits on checkout counters, tasting tables, register areas
**Must include:**
- Same core messaging as shelf talker
- Two-sided: front (prize + QR) and back (brand story snippet + tasting notes)
- Stands up on its own when folded

**Design direction:** Premium feel. This is the one consumers pick up and look at. Use quality paper stock feel in the design. Include Irish landscape imagery on the back.

### 5d. Window Poster — 11" × 17"

**Purpose:** Displayed in store windows or on walls
**Must include:**
- Full brand scene — Irish landscape, Paddy the Pigeon, product
- "WIN 2 FLIGHTS TO IRELAND" as the dominant headline
- QR code (large)
- Store name
- "Scan Inside to Enter" or "Ask for The Bird Inside"
- Legal line
- FT logo + product render

**Design direction:** This is the showstopper. Full visual impact. Think travel poster meets craft whiskey brand. The Irish countryside should be prominent. Paddy the Pigeon should look adventurous. The prize should make someone stop walking.

### 5e. End Cap Header — 24" × 6"

**Purpose:** Sits on top of an end cap/gondola display
**Must include:**
- "PADDY'S HOMECOMING" headline
- "Win 2 Flights to Ireland — Scan to Enter"
- QR code
- FT logo + pigeon
- Store name

**Design direction:** Wide, horizontal strip. Must be readable from 10+ feet away. Bold, simple, high-contrast. Port Gore background with Lightning Yellow text.

### 5f. Email Banner — 600 × 200px

**Purpose:** Digital banner for distributor/rep emails to accounts
**Must include:**
- Same messaging as shelf talker in digital format
- "Available for your store — ask your rep"
- FT branding

### 5g. Social Post Template — 1080 × 1080px

**Purpose:** Template for Instagram/Facebook posts (used by retailers and FT accounts)
**Must include:**
- "WIN 2 FLIGHTS TO IRELAND" headline
- Paddy the Pigeon
- "Scan in-store to enter" or "Link in bio"
- Store name placeholder
- FT branding
- Visually striking enough to stop the scroll

---

## 6. DELIVERABLE: RETAILER SOCIAL MEDIA KIT

A set of social media templates that retailers (liquor stores, bars) can customise with their store name and post on their own Instagram/Facebook to drive awareness of the sweepstakes in their location.

### 6a. Instagram Feed Post — 1080 × 1080px (2–3 variants)

**Variant 1: Prize Announcement**
- "WIN 2 FLIGHTS TO IRELAND" headline
- "Visit [STORE NAME] and scan the QR code on our Flying Tumbler display"
- Paddy the Pigeon + Irish landscape
- FT branding

**Variant 2: How to Enter**
- 3-step visual: Visit store → Scan QR → Enter to win
- Store name prominent
- "Available now at [STORE NAME]"

**Variant 3: Product + Prize**
- Bottle render or lifestyle shot with the bottle
- "Grab The Bird. Scan the code. Fly to Ireland."
- QR code or "in-store only" callout

### 6b. Instagram Story — 1080 × 1920px (2 variants)

**Variant 1: Full-screen prize announcement**
- Animated feel (design for static but with "swipe up" energy)
- Prize headline, QR code, store name, CTA

**Variant 2: Behind-the-scenes / brand story**
- Irish countryside or bottling imagery
- "The Bird is from County Carlow, Ireland. Now he's visiting [STORE NAME]."
- Swipe-up CTA or "visit us in-store"

### 6c. Facebook Post — 1200 × 630px

- Prize-focused header image
- "We're partnering with Flying Tumbler Irish Whiskey for Paddy's Homecoming!"
- Prize details, how to enter, store name
- FT branding

### Social Kit Design Rules

- Store name appears as "[STORE NAME]" — editable text layer/placeholder
- All variants must work without the QR code (for digital/social where QR doesn't work — use "visit us in-store" instead)
- Brand colours dominant, no stock-photo feel
- Every asset includes FT logo and the "NO PURCHASE NECESSARY. 21+" legal line in small text
- Tone: exciting but not screaming. "Your local shop has something cool happening" energy

---

## 7. DELIVERABLE: RETAILER & DISTRIBUTOR REP PROGRAMME EXPLAINER

A clear, visually compelling one-pager (or short PDF) that explains the Paddy's Homecoming programme to **retailers** and **distributor reps**. This is NOT consumer-facing — it's the sell-in piece that gets the programme placed in stores.

### Audience

Two audiences, one document (or two versions if needed):

1. **Distributor reps** — the people who visit accounts and place POS. They need to understand what the programme is, what materials they're delivering, and what the benefits are for their accounts.
2. **Retailers/account owners** — the store managers and buyers who agree to display the POS. They need to understand what's in it for them.

### Content to Include

**What is Paddy's Homecoming?**
A consumer sweepstakes from Flying Tumbler Irish Whiskey — "Win 2 Return Flights to Ireland." QR-code POS is placed in-store, consumers scan to enter, and Flying Tumbler handles everything else. Zero effort from the retailer once the POS is up.

**What's in it for the retailer?**
- Drives foot traffic and attention to the whiskey aisle
- Eye-catching POS draws consumers to the product on the shelf
- Consumers who engage with the brand are more likely to purchase
- Builds product awareness without the retailer having to do anything
- Co-branded materials feature the store's name — free advertising
- Retailers can share social media templates on their own channels for additional reach

**What's in it for the distributor rep?**
- Easy programme to present — everything is done for them
- All creative is provided, print-ready
- Gives them a reason to visit accounts and place product
- Helps drive organic shelf pull in their territory
- Flying Tumbler handles all digital, marketing, and sweepstakes administration

**What the rep needs to do:**
1. Present the programme to the account
2. Deliver the POS materials (shelf talker, case card, counter tent card, etc.)
3. Place the POS at the account
4. That's it — Flying Tumbler handles the rest

**Programme details:**
- Prize: 2 return flights to Ireland
- Draw date: December 31, 2026
- Markets: MA, NH, NY, DC, MD
- No purchase necessary
- All consumer data collected goes to Flying Tumbler (not the retailer)

**POS materials available:**
- Shelf Talker (3.5" × 5.5")
- Case Card (5.5" × 8.5")
- Counter Tent Card (4" × 6")
- Window Poster (11" × 17")
- End Cap Header (24" × 6")
- Social media templates for retailer use

### Design Direction

On-brand but trade-focused. This should look professional and polished — it's a sell-in tool, not a consumer ad. Use brand colours and imagery, but the tone is more "here's what we're doing and why it's great for your store" than "win flights to Ireland!" Include a product shot, a mockup of the POS in-situ (shelf talker on a shelf, poster in a window), and the FT logo.

Format: PDF, single page (front and back if needed), or 2-page max. Print-ready and also functional as a digital attachment in an email.

---

## 8. FILE DELIVERY

### Expected Outputs

| Deliverable | Format | Quantity |
|-------------|--------|----------|
| Landing page designs | Figma/PNG mockups | 3 pages (age gate, entry, confirmation) |
| Email templates | HTML (Mailchimp-ready) | 4 emails |
| Shelf Talker | PDF (print-ready, 3.5"×5.5") | 1 |
| Case Card | PDF (print-ready, 5.5"×8.5") | 1 |
| Counter Tent Card | PDF (print-ready, 4"×6") | 1 |
| Window Poster | PDF (print-ready, 11"×17") | 1 |
| End Cap Header | PDF (print-ready, 24"×6") | 1 |
| Email Banner | PNG (600×200px) | 1 |
| Social Post Template | PNG (1080×1080px) | 1 |
| IG Feed Posts | PNG (1080×1080px) | 3 variants |
| IG Stories | PNG (1080×1920px) | 2 variants |
| FB Post | PNG (1200×630px) | 1 |
| Retailer/Rep Programme Explainer | PDF (print + digital) | 1 (1-2 pages) |

### Print Specs

- CMYK colour mode for all print materials
- 300 DPI minimum
- 0.125" bleed on all sides
- Crop marks included
- Fonts outlined/embedded

### Brand Asset Sources

All brand photography and design assets are in OneDrive:
**Mount Leinster Spirits (UK) Limited > Flying Tumbler - Documents > Sales > Cask Sales > Consumer Casks > Images**

Subfolders: Bottling, Casks, Design Assets (stamps, clouds, logos, Paddy illustrations), Renders.

Logo files:
- Bird icon (240×161px): tumbler pigeon with aviator goggles on orange circle
- Circle logo (1000×1000px): full circular badge with "FLYING TUMBLER" text, bird centre, coordinates

---

## 9. SUMMARY CHECKLIST

- [ ] All deliverables follow the Flying Tumbler brand design system
- [ ] Paddy the Pigeon appears on every consumer-facing piece
- [ ] Brand photography used throughout (no stock photos, no empty/corporate feel)
- [ ] Colour palette strictly adhered to (primary trio: Green, Coral, Yellow)
- [ ] Legal lines present on all consumer-facing materials
- [ ] QR code prominently placed on all POS materials — **no URL text printed anywhere**
- [ ] **No retail pricing on any POS or consumer materials** — space left for retailer tags where appropriate
- [ ] Store name placeholder on all co-branded pieces
- [ ] Mobile-first design for landing page
- [ ] Email templates are Mailchimp HTML-compatible
- [ ] **Entry form collects first name AND last name** — both in Mailchimp merge fields
- [ ] Print materials are print-ready with correct specs
- [ ] Tone is playful, warm, adventurous — never corporate or stiff
- [ ] Referral mechanic clearly communicated across emails and landing page
- [ ] **All emails include real brand imagery** — not just text/colour blocks
- [ ] **ABV shown as 43%** (current US bottling) on all materials
- [ ] **Retailer/Rep programme explainer** included — trade sell-in piece
- [ ] **AMOE via email** (paddyshomecoming@flyingtumbler.com) — no PO Box
