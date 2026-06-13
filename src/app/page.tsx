"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
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

/* ── Shared legal footer ── */
function LegalFooter() {
  return (
    <footer className="text-center py-10 px-6 space-y-3">
      <Image
        src="/assets/circle-coordinates.png"
        alt=""
        width={48}
        height={48}
        className="mx-auto opacity-30"
      />
      <p className="text-white/30 text-xs max-w-md mx-auto leading-relaxed">
        NO PURCHASE NECESSARY. Must be 21+. Open to legal US residents. Ends 12/31/2026.
        See <a href="/rules" className="underline hover:text-white/50 transition-colors">Official Rules</a>. Void where prohibited.
      </p>
      <p className="text-white/30 text-xs max-w-md mx-auto leading-relaxed">
        Alternative method of entry: Email paddyshomecoming@flyingtumbler.com with your full name, date of birth, email, and zip code. Subject line: &quot;Paddy&apos;s Homecoming Entry.&quot;
      </p>
      <p className="text-white/20 text-xs font-mono">
        &copy; {new Date().getFullYear()} Flying Tumbler Irish Whiskey. Please drink responsibly.
      </p>
    </footer>
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

  /* filtered stores */
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
    return result.slice(0, 50);
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

  /* ── AGE CHECK ── */
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

  /* ── SUBMIT ENTRY ── */
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

  /* ── UGC UPLOAD ── */
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
      /* silently fail */
    }
  }

  /* ── COPY REFERRAL ── */
  function copyReferral() {
    const url = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* helper: generate month/day/year options */
  const months = Array.from({ length: 12 }, (_, i) => {
    const names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return { value: String(i + 1), label: names[i] };
  });
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  /* ====================================================================
     RENDER: AGE GATE
     ==================================================================== */
  if (stage === "age") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: C.purple }}>
        {/* Grain texture */}
        <div className="grain-overlay absolute inset-0 pointer-events-none z-[1]" aria-hidden />

        {/* Decorative clouds */}
        <div className="cloud-drift absolute inset-0 pointer-events-none" aria-hidden>
          <Image src="/assets/cloud-iris-1.png" alt="" width={200} height={100} className="absolute top-[8%] left-[5%] opacity-20" />
          <Image src="/assets/cloud-sage-1.png" alt="" width={180} height={90} className="absolute top-[65%] right-[8%] opacity-15" />
          <Image src="/assets/cloud-gold-1.png" alt="" width={140} height={70} className="absolute bottom-[15%] left-[12%] opacity-10" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-md w-full">
          {/* Wordmark — stacked pigeon, white inverted */}
          <div className="fade-in">
            <Image
              src="/assets/wordmark-stacked-pigeon.png"
              alt="Flying Tumbler"
              width={180}
              height={120}
              className="mx-auto brightness-0 invert"
              priority
            />
          </div>

          {/* Paddy plane + cloud illustration */}
          <div className="relative w-64 h-36 mx-auto fade-in-delay-1">
            <Image
              src="/assets/cloud-sage-1.png"
              alt=""
              width={260}
              height={130}
              className="absolute inset-0 w-full"
            />
            <Image
              src="/assets/paddy-plane.png"
              alt="Paddy the Pigeon flying his plane"
              width={220}
              height={110}
              className="absolute top-2 left-3 w-[85%] plane-float"
            />
          </div>

          {/* Paddy's Homecoming label */}
          <div className="text-center fade-in-delay-2">
            <p className="text-sm font-bold tracking-[0.26em] uppercase mb-3" style={{ color: C.yellow }}>
              Paddy&apos;s Homecoming
            </p>
            <h1 className="font-display text-[34px] sm:text-[40px] font-extrabold text-white leading-tight">
              Are you 21 or over?
            </h1>
          </div>

          {/* DOB select dropdowns */}
          <div className="w-full space-y-3 fade-in-delay-3">
            <div className="flex gap-3">
              <select
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value)}
                className="dob-select flex-1 h-14 px-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:border-transparent text-[15px]"
                style={{ "--tw-ring-color": C.yellow } as React.CSSProperties}
              >
                <option value="" disabled className="text-gray-800">Month</option>
                {months.map(m => (
                  <option key={m.value} value={m.value} className="text-gray-800">{m.label}</option>
                ))}
              </select>
              <select
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value)}
                className="dob-select w-24 h-14 px-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:border-transparent text-[15px]"
                style={{ "--tw-ring-color": C.yellow } as React.CSSProperties}
              >
                <option value="" disabled className="text-gray-800">Day</option>
                {days.map(d => (
                  <option key={d} value={d} className="text-gray-800">{d}</option>
                ))}
              </select>
              <select
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value)}
                className="dob-select w-28 h-14 px-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:border-transparent text-[15px]"
                style={{ "--tw-ring-color": C.yellow } as React.CSSProperties}
              >
                <option value="" disabled className="text-gray-800">Year</option>
                {years.map(y => (
                  <option key={y} value={y} className="text-gray-800">{y}</option>
                ))}
              </select>
            </div>

            {ageError && (
              <p className="text-center text-sm font-medium" style={{ color: C.coral }}>
                {ageError}
              </p>
            )}

            <button
              onClick={checkAge}
              className="w-full h-14 rounded-xl font-bold text-[16px] tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] glow-pulse"
              style={{ background: C.green, color: C.navy }}
            >
              Let me in
            </button>
          </div>

          {/* Legal micro text */}
          <p className="text-[11px] text-center text-white/35 max-w-xs leading-relaxed">
            Must be 21 or older to enter. By continuing, you confirm you meet the age requirement.
          </p>
        </div>

        <LegalFooter />
      </div>
    );
  }

  /* ====================================================================
     RENDER: ENTRY FORM
     ==================================================================== */
  if (stage === "form") {
    return (
      <div className="relative min-h-screen" style={{ background: C.purple }}>
        {/* Grain */}
        <div className="grain-overlay absolute inset-0 pointer-events-none z-[1]" aria-hidden />

        {/* Header bar */}
        <header className="relative z-10 flex items-center justify-center py-4 px-6">
          <Image
            src="/assets/wordmark-horizontal-pigeon.png"
            alt="Flying Tumbler"
            width={200}
            height={40}
            className="brightness-0 invert h-8 w-auto"
          />
        </header>

        {/* Decorative clouds */}
        <div className="cloud-drift absolute top-0 inset-x-0 pointer-events-none z-0" aria-hidden>
          <Image src="/assets/cloud-iris-1.png" alt="" width={180} height={90} className="absolute top-16 left-[3%] opacity-20" />
          <Image src="/assets/cloud-gold-1.png" alt="" width={120} height={60} className="absolute top-32 right-[8%] opacity-15" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-5 pb-12">
          {/* Hero section */}
          <div className="text-center pt-4 pb-8">
            {/* Paddy plane illustration */}
            <div className="relative w-56 h-32 mx-auto mb-4">
              <Image
                src="/assets/cloud-sage-1.png"
                alt=""
                width={230}
                height={120}
                className="absolute inset-0 w-full"
              />
              <Image
                src="/assets/paddy-plane.png"
                alt="Paddy the Pigeon"
                width={200}
                height={100}
                className="absolute top-2 left-2 w-[82%] plane-float"
              />
            </div>

            <p className="text-sm font-bold tracking-[0.26em] uppercase mb-2" style={{ color: C.yellow }}>
              Paddy&apos;s Homecoming
            </p>
            <h1 className="font-display text-[42px] sm:text-[48px] font-extrabold text-white leading-[0.95] tracking-[0.01em] uppercase">
              Win 2 flights<br />to Ireland
            </h1>
            <p className="text-white/50 text-sm mt-3">
              Courtesy of Flying Tumbler Irish Whiskey
            </p>
          </div>

          {/* ── White form card ── */}
          <form
            onSubmit={submitEntry}
            className="rounded-2xl p-6 sm:p-8 space-y-5 fade-in"
            style={{ background: "#FFFFFF", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
          >
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="form-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="form-input"
              />
            </div>

            {/* DOB (readonly, carried from age gate) */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>Date of Birth</label>
              <input
                type="text"
                readOnly
                value={dobMonth && dobDay && dobYear ? `${months[parseInt(dobMonth) - 1]?.label || dobMonth} ${dobDay}, ${dobYear}` : ""}
                className="form-input bg-gray-50 cursor-not-allowed"
                style={{ color: "#888" }}
              />
            </div>

            {/* Zip */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>Zip Code</label>
              <input
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                placeholder="02101"
                maxLength={5}
                className="form-input"
              />
            </div>

            {/* State selector */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>What state are you in?</label>
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
                      background: selectedState === s.code ? C.green : C.light,
                      color: selectedState === s.code ? "white" : C.navy,
                      border: selectedState === s.code ? `2px solid ${C.green}` : `2px solid #E0E0E0`,
                    }}
                  >
                    {s.code}
                  </button>
                ))}
                <div ref={moreStatesRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoreStates(!showMoreStates)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: OTHER_STATES.some(s => s.code === selectedState) ? C.green : C.light,
                      color: OTHER_STATES.some(s => s.code === selectedState) ? "white" : C.navy,
                      border: OTHER_STATES.some(s => s.code === selectedState) ? `2px solid ${C.green}` : `2px solid #E0E0E0`,
                    }}
                  >
                    {OTHER_STATES.some(s => s.code === selectedState)
                      ? ALL_STATES.find(s => s.code === selectedState)?.code
                      : "More ▾"}
                  </button>
                  {showMoreStates && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto rounded-lg border shadow-xl custom-scrollbar" style={{ background: "white", borderColor: "#E0E0E0" }}>
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
                          className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                          style={{
                            color: selectedState === s.code ? C.green : C.navy,
                            fontWeight: selectedState === s.code ? 600 : 400,
                          }}
                        >
                          {s.name} ({s.code})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Store selector */}
            {selectedState && (
              <div ref={storeRef} className="relative">
                <label className="block text-sm font-medium mb-1.5" style={{ color: C.navy }}>Where did you spot Paddy?</label>
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
                  className="form-input"
                />
                {showStoreDropdown && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border shadow-xl custom-scrollbar" style={{ background: "white", borderColor: "#E0E0E0" }}>
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
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex justify-between items-center"
                          style={{ color: C.navy }}
                        >
                          <span className="truncate mr-2">{s.n} <span className="text-gray-400">— {s.c}</span></span>
                          <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold" style={{ background: C.green + "20", color: C.green }}>{s.s}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-400">No stores found — try a different search</div>
                    )}
                    {filteredStores.length === 50 && (
                      <div className="px-4 py-2 text-xs text-gray-300 border-t border-gray-100">Type to narrow results...</div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setStore(storeSearch || `Other — ${selectedState}`);
                        setShowStoreDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-t border-gray-100 font-medium"
                      style={{ color: C.yellow }}
                    >
                      Other / Not listed
                    </button>
                  </div>
                )}
              </div>
            )}

            {formError && <p className="text-sm text-center font-medium" style={{ color: C.coral }}>{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-xl font-bold text-[16px] tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: C.green, color: "white" }}
            >
              {submitting ? "Entering..." : "Enter to win"}
            </button>

            <p className="text-xs text-center text-gray-400 leading-relaxed">
              NO PURCHASE NECESSARY. Must be 21+. Ends 12/31/2026. See{" "}
              <a href="/rules" className="underline">official rules</a>. Void where prohibited.
            </p>
          </form>

          {/* ── How It Works section ── */}
          <div className="mt-10 rounded-2xl p-6 sm:p-8" style={{ background: C.light }}>
            <h2 className="font-display text-2xl font-bold text-center mb-6" style={{ color: C.navy }}>
              How it works
            </h2>
            <div className="space-y-5">
              {[
                { step: "1", title: "Find The Bird", desc: "Spot Flying Tumbler at your local store, bar, or restaurant." },
                { step: "2", title: "Scan & Enter", desc: "Scan the QR code on the POS material, or visit this page directly." },
                { step: "3", title: "Follow Paddy Home", desc: "You're in the draw for 2 return flights to Ireland." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: C.coral }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold" style={{ color: C.navy }}>{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Our Story section ── */}
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <div className="relative w-full h-48">
              <Image
                src="/assets/about-us-farm-blackstairs.jpg"
                alt="The Blackstairs Mountains, Carlow, Ireland"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="font-display text-2xl font-bold mb-3" style={{ color: C.navy }}>Our story</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Created by brothers Patrick and Thomas Walsh from Carlow, Ireland. The Bird is a Single Malt &amp; Grain Irish Whiskey, triple distilled and aged a minimum of 5 years in bourbon casks. Non-chill filtered, no added colour.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Inspired by the tumbler pigeon — known for its aerial acrobatics and always finding its way home. Adventure in every bottle.
              </p>
            </div>
          </div>

          {/* ── Bottle section ── */}
          <div className="mt-8 flex items-center gap-6 px-4">
            <div className="flex-shrink-0 w-20">
              <Image
                src="/assets/bird-front.png"
                alt="The Bird Irish Whiskey"
                width={80}
                height={240}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-1">The Bird</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Single Malt &amp; Grain Irish Whiskey. 43% ABV. Tasting notes of almond, white chocolate, vanilla, apple pie, and citrus.
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: C.green + "25", color: C.green }}>43% ABV</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: C.yellow + "25", color: C.yellow }}>IWSC 91pts</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: C.coral + "25", color: C.coral }}>Silver 2025</span>
              </div>
            </div>
          </div>

          <LegalFooter />
        </div>
      </div>
    );
  }

  /* ====================================================================
     RENDER: CONFIRMATION
     ==================================================================== */
  return (
    <div className="relative min-h-screen" style={{ background: C.purple }}>
      {/* Grain */}
      <div className="grain-overlay absolute inset-0 pointer-events-none z-[1]" aria-hidden />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center py-4 px-6">
        <Image
          src="/assets/wordmark-horizontal-pigeon.png"
          alt="Flying Tumbler"
          width={200}
          height={40}
          className="brightness-0 invert h-8 w-auto"
        />
      </header>

      {/* Decorative clouds */}
      <div className="cloud-drift absolute top-0 inset-x-0 pointer-events-none z-0" aria-hidden>
        <Image src="/assets/cloud-iris-1.png" alt="" width={160} height={80} className="absolute top-20 right-[5%] opacity-15" />
        <Image src="/assets/cloud-gold-1.png" alt="" width={130} height={65} className="absolute top-40 left-[6%] opacity-10" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-5 pb-12">
        {/* Confirmation hero */}
        <div className="text-center pt-6 pb-8 fade-in">
          {/* Yellow badge */}
          <div
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase mb-4"
            style={{ background: C.yellow, color: C.navy }}
          >
            Entry confirmed
          </div>
          <h1 className="font-display text-[36px] sm:text-[42px] font-extrabold text-white leading-tight">
            You&apos;re in, {firstName}!
          </h1>
          <p className="text-white/60 text-sm mt-3 max-w-xs mx-auto">
            Paddy&apos;s saving you a window seat. We&apos;ll be in touch if you&apos;re our lucky winner.
          </p>
        </div>

        {/* ── Referral card ── */}
        <div
          className="rounded-2xl p-6 mb-5 fade-in-delay-1"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
        >
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: C.navy }}>
            Share for bonus entries
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Share your link with friends. When a friend enters, you both get a bonus entry.
          </p>
          {/* Copy link */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 h-12 px-4 rounded-lg border border-gray-200 text-sm flex items-center overflow-hidden font-mono" style={{ background: C.light, color: C.navy }}>
              <span className="truncate">{typeof window !== "undefined" ? `${window.location.origin}?ref=${referralCode}` : ""}</span>
            </div>
            <button
              onClick={copyReferral}
              className="h-12 px-5 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              style={{ background: C.green, color: "white" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {/* Share buttons */}
          <div className="flex gap-3">
            <a
              href={typeof window !== "undefined" ? `sms:?body=I just entered Paddy's Homecoming to win 2 flights to Ireland! Enter here: ${window.location.origin}?ref=${referralCode}` : "#"}
              className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: C.light, color: C.navy }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              SMS
            </a>
            <a
              href={typeof window !== "undefined" ? `https://wa.me/?text=I just entered Paddy's Homecoming to win 2 flights to Ireland! Enter here: ${encodeURIComponent(window.location.origin + "?ref=" + referralCode)}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: "#25D366", color: "white" }}
            >
              WhatsApp
            </a>
            <a
              href={typeof window !== "undefined" ? `mailto:?subject=Win 2 flights to Ireland!&body=I just entered Paddy's Homecoming from Flying Tumbler. Enter here: ${window.location.origin}?ref=${referralCode}` : "#"}
              className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: C.purple, color: "white" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </a>
          </div>
        </div>

        {/* ── UGC Photo Upload card ── */}
        <div
          className="rounded-2xl p-6 mb-5 fade-in-delay-2"
          style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
        >
          <h2 className="font-display text-xl font-bold mb-1" style={{ color: C.navy }}>
            Snap The Bird in the wild
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Spot The Bird at a bar, on a shelf, or in your glass? Upload a photo for a bonus entry.
          </p>
          {ugcUploaded ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: C.green + "20" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-lg font-semibold" style={{ color: C.green }}>Photo uploaded! Bonus entry earned.</p>
            </div>
          ) : (
            <>
              <label
                className="block w-full rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-gray-300 mb-3"
                style={{ borderColor: ugcFile ? C.yellow : "#E0E0E0", background: ugcFile ? C.yellow + "08" : "transparent" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setUgcFile(e.target.files?.[0] || null)}
                />
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ugcFile ? C.yellow : "#CCC"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm" style={{ color: ugcFile ? C.navy : "#AAA" }}>
                    {ugcFile ? ugcFile.name : "Tap to upload a photo"}
                  </span>
                </div>
              </label>
              <label className="flex items-start gap-2 text-xs text-gray-500 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ugcConsent}
                  onChange={(e) => setUgcConsent(e.target.checked)}
                  className="mt-0.5"
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
                Upload for bonus entry
              </button>
            </>
          )}
        </div>

        {/* ── Brand content cards ── */}
        <div className="fade-in-delay-3 space-y-5">
          {/* Cocktail recipe card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <div className="relative w-full h-40">
              <Image
                src="/assets/flying-highball.jpg"
                alt="Flying Tumbler cocktail"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold mb-2" style={{ color: C.navy }}>Try a cocktail recipe</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg p-3" style={{ background: C.green + "10" }}>
                  <h4 className="font-bold text-sm mb-1" style={{ color: C.navy }}>Irish Old Fashioned</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">50ml The Bird, 10ml Demerara syrup, 2 dashes Angostura, orange peel. Stir, strain, sip.</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: C.coral + "10" }}>
                  <h4 className="font-bold text-sm mb-1" style={{ color: C.navy }}>Paddy&apos;s Punch</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">50ml The Bird, 25ml lemon, 20ml honey syrup, ginger beer. Build over ice. Garnish.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Find The Bird card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <div className="relative w-full h-40">
              <Image
                src="/assets/bottle-glass-forest-leaves.jpg"
                alt="The Bird in the wild"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold mb-1" style={{ color: C.navy }}>Find The Bird</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ask for The Bird at your local bar or look for it on the shelf at your favourite store. Adventure in every bottle.
              </p>
            </div>
          </div>
        </div>

        <LegalFooter />
      </div>
    </div>
  );
}
