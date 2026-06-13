/**
 * Persistent database layer using Upstash Redis (via Vercel Storage).
 *
 * Redis key schema:
 *   entry:{id}                → JSON Entry
 *   entry_ids                 → List of all entry IDs (newest first)
 *   direct_by_email:{email}   → entry ID (dedup direct entries)
 *   referral:{code}           → entry ID (lookup referral source)
 *   ugc:{id}                  → JSON UGCUpload
 *   ugc_ids                   → List of all UGC upload IDs
 *   ugc_claimed:{email}       → "1" (dedup UGC bonus)
 *   counter:direct            → int
 *   counter:referral_bonus    → int
 *   counter:ugc_bonus         → int
 *
 * Merch redemption keys:
 *   merch:{id}                → JSON MerchRedemption
 *   merch_ids                 → List of all merch redemption IDs (newest first)
 *   merch_by_email:{email}    → merch ID (dedup — one per consumer)
 *   counter:merch_pending     → int
 *   counter:merch_approved    → int
 *   counter:merch_rejected    → int
 */

import { Redis } from "@upstash/redis";

/* ── initialise client ── */
const redis = new Redis({
  url:
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    "",
  token:
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    "",
});

/* ── types ── */

export interface Entry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  zip: string;
  store: string;
  state: string;
  referralCode: string;
  referredBy: string | null;
  entryType: "direct" | "referral_bonus" | "ugc_bonus";
  createdAt: string;
}

export interface UGCUpload {
  id: string;
  email: string;
  referralCode: string;
  filename: string;
  createdAt: string;
}

export interface MerchRedemption {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  store: string;
  state: string;
  /** Receipt photo filename (stored in KV as base64 or URL) */
  receiptFilename: string;
  /** Shipping address */
  shippingName: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  /** Product selected */
  product: string;
  /** Status: pending → approved → fulfilled / rejected */
  status: "pending" | "approved" | "rejected" | "fulfilled";
  /** Printful order ID (set on approval) */
  printfulOrderId: number | null;
  /** Admin notes */
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

/* ── helpers ── */

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PADDY-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Extract US state abbreviation from store string */
function extractState(store: string): string {
  const match = store.match(/\b(MA|NH|DC|NY|MD)\b/);
  return match ? match[1] : "Other";
}

/* ── ENTRIES ── */

export async function addEntry(data: {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  zip: string;
  store: string;
  state?: string | null;
  referredBy: string | null;
}): Promise<{ entry: Entry; isNew: boolean; referralCode: string }> {
  // Check for duplicate email (direct entry)
  const existingId = await redis.get<string>(`direct_by_email:${data.email}`);
  if (existingId) {
    const existing = await redis.get<Entry>(`entry:${existingId}`);
    if (existing) {
      return { entry: existing, isNew: false, referralCode: existing.referralCode };
    }
  }

  const referralCode = generateReferralCode();
  const state = data.state || extractState(data.store);
  const entry: Entry = {
    id: generateId(),
    ...data,
    state,
    referralCode,
    entryType: "direct",
    createdAt: new Date().toISOString(),
  };

  // Store entry + indexes (pipeline for efficiency)
  const pipe = redis.pipeline();
  pipe.set(`entry:${entry.id}`, JSON.stringify(entry));
  pipe.lpush("entry_ids", entry.id);
  pipe.set(`direct_by_email:${data.email}`, entry.id);
  pipe.set(`referral:${referralCode}`, entry.id);
  pipe.incr("counter:direct");
  await pipe.exec();

  // If referred by someone, give the referrer a bonus entry
  if (data.referredBy) {
    const referrerId = await redis.get<string>(`referral:${data.referredBy}`);
    if (referrerId) {
      const referrer = await redis.get<Entry>(`entry:${referrerId}`);
      if (referrer) {
        const bonusId = generateId();
        const bonusEntry: Entry = {
          id: bonusId,
          firstName: referrer.firstName,
          lastName: referrer.lastName,
          email: referrer.email,
          dob: referrer.dob,
          zip: referrer.zip,
          store: referrer.store,
          state: referrer.state,
          referralCode: referrer.referralCode,
          referredBy: null,
          entryType: "referral_bonus",
          createdAt: new Date().toISOString(),
        };
        const bonusPipe = redis.pipeline();
        bonusPipe.set(`entry:${bonusId}`, JSON.stringify(bonusEntry));
        bonusPipe.lpush("entry_ids", bonusId);
        bonusPipe.incr("counter:referral_bonus");
        await bonusPipe.exec();
      }
    }
  }

  return { entry, isNew: true, referralCode };
}

export async function addUGCBonusEntry(email: string, referralCode: string): Promise<boolean> {
  // Check if direct entry exists
  const directId = await redis.get<string>(`direct_by_email:${email}`);
  if (!directId) return false;

  // Check if already claimed UGC bonus
  const claimed = await redis.get<string>(`ugc_claimed:${email}`);
  if (claimed) return false;

  const direct = await redis.get<Entry>(`entry:${directId}`);
  if (!direct) return false;

  const bonusId = generateId();
  const bonusEntry: Entry = {
    id: bonusId,
    firstName: direct.firstName,
    lastName: direct.lastName,
    email: direct.email,
    dob: direct.dob,
    zip: direct.zip,
    store: direct.store,
    state: direct.state || extractState(direct.store),
    referralCode: direct.referralCode,
    referredBy: null,
    entryType: "ugc_bonus",
    createdAt: new Date().toISOString(),
  };

  const pipe = redis.pipeline();
  pipe.set(`entry:${bonusId}`, JSON.stringify(bonusEntry));
  pipe.lpush("entry_ids", bonusId);
  pipe.set(`ugc_claimed:${email}`, "1");
  pipe.incr("counter:ugc_bonus");
  await pipe.exec();

  return true;
}

export async function addUGCUpload(data: {
  email: string;
  referralCode: string;
  filename: string;
}): Promise<UGCUpload> {
  const upload: UGCUpload = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  const pipe = redis.pipeline();
  pipe.set(`ugc:${upload.id}`, JSON.stringify(upload));
  pipe.lpush("ugc_ids", upload.id);
  await pipe.exec();
  return upload;
}

/* ── STATS ── */

async function getAllEntries(): Promise<Entry[]> {
  const ids = await redis.lrange<string>("entry_ids", 0, -1);
  if (!ids || ids.length === 0) return [];

  // Batch fetch in chunks of 100
  const entries: Entry[] = [];
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const pipe = redis.pipeline();
    chunk.forEach((id) => pipe.get(`entry:${id}`));
    const results = await pipe.exec();
    results.forEach((r) => {
      if (r) {
        const entry = typeof r === "string" ? JSON.parse(r) : r;
        entries.push(entry as Entry);
      }
    });
  }
  return entries;
}

export async function getStats() {
  const entries = await getAllEntries();
  const directEntries = entries.filter((e) => e.entryType === "direct");
  const referralBonuses = entries.filter((e) => e.entryType === "referral_bonus");
  const ugcBonuses = entries.filter((e) => e.entryType === "ugc_bonus");

  // Count UGC uploads
  const ugcIds = await redis.lrange<string>("ugc_ids", 0, -1);

  // By store
  const byStore: Record<string, number> = {};
  directEntries.forEach((e) => {
    byStore[e.store] = (byStore[e.store] || 0) + 1;
  });

  // By state
  const byState: Record<string, number> = {};
  directEntries.forEach((e) => {
    const state = e.state || extractState(e.store);
    byState[state] = (byState[state] || 0) + 1;
  });

  // By date
  const byDate: Record<string, number> = {};
  directEntries.forEach((e) => {
    const date = e.createdAt.split("T")[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });

  // Referral leaderboard
  const referralCounts: Record<string, { name: string; count: number }> = {};
  referralBonuses.forEach((e) => {
    if (!referralCounts[e.email]) {
      referralCounts[e.email] = { name: e.firstName, count: 0 };
    }
    referralCounts[e.email].count++;
  });
  const referralLeaderboard = Object.entries(referralCounts)
    .map(([email, data]) => ({ email, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    totalDirectEntries: directEntries.length,
    totalReferralBonuses: referralBonuses.length,
    totalUGCBonuses: ugcBonuses.length,
    totalDrawEntries: entries.length,
    totalUGCUploads: ugcIds?.length || 0,
    byStore: Object.entries(byStore)
      .map(([store, count]) => ({ store, count }))
      .sort((a, b) => b.count - a.count),
    byState: Object.entries(byState)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count),
    byDate: Object.entries(byDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    referralLeaderboard,
  };
}

/* ── DRAW ── */

export async function executeDraw(): Promise<{
  winner: Entry;
  totalEntries: number;
  drawTimestamp: string;
  auditLog: string;
} | null> {
  const entries = await getAllEntries();
  if (entries.length === 0) return null;

  // Cryptographic random selection
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  const winnerIndex = randomBytes[0] % entries.length;
  const winner = entries[winnerIndex];

  const drawTimestamp = new Date().toISOString();
  const auditLog = [
    `Draw executed at: ${drawTimestamp}`,
    `Total entries in pool: ${entries.length}`,
    `Direct entries: ${entries.filter((e) => e.entryType === "direct").length}`,
    `Referral bonus entries: ${entries.filter((e) => e.entryType === "referral_bonus").length}`,
    `UGC bonus entries: ${entries.filter((e) => e.entryType === "ugc_bonus").length}`,
    `Random index selected: ${winnerIndex}`,
    `Winner: ${winner.firstName} ${winner.lastName} (${winner.email})`,
    `Winner entry type: ${winner.entryType}`,
    `Winner store: ${winner.store}`,
    `Method: crypto.getRandomValues (Web Crypto API)`,
  ].join("\n");

  return { winner, totalEntries: entries.length, drawTimestamp, auditLog };
}

/* ── MERCH REDEMPTIONS ── */

export async function addMerchRedemption(data: {
  email: string;
  firstName: string;
  lastName: string;
  store: string;
  state: string;
  receiptFilename: string;
  shippingName: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  product: string;
}): Promise<{ redemption: MerchRedemption; isNew: boolean }> {
  // Check for existing redemption by email (one per consumer)
  const existingId = await redis.get<string>(`merch_by_email:${data.email}`);
  if (existingId) {
    const existing = await redis.get<MerchRedemption>(`merch:${existingId}`);
    if (existing) {
      return { redemption: existing, isNew: false };
    }
  }

  const now = new Date().toISOString();
  const redemption: MerchRedemption = {
    id: generateId(),
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    store: data.store,
    state: data.state,
    receiptFilename: data.receiptFilename,
    shippingName: data.shippingName,
    shippingAddress1: data.shippingAddress1,
    shippingAddress2: data.shippingAddress2 || "",
    shippingCity: data.shippingCity,
    shippingState: data.shippingState,
    shippingZip: data.shippingZip,
    product: data.product,
    status: "pending",
    printfulOrderId: null,
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };

  const pipe = redis.pipeline();
  pipe.set(`merch:${redemption.id}`, JSON.stringify(redemption));
  pipe.lpush("merch_ids", redemption.id);
  pipe.set(`merch_by_email:${data.email}`, redemption.id);
  pipe.incr("counter:merch_pending");
  await pipe.exec();

  return { redemption, isNew: true };
}

export async function getMerchRedemption(id: string): Promise<MerchRedemption | null> {
  const data = await redis.get<MerchRedemption>(`merch:${id}`);
  return data || null;
}

export async function getAllMerchRedemptions(): Promise<MerchRedemption[]> {
  const ids = await redis.lrange<string>("merch_ids", 0, -1);
  if (!ids || ids.length === 0) return [];

  const redemptions: MerchRedemption[] = [];
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const pipe = redis.pipeline();
    chunk.forEach((id) => pipe.get(`merch:${id}`));
    const results = await pipe.exec();
    results.forEach((r) => {
      if (r) {
        const item = typeof r === "string" ? JSON.parse(r) : r;
        redemptions.push(item as MerchRedemption);
      }
    });
  }
  return redemptions;
}

export async function updateMerchRedemption(
  id: string,
  updates: Partial<Pick<MerchRedemption, "status" | "printfulOrderId" | "adminNotes">>
): Promise<MerchRedemption | null> {
  const existing = await redis.get<MerchRedemption>(`merch:${id}`);
  if (!existing) return null;

  const parsed = typeof existing === "string" ? JSON.parse(existing) : existing;
  const updated: MerchRedemption = {
    ...parsed,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await redis.set(`merch:${id}`, JSON.stringify(updated));

  // Update counters on status change
  if (updates.status && updates.status !== parsed.status) {
    const pipe = redis.pipeline();
    if (parsed.status === "pending") pipe.decr("counter:merch_pending");
    if (updates.status === "approved") pipe.incr("counter:merch_approved");
    if (updates.status === "rejected") pipe.incr("counter:merch_rejected");
    await pipe.exec();
  }

  return updated;
}

/* ── EXPORT ── */

export async function exportCSV(): Promise<string> {
  const entries = await getAllEntries();
  const headers = "id,firstName,lastName,email,dob,zip,store,state,referralCode,referredBy,entryType,createdAt";
  const rows = entries.map((e) =>
    [e.id, e.firstName, e.lastName || "", e.email, e.dob, e.zip, `"${e.store}"`, e.state || "", e.referralCode, e.referredBy || "", e.entryType, e.createdAt].join(",")
  );
  return [headers, ...rows].join("\n");
}
