# Mailchimp Customer Journey Setup Guide
## Paddy's Homecoming — Sweepstakes Welcome Sequence

The Customer Journey **"Paddy's Homecoming - Sweepstakes Welcome"** already exists in draft with the correct trigger (**Contact tagged `paddys-homecoming`**). You just need to add the 4 email steps and the time delays between them.

---

### Open the Journey Builder

1. Go to **Mailchimp → Automations → Automation flows**
2. Find **"Paddy's Homecoming - Sweepstakes Welcome"** (Draft)
3. Click **"Finish Setup"**

You'll see the flow canvas with the trigger at the top and an **"Add a step"** placeholder below it.

---

### Step-by-Step: Build the Flow

Build the sequence top-to-bottom by clicking **"Add a step"** and selecting the right action each time.

#### 1. Email 1 — Entry Confirmation (Immediate)

- Click **"Add a step"** → Select **"Send email"**
- **Subject line:** `You're in! Paddy's got you on the list.`
- **From name:** `Flying Tumbler`
- **From email:** `hello@flyingtumbler.com`
- **Design:** Switch to **Code** view → paste the entire contents of `email_1_confirmation.html`
- Save and return to the flow

#### 2. Time Delay — 2 Days

- Click **"Add a step"** (below Email 1) → Select **"Time delay"**
- Set to **2 days**

#### 3. Email 2 — Brand Story

- Click **"Add a step"** → Select **"Send email"**
- **Subject line:** `The Bird who flew home`
- **From name:** `Flying Tumbler`
- **From email:** `hello@flyingtumbler.com`
- **Design:** Switch to **Code** view → paste the entire contents of `email_2_brand_story.html`
- Save and return to the flow

#### 4. Time Delay — 3 Days

- Click **"Add a step"** → Select **"Time delay"**
- Set to **3 days**

#### 5. Email 3 — Cocktail Recipes

- Click **"Add a step"** → Select **"Send email"**
- **Subject line:** `3 ways to drink The Bird`
- **From name:** `Flying Tumbler`
- **From email:** `hello@flyingtumbler.com`
- **Design:** Switch to **Code** view → paste the entire contents of `email_3_cocktails.html`
- Save and return to the flow

#### 6. Time Delay — 5 Days

- Click **"Add a step"** → Select **"Time delay"**
- Set to **5 days**

#### 7. Email 4 — Referral Nudge

- Click **"Add a step"** → Select **"Send email"**
- **Subject line:** `Your referral link is lonely`
- **From name:** `Flying Tumbler`
- **From email:** `hello@flyingtumbler.com`
- **Design:** Switch to **Code** view → paste the entire contents of `email_4_referral_nudge.html`
- Save and return to the flow

---

### Activate the Journey

Once all 7 steps are in place (4 emails + 3 time delays), click **"Continue"** (top right) → review → **"Turn on"**.

---

### Email Files Location

The HTML files are in your local repo at:
```
Paddys Homecoming\emails\
├── email_1_confirmation.html
├── email_2_brand_story.html
├── email_3_cocktails.html
└── email_4_referral_nudge.html
```

Open each file in a text editor (Notepad, VS Code), Select All (Ctrl+A), Copy (Ctrl+C), then paste into Mailchimp's Code view.

---

### The Complete Flow Should Look Like:

```
Contact tagged paddys-homecoming
        │
   Send Email 1  ← "You're in! Paddy's got you on the list."
        │
   Wait 2 days
        │
   Send Email 2  ← "The Bird who flew home"
        │
   Wait 3 days
        │
   Send Email 3  ← "3 ways to drink The Bird"
        │
   Wait 5 days
        │
   Send Email 4  ← "Your referral link is lonely"
        │
   Contact exits
```

---

### Remaining Setup Tasks (Separate from this guide)

1. **Vercel KV:** Add payment method at vercel.com/stores to activate Redis
2. **Mailchimp API Key:** Add `MAILCHIMP_API_KEY` env var in Vercel project settings (format: `{key}-us18`)
3. **Store list:** Provide full store list (~300+ stores) for the dropdown
