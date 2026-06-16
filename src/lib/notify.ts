/**
 * Notification helper — sends email alerts to Patrick + Thomas
 * when someone enters the sweepstakes or claims the GWP.
 *
 * Uses a webhook URL (env: NOTIFY_WEBHOOK_URL) to trigger
 * an external email service (Make.com, Resend, etc.).
 *
 * All calls are fire-and-forget — never blocks the user-facing response.
 */

const WEBHOOK_URL = process.env.NOTIFY_WEBHOOK_URL || "";
const NOTIFY_TO = ["patrick@flyingtumbler.com", "thomas@flyingtumbler.com"];

interface EntryNotification {
  firstName: string;
  lastName: string;
  email: string;
  store: string;
  state: string;
  zip: string;
  dob: string;
  referredBy?: string | null;
}

interface ClaimNotification {
  firstName: string;
  lastName: string;
  email: string;
  product: string;
  purchaseStore: string;
  purchaseState: string;
  shippingName: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  phone: string;
  receiptFilename: string;
}

function buildEntryEmailHTML(data: EntryNotification): string {
  return `
<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.7; color: #1a1a1a; max-width: 600px;">
  <div style="background: #343F49; padding: 12px 24px; border-bottom: 4px solid #8BCDA1;">
    <span style="color: #FCBC12; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase;">Paddy's Homecoming — New Entry</span>
  </div>
  <div style="padding: 24px; background: #FFFFFF;">
    <h2 style="color: #352F63; font-size: 20px; margin: 0 0 16px;">New Sweepstakes Entry</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="background: #F9F9F9;"><td style="padding: 8px 12px; font-weight: bold; width: 120px; border-bottom: 1px solid #E8E8E8;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.firstName} ${data.lastName}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.email}</td></tr>
      <tr style="background: #F9F9F9;"><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Store</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.store}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">State</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.state}</td></tr>
      <tr style="background: #F9F9F9;"><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">ZIP</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.zip}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">DOB</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.dob}</td></tr>
      ${data.referredBy ? `<tr style="background: #F9F9F9;"><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Referred By</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.referredBy}</td></tr>` : ""}
    </table>
    <p style="font-size: 12px; color: #888; margin-top: 16px;">Timestamp: ${new Date().toISOString()}</p>
  </div>
  <div style="background: #343F49; padding: 10px 24px; text-align: center;">
    <span style="color: #8BCDA1; font-size: 11px;">Paddy's Homecoming — Flying Tumbler Irish Whiskey</span>
  </div>
</div>`;
}

function buildClaimEmailHTML(data: ClaimNotification): string {
  return `
<div style="font-family: Georgia, serif; font-size: 15px; line-height: 1.7; color: #1a1a1a; max-width: 600px;">
  <div style="background: #343F49; padding: 12px 24px; border-bottom: 4px solid #E9847E;">
    <span style="color: #FCBC12; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase;">Paddy's Homecoming — GWP Claim</span>
  </div>
  <div style="padding: 24px; background: #FFFFFF;">
    <h2 style="color: #352F63; font-size: 20px; margin: 0 0 4px;">New Gift With Purchase Claim</h2>
    <p style="color: #E9847E; font-size: 13px; font-weight: bold; margin: 0 0 16px;">Requires admin review → <a href="https://paddys-homecoming.vercel.app/admin" style="color: #352F63;">Open Admin Dashboard</a></p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="background: #F9F9F9;"><td style="padding: 8px 12px; font-weight: bold; width: 130px; border-bottom: 1px solid #E8E8E8;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.firstName} ${data.lastName || ""}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.email}</td></tr>
      <tr style="background: #F9F9F9;"><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Phone</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.phone}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Product</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.product}</td></tr>
      <tr style="background: #8BCDA120;"><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Purchase Store</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.purchaseStore}</td></tr>
      <tr><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Purchase State</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.purchaseState}</td></tr>
      <tr style="background: #F9F9F9;"><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #E8E8E8;">Receipt File</td><td style="padding: 8px 12px; border-bottom: 1px solid #E8E8E8;">${data.receiptFilename}</td></tr>
    </table>
    <h3 style="color: #343F49; font-size: 14px; margin: 20px 0 8px; border-bottom: 2px solid #E9847E; padding-bottom: 4px;">Shipping Address</h3>
    <p style="font-size: 14px; margin: 0; line-height: 1.6;">
      ${data.shippingName}<br>
      ${data.shippingAddress1}<br>
      ${data.shippingAddress2 ? data.shippingAddress2 + "<br>" : ""}
      ${data.shippingCity}, ${data.shippingState} ${data.shippingZip}
    </p>
    <p style="font-size: 12px; color: #888; margin-top: 16px;">Timestamp: ${new Date().toISOString()}</p>
  </div>
  <div style="background: #343F49; padding: 10px 24px; text-align: center;">
    <span style="color: #8BCDA1; font-size: 11px;">Paddy's Homecoming — Flying Tumbler Irish Whiskey</span>
  </div>
</div>`;
}

async function sendViaWebhook(subject: string, html: string): Promise<void> {
  if (!WEBHOOK_URL) {
    console.log(`[Notify] No NOTIFY_WEBHOOK_URL set — skipping email: "${subject}"`);
    return;
  }

  // Make.com webhook expects {to_email, subject, body} — one recipient per call
  for (const recipient of NOTIFY_TO) {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: recipient,
          subject,
          body: html,
        }),
      });
      if (!res.ok) {
        console.error(`[Notify] Webhook returned ${res.status} for ${recipient}:`, await res.text().catch(() => ""));
      }
    } catch (err) {
      console.error(`[Notify] Webhook call failed for ${recipient}:`, err);
    }
  }
}

/**
 * Fire-and-forget notification when someone enters the sweepstakes.
 */
export function notifyNewEntry(data: EntryNotification): void {
  const subject = `🎯 New Entry: ${data.firstName} ${data.lastName} — ${data.store} (${data.state})`;
  const html = buildEntryEmailHTML(data);
  sendViaWebhook(subject, html).catch(() => {});
}

/**
 * Fire-and-forget notification when someone claims the GWP.
 */
export function notifyNewClaim(data: ClaimNotification): void {
  const subject = `🎁 GWP Claim: ${data.firstName} — ${data.product} — ${data.purchaseStore}`;
  const html = buildClaimEmailHTML(data);
  sendViaWebhook(subject, html).catch(() => {});
}
