"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { STORES, CORE_STATES, OTHER_STATES, ALL_STATES } from "../data/stores";

/* ── colour tokens ── */
const C = {
  purple: "#352F63",
  green: "#8BCDA1",
  coral: "#E9847E",
  yellow: "#FCBC12",
  navy: "#343F49",
  midPurple: "#6464AF",
  light: "#F3F3F3",
  orange: "#F7911E",
};

/* ── pigeon SVG (simplified) ── */
function PigeonIcon({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="36" rx="18" ry="14" fill={C.green} opacity="0.9" />
      <circle cx="24" cy="28" r="10" fill="white" />
      <circle cx="24" cy="28" r="8" fill={C.navy} />
      <circle cx="22" cy="26" r="2" fill="white" />
      <path d="M34 28 L48 22 L46 28 L48 26 Z" fill={C.yellow} />
      <path d="M14 40 Q6 52 18 50 Q10 48 14 40Z" fill={C.coral} />
      <path d="M42 40 Q48 52 38 50 Q44 48 42 40Z" fill={C.coral} />
      <ellipse cx="26" cy="50" rx="3" ry="4" fill={C.orange} />
      <ellipse cx="38" cy="50" rx="3" ry="4" fill={C.orange} />
    </svg>
  );
}

/* ── cloud decorations ── */
function CloudBG() {
  return (
    <div className="cloud-drift absolute inset-0 overflow-hidden pointer-events-none opacity-10" aria-hidden>
      <div className="absolute top-[10%] left-[5%] w-40 h-16 bg-white rounded-full blur-2xl" />
      <div className="absolute top-[20%] right-[10%] w-56 h-20 bg-white rounded-full blur-3xl" />
      <div className="absolute top-[60%] left-[15%] w-48 h-14 bg-white rounded-full blur-2xl" />
      <div className="absolute top-[75%] right-[20%] w-36 h-12 bg-white rounded-full blur-xl" />
    </div>
  );
}

/* ── grain overlay ── */
function Grain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

/* ====================================================================
   MAIN PAGE COMPONENT
   ==================================================================== */
export default function Home() {
  const [stage, setStage] = useState<"age" | "form" | "confirmed">("age");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [ageError, setAgeError] = useState("");

  /* entry form state */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [store, setStore] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  /* referral */
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  /* UGC */
  const [ugcFile, setUgcFile] = useState<File | null>(null);
  const [ugcUploaded, setUgcUploaded] = useState(false);
  const [ugcConsent, setUgcConsent] = useState(false);

  const storeRef = useRef<HTMLDivElement>(null);

  /* more-states dropdown */
  const [showMoreStates, setShowMoreStates] = useState(false);
  const moreStatesRef = useRef<HTMLDivElement>(null);

  /* filtered stores — state-first: filter by selected state, then by search text */
  const filteredStores = useMemo(() => {
    let result = STORES;
    if (selectedState) {
      result = result.filter((s) => s.s === selectedState);
    }
    if (storeSearch) {
      const q = storeSearch.toLowerCase();
      result = result.filter(
        (s) => s.n.toLowerCase().includes(q) || s.c.toLowerCase().includes(q)
      );
    }
    return result.slice(0, 50); // cap dropdown at 50 for performance
  }, [selectedState, storeSearch]);

  /* close dropdowns on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) {
        setShowStoreDropdown(false);
      }
      if (moreStatesRef.current && !moreStatesRef.current.contains(e.target as Node)) {
        setShowMoreStates(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ─── AGE CHECK ─── */
  function checkAge() {
    setAgeError("");
    const m = parseInt(dobMonth);
    const d = parseInt(dobDay);
    const y = parseInt(dobYear);
    if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2026) {
      setAgeError("Please enter a valid date of birth.");
      return;
    }
    const dob = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 21) {
      setAgeError("You must be 21 or older to enter. Come back when you're older!");
      return;
    }
    setStage("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ─── SUBMIT ENTRY ─── */
  async function submitEntry(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !zip.trim() || !selectedState || !store) {
      setFormError("Please fill in all fields and select your state.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          zip: zip.trim(),
          store,
          state: selectedState || "Other",
          dob: `${dobYear}-${dobMonth.padStart(2, "0")}-${dobDay.padStart(2, "0")}`,
          referredBy: new URLSearchParams(window.location.search).get("ref") || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setReferralCode(data.referralCode || "");
      setStage("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("Network error. Please try again.");
    }
    setSubmitting(false);
  }

  /* ─── UGC UPLOAD ─── */
  async function handleUGCUpload() {
    if (!ugcFile || !ugcConsent) return;
    const formData = new FormData();
    formData.append("file", ugcFile);
    formData.append("email", email);
    formData.append("referralCode", referralCode);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) setUgcUploaded(true);
    } catch {
      /* silently fail for now */
    }
  }

  /* ─── COPY REFERRAL ─── */
  function copyReferral() {
    const url = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ====================================================================
     RENDER: AGE GATE
     ==================================================================== */
  if (stage === "age") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.purple} 0%, #1a1645 50%, ${C.navy} 100%)` }}>
        <CloudBG />
        <Grain />
        <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-md w-full">
          <PigeonIcon size={72} className="fly-in" />
          <h1 className="font-display text-5xl sm:text-6xl text-white text-center tracking-wide leading-tight">
            PADDY&apos;S<br />HOMECOMING
          </h1>
          <p className="text-lg sm:text-xl text-center" style={{ color: C.green }}>
            Win 2 Return Flights to Ireland
          </p>
          <div className="w-full rounded-2xl p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
            <p className="text-white text-center mb-4 text-sm">Please enter your date of birth to continue</p>
            <div className="flex gap-3 justify-center mb-4">
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM"
                maxLength={2}
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value.replace(/\D/g, ""))}
                className="w-16 h-14 text-center text-lg rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2"
                style={{ focusRingColor: C.yellow } as React.CSSProperties}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="DD"
                maxLength={2}
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value.replace(/\D/g, ""))}
                className="w-16 h-14 text-center text-lg rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="YYYY"
                maxLength={4}
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value.replace(/\D/g, ""))}
                className="w-24 h-14 text-center text-lg rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2"
              />
            </div>
            {ageError && <p className="text-center text-sm mb-3" style={{ color: C.coral }}>{ageError}</p>}
            <button
              onClick={checkAge}
              className="w-full h-14 rounded-xl font-bold text-lg tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${C.green}, ${C.green}cc)`, color: C.navy }}
            >
              ENTER
            </button>
          </div>
          <p className="text-xs text-center text-white/40 max-w-xs">
            Must be 21 or older. By entering, you confirm you meet the age requirement.
          </p>
        </div>
      </div>
    );
  }

  /* ====================================================================
     RENDER: ENTRY FORM
     ==================================================================== */
  if (stage === "form") {
    return (
      <div className="relative min-h-screen" style={{ background: `linear-gradient(180deg, ${C.purple} 0%, #1a1645 40%, ${C.navy} 100%)` }}>
        <CloudBG />
        <Grain />
        <div className="relative z-10 max-w-lg mx-auto px-5 py-12 sm:py-20">
          {/* Hero */}
          <div className="text-center mb-10">
            <PigeonIcon size={56} className="mx-auto mb-4 float-anim" />
            <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide leading-tight mb-3">
              FOLLOW PADDY HOME
            </h1>
            <p className="text-lg" style={{ color: C.green }}>
              Enter for a chance to win 2 return flights to Ireland
            </p>
            <p className="text-white/50 text-sm mt-2">
              Courtesy of Flying Tumbler Irish Whiskey
            </p>
          </div>

          {/* Form card */}
          <form onSubmit={submitEntry} className="rounded-2xl p-6 sm:p-8 space-y-5" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
            {/* Name fields — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 text-sm mb-1.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": C.green } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": C.green } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": C.green } as React.CSSProperties}
              />
            </div>

            {/* Zip */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Zip Code</label>
              <input
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                placeholder="02101"
                maxLength={5}
                className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": C.green } as React.CSSProperties}
              />
            </div>

            {/* State selector — step 1 */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">What state are you in?</label>
              <div className="flex flex-wrap gap-2">
                {CORE_STATES.map((s) => (
                  <button
                    type="button"
                    key={s.code}
                    onClick={() => {
                      setSelectedState(s.code);
                      setStore("");
                      setStoreSearch("");
                      setShowMoreStates(false);
                    }}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: selectedState === s.code ? C.green : "rgba(255,255,255,0.08)",
                      color: selectedState === s.code ? C.navy : "rgba(255,255,255,0.6)",
                      border: selectedState === s.code ? `2px solid ${C.green}` : "2px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {s.code}
                  </button>
                ))}
                {/* More states dropdown */}
                <div ref={moreStatesRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoreStates(!showMoreStates)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: OTHER_STATES.some(s => s.code === selectedState) ? C.green : "rgba(255,255,255,0.08)",
                      color: OTHER_STATES.some(s => s.code === selectedState) ? C.navy : "rgba(255,255,255,0.6)",
                      border: OTHER_STATES.some(s => s.code === selectedState) ? `2px solid ${C.green}` : "2px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {OTHER_STATES.some(s => s.code === selectedState)
                      ? ALL_STATES.find(s => s.code === selectedState)?.code
                      : "More ▾"}
                  </button>
                  {showMoreStates && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto rounded-lg border border-white/20 shadow-xl" style={{ background: C.purple }}>
                      {OTHER_STATES.map((s) => (
                        <button
                          type="button"
                          key={s.code}
                          onClick={() => {
                            setSelectedState(s.code);
                            setStore("");
                            setStoreSearch("");
                            setShowMoreStates(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                          style={selectedState === s.code ? { background: C.green + "30", color: C.green } : {}}
                        >
                          {s.name} ({s.code})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Store selector — step 2 (shows after state is picked) */}
            {selectedState && (
              <div ref={storeRef} className="relative">
                <label className="block text-white/70 text-sm mb-1.5">Where did you spot Paddy?</label>
                <input
                  type="text"
                  value={store || storeSearch}
                  onChange={(e) => {
                    setStore("");
                    setStoreSearch(e.target.value);
                    setShowStoreDropdown(true);
                  }}
                  onFocus={() => setShowStoreDropdown(true)}
                  placeholder={`Search stores in ${ALL_STATES.find(s => s.code === selectedState)?.name || selectedState}...`}
                  className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": C.green } as React.CSSProperties}
                />
                {showStoreDropdown && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/20 shadow-xl" style={{ background: C.purple }}>
                    {filteredStores.length > 0 ? (
                      filteredStores.map((s, idx) => (
                        <button
                          type="button"
                          key={`${s.n}-${s.c}-${idx}`}
                          onClick={() => {
                            setStore(`${s.n} — ${s.c}`);
                            setStoreSearch("");
                            setShowStoreDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors flex justify-between items-center"
                        >
                          <span className="truncate mr-2">{s.n} <span className="text-white/40">— {s.c}</span></span>
                          <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: C.green + "30", color: C.green }}>{s.s}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-white/40">No stores found — try a different search</div>
                    )}
                    {filteredStores.length === 50 && (
                      <div className="px-4 py-2 text-xs text-white/30 border-t border-white/10">Type to narrow results...</div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setStore(storeSearch || `Other — ${selectedState}`);
                        setShowStoreDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors border-t border-white/10"
                      style={{ color: C.yellow }}
                    >
                      Other / Not listed
                    </button>
                  </div>
                )}
              </div>
            )}

            {formError && <p className="text-sm text-center" style={{ color: C.coral }}>{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-xl font-bold text-lg tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${C.yellow}, ${C.orange})`, color: C.navy }}
            >
              {submitting ? "ENTERING..." : "SEND ME HOME!"}
            </button>

            <p className="text-xs text-center text-white/30">
              NO PURCHASE NECESSARY. Must be 21+. Ends 12/31/2026. See{" "}
              <a href="#rules" className="underline">official rules</a>. Void where prohibited.
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* ====================================================================
     RENDER: CONFIRMATION
     ==================================================================== */
  return (
    <div className="relative min-h-screen" style={{ background: `linear-gradient(180deg, ${C.purple} 0%, #1a1645 40%, ${C.navy} 100%)` }}>
      <CloudBG />
      <Grain />
      <div className="relative z-10 max-w-lg mx-auto px-5 py-12 sm:py-20">
        {/* Confirmation hero */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <PigeonIcon size={64} className="mx-auto fly-in" />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: C.yellow, color: C.navy }}>
              &#10003;
            </div>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide mt-5 mb-3">
            YOU&apos;RE IN THE DRAW!
          </h1>
          <p className="text-lg" style={{ color: C.green }}>
            Nice one, {firstName}. Paddy&apos;s saving you a window seat.
          </p>
        </div>

        {/* Referral card */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
          <h2 className="font-display text-2xl text-white mb-2 tracking-wide">TELL A MATE</h2>
          <p className="text-white/60 text-sm mb-4">
            Share your link. When a friend enters, you both get a bonus entry into the draw.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm flex items-center overflow-hidden">
              <span className="truncate">{typeof window !== "undefined" ? `${window.location.origin}?ref=${referralCode}` : ""}</span>
            </div>
            <button
              onClick={copyReferral}
              className="h-12 px-5 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              style={{ background: C.yellow, color: C.navy }}
            >
              {copied ? "COPIED!" : "COPY"}
            </button>
          </div>
        </div>

        {/* UGC card */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
          <h2 className="font-display text-2xl text-white mb-2 tracking-wide">SNAP THE BIRD IN THE WILD</h2>
          <p className="text-white/60 text-sm mb-4">
            Spot The Bird at a bar, on a shelf, or in your glass? Upload a photo for an extra bonus entry.
          </p>
          {ugcUploaded ? (
            <div className="text-center py-4">
              <p className="text-lg font-semibold" style={{ color: C.green }}>Photo uploaded! Bonus entry earned.</p>
            </div>
          ) : (
            <>
              <label className="block w-full h-32 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setUgcFile(e.target.files?.[0] || null)}
                />
                <div className="flex flex-col items-center justify-center h-full">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-white/50 text-sm mt-1">
                    {ugcFile ? ugcFile.name : "Tap to upload a photo"}
                  </span>
                </div>
              </label>
              <label className="flex items-start gap-2 text-white/60 text-xs mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ugcConsent}
                  onChange={(e) => setUgcConsent(e.target.checked)}
                  className="mt-0.5 accent-current"
                  style={{ accentColor: C.green }}
                />
                <span>I grant Flying Tumbler permission to use this image in marketing materials.</span>
              </label>
              <button
                onClick={handleUGCUpload}
                disabled={!ugcFile || !ugcConsent}
                className="w-full h-11 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: C.coral, color: "white" }}
              >
                UPLOAD FOR BONUS ENTRY
              </button>
            </>
          )}
        </div>

        {/* Brand content: Cocktail recipes */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
          <h2 className="font-display text-2xl text-white mb-4 tracking-wide">WHILE YOU WAIT...</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Recipe 1 */}
            <div className="rounded-xl p-4" style={{ background: "rgba(139,205,161,0.1)", border: `1px solid ${C.green}30` }}>
              <h3 className="font-display text-xl text-white mb-2">IRISH OLD FASHIONED</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>50ml The Bird Irish Whiskey</li>
                <li>10ml Demerara syrup</li>
                <li>2 dashes Angostura bitters</li>
                <li>Orange peel</li>
              </ul>
              <p className="text-xs mt-3" style={{ color: C.green }}>Stir over ice. Strain. Express orange peel. Sip slowly.</p>
            </div>
            {/* Recipe 2 */}
            <div className="rounded-xl p-4" style={{ background: "rgba(233,132,126,0.1)", border: `1px solid ${C.coral}30` }}>
              <h3 className="font-display text-xl text-white mb-2">PADDY&apos;S PUNCH</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>50ml The Bird Irish Whiskey</li>
                <li>25ml Fresh lemon juice</li>
                <li>20ml Honey syrup</li>
                <li>Top with ginger beer</li>
              </ul>
              <p className="text-xs mt-3" style={{ color: C.coral }}>Build over ice. Stir gently. Garnish with lemon wheel.</p>
            </div>
          </div>
        </div>

        {/* About The Bird */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
          <h2 className="font-display text-2xl text-white mb-3 tracking-wide">MEET THE BIRD</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            The Bird is a Single Malt &amp; Grain Irish Whiskey, triple distilled and aged a minimum of 5 years in bourbon casks. Non-chill filtered, no added colour. Tasting notes of almond, white chocolate, vanilla, apple pie, citrus, and baking spices.
          </p>
          <p className="text-white/70 text-sm leading-relaxed mb-3">
            Created by brothers Patrick and Thomas Walsh from Carlow, Ireland. Inspired by the tumbler pigeon — known for aerial acrobatics and always finding its way home. Adventure in every bottle.
          </p>
          <div className="flex gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: C.green + "20", color: C.green }}>43% ABV</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: C.yellow + "20", color: C.yellow }}>IWSC 91pts</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: C.coral + "20", color: C.coral }}>Silver 2025</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 space-y-3">
          <PigeonIcon size={32} className="mx-auto opacity-50" />
          <p className="text-white/30 text-xs">
            NO PURCHASE NECESSARY. Must be 21+. Open to legal US residents. Ends 12/31/2026.<br />
            See <a href="#rules" className="underline">Official Rules</a>. Void where prohibited.
          </p>
          <p className="text-white/30 text-xs">
            Alternative method of entry: Email paddyshomecoming@flyingtumbler.com with your full name, date of birth, email, and zip code. Subject line: &quot;Paddy&apos;s Homecoming Entry.&quot;
          </p>
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Flying Tumbler Irish Whiskey. Please drink responsibly.
          </p>
        </footer>
      </div>
    </div>
  );
}
