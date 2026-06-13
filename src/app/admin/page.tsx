"use client";
import { useState, useCallback } from "react";

const C = {
  purple: "#352F63",
  green: "#8BCDA1",
  coral: "#E9847E",
  yellow: "#FCBC12",
  navy: "#343F49",
};

interface Stats {
  totalDirectEntries: number;
  totalReferralBonuses: number;
  totalUGCBonuses: number;
  totalDrawEntries: number;
  totalUGCUploads: number;
  byStore: { store: string; count: number }[];
  byState: { state: string; count: number }[];
  byDate: { date: string; count: number }[];
  referralLeaderboard: { email: string; name: string; count: number }[];
}

interface DrawResult {
  winner: { name: string; email: string; store: string; entryType: string };
  totalEntries: number;
  drawTimestamp: string;
  auditLog: string;
}

interface MerchRedemption {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  store: string;
  state: string;
  receiptFilename: string;
  shippingName: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  product: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  printfulOrderId: number | null;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [merchRedemptions, setMerchRedemptions] = useState<MerchRedemption[]>([]);
  const [merchTab, setMerchTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const authHeader = useCallback(() => {
    return "Basic " + btoa("admin:" + password);
  }, [password]);

  async function login() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stats", {
        headers: { Authorization: "Basic " + btoa("admin:" + password) },
      });
      if (!res.ok) {
        setError("Invalid password.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setStats(data);
      setAuthed(true);
      // Also fetch merch redemptions
      try {
        const merchRes = await fetch(`/api/redeem?pw=${encodeURIComponent(password)}`);
        if (merchRes.ok) {
          const merchData = await merchRes.json();
          setMerchRedemptions(merchData.redemptions || []);
        }
      } catch { /* */ }
    } catch {
      setError("Connection failed.");
    }
    setLoading(false);
  }

  async function refreshStats() {
    setLoading(true);
    try {
      const res = await fetch("/api/stats", {
        headers: { Authorization: authHeader() },
      });
      if (res.ok) setStats(await res.json());
    } catch { /* */ }
    setLoading(false);
  }

  async function runDraw() {
    if (!confirm("Are you sure you want to execute the draw? This will select a winner.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { Authorization: authHeader() },
      });
      if (res.ok) {
        const data = await res.json();
        setDrawResult(data);
      } else {
        const data = await res.json();
        setError(data.error || "Draw failed.");
      }
    } catch {
      setError("Draw failed.");
    }
    setLoading(false);
  }

  async function downloadCSV() {
    const res = await fetch("/api/stats?format=csv", {
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paddys-homecoming-entries.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function fetchMerchRedemptions() {
    try {
      const res = await fetch(`/api/redeem?pw=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        setMerchRedemptions(data.redemptions || []);
      }
    } catch { /* */ }
  }

  async function handleMerchAction(id: string, action: "approve" | "reject") {
    const notes = action === "reject" ? prompt("Rejection reason (optional):") || "" : "";
    if (action === "approve" && !confirm("Approve this receipt and create a Printful order?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/redeem?pw=${encodeURIComponent(password)}&id=${id}&action=${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, notes }),
      });
      if (res.ok) {
        await fetchMerchRedemptions();
      } else {
        const data = await res.json();
        setError(data.error || `${action} failed.`);
      }
    } catch {
      setError(`${action} failed.`);
    }
    setLoading(false);
  }

  const filteredMerch = merchRedemptions.filter((r) =>
    merchTab === "all" ? true : r.status === merchTab
  );

  /* LOGIN SCREEN */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.purple }}>
        <div className="max-w-sm w-full px-6">
          <h1 className="font-display text-3xl text-white text-center mb-6 tracking-wide">ADMIN DASHBOARD</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Password"
            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 mb-4"
          />
          {error && <p className="text-sm text-center mb-3" style={{ color: C.coral }}>{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="w-full h-12 rounded-lg font-bold transition-all hover:scale-[1.02]"
            style={{ background: C.green, color: C.navy }}
          >
            {loading ? "..." : "LOGIN"}
          </button>
        </div>
      </div>
    );
  }

  /* DASHBOARD */
  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${C.purple}, ${C.navy})` }}>
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-white tracking-wide">PADDY&apos;S HOMECOMING — ADMIN</h1>
          <div className="flex gap-3">
            <button onClick={refreshStats} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: C.green, color: C.navy }}>
              Refresh
            </button>
            <button onClick={downloadCSV} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: C.yellow, color: C.navy }}>
              Export CSV
            </button>
          </div>
        </div>

        {stats && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Direct Entries", value: stats.totalDirectEntries, color: C.green },
                { label: "Referral Bonuses", value: stats.totalReferralBonuses, color: C.yellow },
                { label: "UGC Bonuses", value: stats.totalUGCBonuses, color: C.coral },
                { label: "Total in Draw", value: stats.totalDrawEntries, color: "white" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{kpi.label}</p>
                  <p className="font-display text-3xl" style={{ color: kpi.color }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* By State */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.06)" }}>
                <h2 className="font-display text-xl text-white mb-4 tracking-wide">BY STATE</h2>
                {stats.byState.length === 0 ? (
                  <p className="text-white/40 text-sm">No entries yet.</p>
                ) : (
                  <div className="space-y-2">
                    {stats.byState.map((s) => (
                      <div key={s.state} className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">{s.state}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 rounded-full" style={{ width: `${Math.max(20, (s.count / Math.max(...stats.byState.map((x) => x.count))) * 120)}px`, background: C.green }} />
                          <span className="text-white text-sm font-semibold w-8 text-right">{s.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* By Store (top 10) */}
              <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.06)" }}>
                <h2 className="font-display text-xl text-white mb-4 tracking-wide">TOP STORES</h2>
                {stats.byStore.length === 0 ? (
                  <p className="text-white/40 text-sm">No entries yet.</p>
                ) : (
                  <div className="space-y-2">
                    {stats.byStore.slice(0, 10).map((s, i) => (
                      <div key={s.store} className="flex justify-between items-center gap-2">
                        <span className="text-white/80 text-sm truncate flex-1">
                          <span className="text-white/40 mr-2">{i + 1}.</span>
                          {s.store}
                        </span>
                        <span className="text-white text-sm font-semibold shrink-0">{s.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Referral Leaderboard */}
            <div className="rounded-xl p-5 mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
              <h2 className="font-display text-xl text-white mb-4 tracking-wide">REFERRAL LEADERBOARD</h2>
              {stats.referralLeaderboard.length === 0 ? (
                <p className="text-white/40 text-sm">No referrals yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {stats.referralLeaderboard.map((r, i) => (
                    <div key={r.email} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: i === 0 ? `${C.yellow}15` : "transparent" }}>
                      <span className="font-display text-xl w-8" style={{ color: i === 0 ? C.yellow : "white" }}>#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{r.name}</p>
                        <p className="text-white/40 text-xs truncate">{r.email}</p>
                      </div>
                      <span className="font-display text-xl" style={{ color: C.green }}>{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Merch Redemptions */}
            <div className="rounded-xl p-5 mb-8" style={{ background: "rgba(255,255,255,0.06)", border: `2px solid ${C.yellow}40` }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-white tracking-wide">MERCH REDEMPTIONS</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: C.yellow + "20", color: C.yellow }}>
                    {merchRedemptions.filter((r) => r.status === "pending").length} pending
                  </span>
                  <button onClick={fetchMerchRedemptions} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                    Refresh
                  </button>
                </div>
              </div>

              {/* Tab filters */}
              <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
                {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMerchTab(tab)}
                    className="flex-1 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background: merchTab === tab ? C.navy : "transparent",
                      color: merchTab === tab ? "white" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {tab} ({tab === "all" ? merchRedemptions.length : merchRedemptions.filter((r) => r.status === tab).length})
                  </button>
                ))}
              </div>

              {/* Redemption list */}
              {filteredMerch.length === 0 ? (
                <p className="text-white/40 text-sm py-4 text-center">No {merchTab === "all" ? "" : merchTab} redemptions.</p>
              ) : (
                <div className="space-y-3">
                  {filteredMerch.map((r) => (
                    <div key={r.id} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white text-sm font-semibold">{r.firstName} {r.lastName}</p>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                              style={{
                                background:
                                  r.status === "pending" ? C.yellow + "20" :
                                  r.status === "approved" || r.status === "fulfilled" ? C.green + "20" :
                                  C.coral + "20",
                                color:
                                  r.status === "pending" ? C.yellow :
                                  r.status === "approved" || r.status === "fulfilled" ? C.green :
                                  C.coral,
                              }}
                            >
                              {r.status}
                            </span>
                          </div>
                          <p className="text-white/50 text-xs">{r.email}</p>
                          <p className="text-white/40 text-xs mt-1">
                            Store: {r.store} | Receipt: {r.receiptFilename}
                          </p>
                          <p className="text-white/40 text-xs">
                            Ship to: {r.shippingName}, {r.shippingAddress1}{r.shippingAddress2 ? `, ${r.shippingAddress2}` : ""}, {r.shippingCity}, {r.shippingState} {r.shippingZip}
                          </p>
                          {r.printfulOrderId && (
                            <p className="text-xs mt-1" style={{ color: C.green }}>
                              Printful Order #{r.printfulOrderId}
                            </p>
                          )}
                          {r.adminNotes && (
                            <p className="text-white/30 text-xs mt-1 italic">{r.adminNotes}</p>
                          )}
                          <p className="text-white/20 text-[10px] mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                        </div>

                        {r.status === "pending" && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleMerchAction(r.id, "approve")}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-30"
                              style={{ background: C.green, color: "white" }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleMerchAction(r.id, "reject")}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-30"
                              style={{ background: C.coral, color: "white" }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Draw section */}
            <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.06)", border: `2px solid ${C.coral}40` }}>
              <h2 className="font-display text-xl text-white mb-3 tracking-wide">DRAW ENGINE</h2>
              <p className="text-white/60 text-sm mb-4">
                Uses cryptographic randomness (Web Crypto API). Full audit trail generated.
                {stats.totalDrawEntries > 0 && ` ${stats.totalDrawEntries} entries in pool.`}
              </p>
              {drawResult ? (
                <div className="rounded-lg p-5 mb-4" style={{ background: `${C.green}15`, border: `1px solid ${C.green}40` }}>
                  <p className="font-display text-2xl text-white mb-2">WINNER: {drawResult.winner.name}</p>
                  <p className="text-white/70 text-sm">{drawResult.winner.email}</p>
                  <p className="text-white/70 text-sm">Store: {drawResult.winner.store}</p>
                  <p className="text-white/70 text-sm">Entry type: {drawResult.winner.entryType}</p>
                  <p className="text-white/70 text-sm">Draw time: {new Date(drawResult.drawTimestamp).toLocaleString()}</p>
                  <details className="mt-3">
                    <summary className="text-white/50 text-xs cursor-pointer hover:text-white/70">Audit Log</summary>
                    <pre className="text-white/40 text-xs mt-2 whitespace-pre-wrap">{drawResult.auditLog}</pre>
                  </details>
                </div>
              ) : null}
              <button
                onClick={runDraw}
                disabled={loading || stats.totalDrawEntries === 0}
                className="px-6 py-3 rounded-lg font-bold transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: C.coral, color: "white" }}
              >
                {loading ? "DRAWING..." : "EXECUTE DRAW"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
