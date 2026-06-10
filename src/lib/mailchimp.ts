/**
 * Mailchimp integration for Paddy's Homecoming sweepstakes.
 *
 * Adds new entries to the Flying Tumbler Master Audience (8be8898517)
 * with merge fields and tags for segmentation.
 *
 * Requires env var: MAILCHIMP_API_KEY (format: {key}-us18)
 */

import crypto from "crypto";

const AUDIENCE_ID = "8be8898517"; // Flying Tumbler Master Audience

function getConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY || "";
  if (!apiKey) return null;

  // Extract datacenter from API key (e.g. "abc123-us18" → "us18")
  const dc = apiKey.split("-").pop() || "us18";
  return { apiKey, dc, baseUrl: `https://${dc}.api.mailchimp.com/3.0` };
}

function md5(str: string): string {
  return crypto.createHash("md5").update(str.toLowerCase()).digest("hex");
}

/**
 * Upsert a sweepstakes entrant into the Master Audience.
 *
 * Uses PUT /lists/{id}/members/{hash} (upsert: creates if new, updates if exists).
 * Then adds tags for segmentation.
 *
 * Non-blocking: failures are logged but don't break the entry flow.
 */
export async function addSweepstakesSubscriber(data: {
  email: string;
  firstName: string;
  zip: string;
  store: string;
  state: string;
  referralCode: string;
}): Promise<{ success: boolean; error?: string }> {
  const config = getConfig();
  if (!config) {
    console.warn("[Mailchimp] MAILCHIMP_API_KEY not set — skipping subscriber add");
    return { success: false, error: "API key not configured" };
  }

  const subscriberHash = md5(data.email);
  const url = `${config.baseUrl}/lists/${AUDIENCE_ID}/members/${subscriberHash}`;

  try {
    // Step 1: Upsert member with merge fields
    const memberRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: data.email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: data.firstName,
          MMERGE21: data.zip,       // Zip/Post code
          MMERGE25: data.state,     // State
          MARKET: "us",             // Market / Landing Page
          MMERGE22: "United States of America", // Country
        },
      }),
    });

    if (!memberRes.ok) {
      const err = await memberRes.text();
      console.error("[Mailchimp] Member upsert failed:", err);
      return { success: false, error: `Member upsert failed: ${memberRes.status}` };
    }

    // Step 2: Add tags for segmentation
    const tagsUrl = `${config.baseUrl}/lists/${AUDIENCE_ID}/members/${subscriberHash}/tags`;
    await fetch(tagsUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: [
          { name: "paddys-homecoming", status: "active" },
          { name: `sweepstakes-${data.state.toLowerCase()}`, status: "active" },
          { name: "sweepstakes-entrant", status: "active" },
        ],
      }),
    });

    return { success: true };
  } catch (err) {
    console.error("[Mailchimp] Error:", err);
    return { success: false, error: String(err) };
  }
}
