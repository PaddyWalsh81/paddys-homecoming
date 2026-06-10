/**
 * In-memory database for development / initial deployment.
 * Replace with Supabase or Vercel KV for production persistence.
 *
 * Structure:
 * - entries: all sweepstakes entries (direct + bonus)
 * - ugcUploads: user-generated content metadata
 */

export interface Entry {
  id: string;
  firstName: string;
  email: string;
  dob: string;
  zip: string;
  store: string;
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

// In-memory stores (reset on cold start — replace with real DB)
const entries: Entry[] = [];
const ugcUploads: UGCUpload[] = [];

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

/* ── ENTRIES ── */

export function addEntry(data: {
  firstName: string;
  email: string;
  dob: string;
  zip: string;
  store: string;
  referredBy: string | null;
}): { entry: Entry; isNew: boolean; referralCode: string } {
  // Check for duplicate email (direct entry)
  const existing = entries.find(
    (e) => e.email === data.email && e.entryType === "direct"
  );
  if (existing) {
    return { entry: existing, isNew: false, referralCode: existing.referralCode };
  }

  const referralCode = generateReferralCode();
  const entry: Entry = {
    id: generateId(),
    ...data,
    referralCode,
    entryType: "direct",
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);

  // If referred by someone, give the referrer a bonus entry
  if (data.referredBy) {
    const referrer = entries.find(
      (e) => e.referralCode === data.referredBy && e.entryType === "direct"
    );
    if (referrer) {
      entries.push({
        id: generateId(),
        firstName: referrer.firstName,
        email: referrer.email,
        dob: referrer.dob,
        zip: referrer.zip,
        store: referrer.store,
        referralCode: referrer.referralCode,
        referredBy: null,
        entryType: "referral_bonus",
        createdAt: new Date().toISOString(),
      });
    }
  }

  return { entry, isNew: true, referralCode };
}

export function addUGCBonusEntry(email: string, referralCode: string): boolean {
  const direct = entries.find(
    (e) => e.email === email && e.entryType === "direct"
  );
  if (!direct) return false;

  // Check if already got a UGC bonus
  const existing = entries.find(
    (e) => e.email === email && e.entryType === "ugc_bonus"
  );
  if (existing) return false;

  entries.push({
    id: generateId(),
    firstName: direct.firstName,
    email: direct.email,
    dob: direct.dob,
    zip: direct.zip,
    store: direct.store,
    referralCode: direct.referralCode,
    referredBy: null,
    entryType: "ugc_bonus",
    createdAt: new Date().toISOString(),
  });
  return true;
}

export function addUGCUpload(data: {
  email: string;
  referralCode: string;
  filename: string;
}): UGCUpload {
  const upload: UGCUpload = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  ugcUploads.push(upload);
  return upload;
}

/* ── STATS ── */

export function getStats() {
  const directEntries = entries.filter((e) => e.entryType === "direct");
  const referralBonuses = entries.filter((e) => e.entryType === "referral_bonus");
  const ugcBonuses = entries.filter((e) => e.entryType === "ugc_bonus");

  // By store
  const byStore: Record<string, number> = {};
  directEntries.forEach((e) => {
    byStore[e.store] = (byStore[e.store] || 0) + 1;
  });

  // By state (extract from store name or zip)
  const byState: Record<string, number> = {};
  directEntries.forEach((e) => {
    const match = e.store.match(/\b(MA|NH|DC|NY|MD)\b/);
    const state = match ? match[1] : "Other";
    byState[state] = (byState[state] || 0) + 1;
  });

  // By date
  const byDate: Record<string, number> = {};
  directEntries.forEach((e) => {
    const date = e.createdAt.split("T")[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });

  // Referral leaderboard (who generated the most bonus entries)
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
    totalUGCUploads: ugcUploads.length,
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

export function executeDraw(): {
  winner: Entry;
  totalEntries: number;
  drawTimestamp: string;
  auditLog: string;
} | null {
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
    `Winner: ${winner.firstName} (${winner.email})`,
    `Winner entry type: ${winner.entryType}`,
    `Winner store: ${winner.store}`,
    `Method: crypto.getRandomValues (Web Crypto API)`,
  ].join("\n");

  return { winner, totalEntries: entries.length, drawTimestamp, auditLog };
}

/* ── EXPORT ── */

export function exportCSV(): string {
  const headers = "id,firstName,email,dob,zip,store,referralCode,referredBy,entryType,createdAt";
  const rows = entries.map((e) =>
    [e.id, e.firstName, e.email, e.dob, e.zip, `"${e.store}"`, e.referralCode, e.referredBy || "", e.entryType, e.createdAt].join(",")
  );
  return [headers, ...rows].join("\n");
}
