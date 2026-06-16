"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { STORES, CORE_STATES, OTHER_STATES, ALL_STATES } from "../data/stores";

/* ── colour tokens ── */
const C = {
  deepDark: "#1A1838",
  frameDark: "#2A2740",
  purple: "#352F63",
  green: "#8BCDA1",
  greenDark: "#14331f",
  coral: "#E9847E",
  yellow: "#FCBC12",
  navy: "#343F49",
  warmPaper: "#F4EFE3",
  warmBorder: "#D8D2C4",
  warmBorderLight: "#E7E0D0",
  gold: "#C68A2E",
  midPurple: "#6E6886",
  light: "#F3F3F3",
};

/* ── prize editorial cards ── */
const PRIZE_CARDS = [
  {
    num: "01", label: "The farm", title: "Larch Grove farmhouse",
    desc: "Two nights at the family farm where Flying Tumbler was born. Stone walls, a turf fire, and the quiet of Carlow under the Blackstairs.",
    img: "/assets/farmhouse-exterior.jpg", alt: "Larch Grove farmhouse", pos: "50% 64%",
  },
  {
    num: "02", label: "The tasting", title: "Straight from the bond",
    desc: "An immersive tasting in the bonded warehouse at Larch Grove — cask samples, the full story, and the brothers who make The Bird.",
    img: "/assets/casks-yard-full.jpg", alt: "A full yard of whiskey casks at the bond", pos: "55% 50%",
  },
  {
    num: "03", label: "The hotel", title: "A night at the Lord Bagenal",
    desc: "A four-star, family-run riverside inn on the River Barrow — just an hour south of Dublin. Award-winning food, a proper bed, and the kind of Carlow welcome you came all this way for.",
    img: "/assets/lord-bagenal.jpg", alt: "The Lord Bagenal Hotel on the river Barrow", pos: "50% 50%",
    extra: "★★★★ Leighlinbridge, Co. Carlow · 1 hr from Dublin",
  },
  {
    num: "04", label: "The countryside", title: "The view Paddy flies home to",
    desc: "The Blackstairs Mountains, stone walls and green hills. Rolling Carlow countryside — real Ireland, not the postcard kind.",
    img: "/assets/about-us-farm-blackstairs.jpg", alt: "The Blackstairs Mountains over Carlow", pos: "50% 40%",
  },
];

/* ── craic nearby items ── */
const CRAIC_ITEMS = [
  { img: "/assets/pub-oshea-borris.jpg", title: "M. O’Shea’s, Borris", desc: "A proper country pub" },
  { img: "/assets/pub-interior-bar.jpg", title: "Doyle’s, Graiguenamanagh", desc: "Pull up a stool" },
  { img: "/assets/mount-juliet.jpg", title: "Mount Juliet", desc: "A round in Kilkenny" },
  { img: "/assets/k-club.jpg", title: "The K Club", desc: "Or a championship links" },
  { img: "/assets/glendalough.jpg", title: "Glendalough", desc: "Wicklow’s glacial valley" },
  { img: "/assets/rock-of-cashel.jpg", title: "The Rock of Cashel", desc: "1,000 years of Tipperary" },
  { img: "/assets/kilkenny-castle.jpg", title: "Kilkenny Castle", desc: "Medieval Marble City" },
  { img: "/assets/dublin-hapenny.jpg", title: "Dublin", desc: "Fly in, fly out the Ha’penny" },
];

/* ── merch products ── */
const MERCH_PRODUCTS = [
  { key: "sticker4x4", name: "Sticker", img: "/assets/lifestyle/lifestyle-sticker.jpg" },
  { key: "canCooler", name: "Can Cooler", img: "/assets/lifestyle/lifestyle-cooler.jpg" },
  { key: "corkCoaster", name: "Coaster", img: "/assets/lifestyle/lifestyle-coaster.jpg" },
  { key: "holoSticker", name: "Holo Sticker", img: "/assets/lifestyle/lifestyle-holo.jpg" },
  { key: "stickerSheet", name: "Sticker Sheet", img: "/assets/lifestyle/lifestyle-sheet.jpg" },
  { key: "notepad", name: "Notepad", img: "/assets/lifestyle/lifestyle-notepad.jpg" },
];

/* ── helpers ── */
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => String(CURRENT_YEAR - i));

/* ====================================================================
   MAIN PAGE COMPONENT
   ==================================================================== */
export default function Home() {
  const [stage, setStage] = useState<"form" | "confirmed">("form");

  /* entry form state */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [zip, setZip] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [store, setStore] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  /* more-states dropdown */
  const [showMoreStates, setShowMoreStates] = useState(false);
  const moreStatesRef = useRef<HTMLDivElement>(null);

  /* referral */
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  /* UGC */
  const [ugcFile, setUgcFile] = useState<File | null>(null);
  const [ugcUploaded, setUgcUploaded] = useState(false);
  const [ugcConsent, setUgcConsent] = useState(false);

  /* Merch */
  const [merchStep, setMerchStep] = useState<"offer" | "form" | "submitted">("offer");
  const [selectedProduct, setSelectedProduct] = useState("canCooler");
  const [merchReceipt, setMerchReceipt] = useState<File | null>(null);
  const [merchShipName, setMerchShipName] = useState("");
  const [merchShipAddr1, setMerchShipAddr1] = useState("");
  const [merchShipAddr2, setMerchShipAddr2] = useState("");
  const [merchShipCity, setMerchShipCity] = useState("");
  const [merchShipState, setMerchShipState] = useState("");
  const [merchShipZip, setMerchShipZip] = useState("");
  const [merchSubmitting, setMerchSubmitting] = useState(false);
  const [merchError, setMerchError] = useState("");

  const storeRef = useRef<HTMLDivElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const selectedProductData = MERCH_PRODUCTS.find((p) => p.key === selectedProduct) || MERCH_PRODUCTS[1];

  /* filtered stores */
  const filteredStores = useMemo(() => {
    let result = STORES;
    if (selectedState) result = result.filter((s) => s.s === selectedState);
    if (storeSearch) {
      const q = storeSearch.toLowerCase();
      result = result.filter((s) => s.n.toLowerCase().includes(q) || s.c.toLowerCase().includes(q));
    }
    return result.slice(0, 50);
  }, [selectedState, storeSearch]);

  /* close dropdowns on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) setShowStoreDropdown(false);
      if (moreStatesRef.current && !moreStatesRef.current.contains(e.target as Node)) setShowMoreStates(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── SUBMIT ENTRY (includes 21+ check) ── */
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

    /* age check */
    const m = parseInt(dobMonth), d = parseInt(dobDay), y = parseInt(dobYear);
    if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > CURRENT_YEAR) {
      setFormError("Please enter a valid date of birth.");
      return;
    }
    const dob = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const mDiff = today.getMonth() - dob.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 21) {
      setFormError("You must be 21 or older to enter.");
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
      if (!res.ok) { setFormError(data.error || "Something went wrong."); setSubmitting(false); return; }
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
    } catch { /* silently fail */ }
  }

  /* ── COPY REFERRAL ── */
  function copyReferral() {
    const url = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ── MERCH SUBMIT ── */
  async function handleMerchSubmit() {
    setMerchError("");
    if (!merchReceipt || !merchShipName || !merchShipAddr1 || !merchShipCity || !merchShipState || !merchShipZip) {
      setMerchError("Please fill in all required fields and upload your receipt.");
      return;
    }
    setMerchSubmitting(true);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, firstName, lastName: "", store, state: selectedState,
          receiptFilename: merchReceipt.name,
          shippingName: merchShipName, shippingAddress1: merchShipAddr1,
          shippingAddress2: merchShipAddr2, shippingCity: merchShipCity,
          shippingState: merchShipState, shippingZip: merchShipZip,
          product: selectedProduct,
        }),
      });
      if (res.ok) { setMerchStep("submitted"); }
      else { const data = await res.json(); setMerchError(data.error || "Something went wrong."); }
    } catch { setMerchError("Network error. Please try again."); }
    finally { setMerchSubmitting(false); }
  }

  /* scroll to form (for closer CTA) */
  function scrollToForm() {
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  /* ====================================================================
     RENDER: CONFIRMATION
     ==================================================================== */
  if (stage === "confirmed") {
    return (
      <div className="min-h-screen" style={{ background: C.deepDark }}>
        {/* Header */}
        <header className="flex items-center justify-center py-5 px-6">
          <Image src="/assets/wordmark-white.png" alt="Flying Tumbler" width={140} height={58} className="h-12 w-auto" priority />
        </header>

        <div className="max-w-md lg:max-w-2xl mx-auto px-5 pb-12">
          {/* Hero */}
          <div className="text-center pt-2 pb-8 fade-in">
            <div className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase mb-4"
              style={{ background: C.yellow, color: C.navy }}>Entry confirmed</div>
            <h1 className="font-display text-[36px] sm:text-[42px] lg:text-[52px] font-extrabold text-white leading-tight">
              You&apos;re in, {firstName}!
            </h1>
            <p className="text-white/50 text-sm lg:text-base mt-3 max-w-xs lg:max-w-md mx-auto">
              Paddy&apos;s saving you a window seat. We&apos;ll be in touch if you&apos;re our lucky winner.
            </p>
          </div>

          {/* ── MERCH / GWP OFFER card ── */}
          <div className="rounded-2xl overflow-hidden mb-5 fade-in-delay-1" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)", border: `2px solid ${C.yellow}40` }}>
            <div className="px-5 py-2 flex items-center gap-2" style={{ background: C.navy }}>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: C.yellow, color: C.navy }}>Separate offer</span>
              <span className="text-white/50 text-[10px] tracking-wide uppercase">Gift with purchase</span>
            </div>
            <div className="p-5" style={{ background: "white" }}>
              {merchStep === "submitted" ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: C.green + "20" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h2 className="font-display text-xl font-bold mb-1" style={{ color: C.navy }}>Merch claimed!</h2>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">We&apos;ll review your receipt and ship your free Flying Tumbler merch. Check your email for updates.</p>
                </div>
              ) : merchStep === "form" ? (
                <>
                  <button onClick={() => setMerchStep("offer")} className="text-xs mb-3 flex items-center gap-1 transition-colors hover:opacity-70" style={{ color: C.purple }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Back
                  </button>
                  <h2 className="font-display text-lg font-bold mb-1" style={{ color: C.navy }}>Claim your free {selectedProductData.name.toLowerCase()}</h2>
                  <p className="text-xs text-gray-400 mb-4">Upload a photo of your receipt showing a Flying Tumbler purchase, then enter your shipping address.</p>
                  <label className="block w-full rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-gray-300 mb-4"
                    style={{ borderColor: merchReceipt ? C.green : "#E0E0E0", background: merchReceipt ? C.green + "08" : "transparent" }}>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setMerchReceipt(e.target.files?.[0] || null)} />
                    <div className="flex flex-col items-center justify-center py-6 gap-1">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={merchReceipt ? C.green : "#CCC"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      <span className="text-xs" style={{ color: merchReceipt ? C.navy : "#AAA" }}>{merchReceipt ? merchReceipt.name : "Tap to upload receipt photo"}</span>
                    </div>
                  </label>
                  <div className="space-y-3">
                    <input type="text" placeholder="Full name *" value={merchShipName} onChange={(e) => setMerchShipName(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#E0E0E0", background: C.light, color: C.navy, "--tw-ring-color": C.green } as React.CSSProperties} />
                    <input type="text" placeholder="Street address *" value={merchShipAddr1} onChange={(e) => setMerchShipAddr1(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#E0E0E0", background: C.light, color: C.navy, "--tw-ring-color": C.green } as React.CSSProperties} />
                    <input type="text" placeholder="Apt / Suite (optional)" value={merchShipAddr2} onChange={(e) => setMerchShipAddr2(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#E0E0E0", background: C.light, color: C.navy, "--tw-ring-color": C.green } as React.CSSProperties} />
                    <div className="grid grid-cols-5 gap-2">
                      <input type="text" placeholder="City *" value={merchShipCity} onChange={(e) => setMerchShipCity(e.target.value)}
                        className="col-span-2 h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#E0E0E0", background: C.light, color: C.navy, "--tw-ring-color": C.green } as React.CSSProperties} />
                      <input type="text" placeholder="State *" value={merchShipState} onChange={(e) => setMerchShipState(e.target.value.toUpperCase().slice(0, 2))} maxLength={2}
                        className="col-span-1 h-11 px-3 rounded-lg border text-sm text-center uppercase focus:outline-none focus:ring-2" style={{ borderColor: "#E0E0E0", background: C.light, color: C.navy, "--tw-ring-color": C.green } as React.CSSProperties} />
                      <input type="text" placeholder="ZIP *" value={merchShipZip} onChange={(e) => setMerchShipZip(e.target.value.replace(/\D/g, "").slice(0, 5))} maxLength={5}
                        className="col-span-2 h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2" style={{ borderColor: "#E0E0E0", background: C.light, color: C.navy, "--tw-ring-color": C.green } as React.CSSProperties} />
                    </div>
                  </div>
                  {merchError && <p className="text-xs mt-3" style={{ color: C.coral }}>{merchError}</p>}
                  <button onClick={handleMerchSubmit} disabled={merchSubmitting || !merchReceipt || !merchShipName || !merchShipAddr1 || !merchShipCity || !merchShipState || !merchShipZip}
                    className="w-full h-12 rounded-lg font-semibold text-sm mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: C.green, color: "white" }}>
                    {merchSubmitting ? "Submitting..." : `Claim my free ${selectedProductData.name.toLowerCase()}`}
                  </button>
                  <p className="text-[10px] text-gray-400 mt-2 text-center">Ships in 5–11 business days. US addresses only. One per customer.</p>
                </>
              ) : (
                <>
                  {/* Bottle hero */}
                  <div className="flex items-center justify-center gap-4 lg:gap-6 pt-2 pb-4">
                    <Image src="/assets/bird-tube.png" alt="The Bird — Flying Tumbler Irish Whiskey" width={80} height={200} className="h-[140px] lg:h-[180px] w-auto object-contain" />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-[22px] lg:text-[28px] font-extrabold leading-tight" style={{ color: C.navy }}>Buy The Bird,<br />get free merch</h2>
                      <p className="text-[13px] lg:text-[15px] text-gray-500 mt-2 leading-relaxed">Pick up a bottle of Flying Tumbler, snap your receipt, and we&apos;ll ship you free branded merch. On us.</p>
                    </div>
                  </div>

                  {/* How it works steps */}
                  <div className="flex gap-2 lg:gap-3 mb-5">
                    {[
                      { n: "1", label: "Buy a bottle", icon: "🥃" },
                      { n: "2", label: "Snap receipt", icon: "📸" },
                      { n: "3", label: "Pick your merch", icon: "🎁" },
                    ].map((step) => (
                      <div key={step.n} className="flex-1 rounded-xl p-3 lg:p-4 text-center" style={{ background: C.light }}>
                        <div className="text-lg lg:text-2xl mb-1">{step.icon}</div>
                        <p className="text-[11px] lg:text-sm font-bold" style={{ color: C.navy }}>{step.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Product selector — 2 cols mobile, 3 cols desktop */}
                  <p className="text-[11px] lg:text-xs font-bold tracking-[0.12em] uppercase mb-3" style={{ color: C.purple }}>Choose your free item</p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {MERCH_PRODUCTS.map((p) => (
                      <button key={p.key} onClick={() => setSelectedProduct(p.key)}
                        className="rounded-xl p-3 transition-all hover:scale-[1.02] active:scale-[0.97] flex flex-col items-center gap-2"
                        style={{ background: selectedProduct === p.key ? C.yellow + "18" : C.light, border: `2px solid ${selectedProduct === p.key ? C.yellow : "transparent"}`, boxShadow: selectedProduct === p.key ? `0 4px 16px ${C.yellow}25` : "none" }}>
                        <div className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center" style={{ background: "white" }}>
                          <Image src={p.img} alt={p.name} width={160} height={160} className="object-contain w-full h-full p-1" />
                        </div>
                        <span className="text-[12px] font-semibold leading-tight text-center" style={{ color: selectedProduct === p.key ? C.navy : "#777" }}>{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected product confirmation */}
                  <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: C.light }}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center shrink-0" style={{ background: "white" }}>
                      <Image src={selectedProductData.img} alt={selectedProductData.name} width={52} height={52} className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: C.navy }}>Your pick: <span style={{ color: C.green }}>{selectedProductData.name}</span></p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green }} /><span className="text-[10px] text-gray-500">Free</span></div>
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ background: C.yellow }} /><span className="text-[10px] text-gray-500">Ships free</span></div>
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ background: C.coral }} /><span className="text-[10px] text-gray-500">While stocks last</span></div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setMerchStep("form")} className="w-full h-12 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: C.yellow, color: C.navy }}>
                    I bought a bottle — claim my {selectedProductData.name.toLowerCase()}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Share with your mates ── */}
          <div className="rounded-2xl p-6 lg:p-8 mb-5 fade-in-delay-2" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <h2 className="font-display text-xl lg:text-2xl font-bold mb-2" style={{ color: C.navy }}>Share with your mates</h2>
            <p className="text-sm lg:text-base text-gray-500 mb-4">Share your link with friends. When a friend enters, you both get a bonus entry.</p>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 h-12 px-4 rounded-lg border border-gray-200 text-sm flex items-center overflow-hidden font-mono" style={{ background: C.light, color: C.navy }}>
                <span className="truncate">{typeof window !== "undefined" ? `${window.location.origin}?ref=${referralCode}` : ""}</span>
              </div>
              <button onClick={copyReferral} className="h-12 px-5 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0" style={{ background: C.green, color: "white" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex gap-3">
              <a href={typeof window !== "undefined" ? `sms:?body=I just entered Paddy's Homecoming to win a stay at Larch Grove in Ireland! Enter here: ${window.location.origin}?ref=${referralCode}` : "#"}
                className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: C.light, color: C.navy }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                SMS
              </a>
              <a href={typeof window !== "undefined" ? `https://wa.me/?text=I just entered Paddy's Homecoming to win a stay at Larch Grove in Ireland! Enter here: ${encodeURIComponent(window.location.origin + "?ref=" + referralCode)}` : "#"}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: "#25D366", color: "white" }}>
                WhatsApp
              </a>
              <a href={typeof window !== "undefined" ? `mailto:?subject=Win a stay at Larch Grove, Ireland!&body=I just entered Paddy's Homecoming from Flying Tumbler. Enter here: ${window.location.origin}?ref=${referralCode}` : "#"}
                className="flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]" style={{ background: C.purple, color: "white" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                Email
              </a>
            </div>
          </div>

          {/* ── UGC Upload ── */}
          <div className="rounded-2xl p-6 lg:p-8 mb-5 fade-in-delay-2" style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <h2 className="font-display text-xl lg:text-2xl font-bold mb-1" style={{ color: C.navy }}>Snap The Bird in the wild</h2>
            <p className="text-sm lg:text-base text-gray-500 mb-4">Spot The Bird at a bar, on a shelf, or in your glass? Upload a photo for a bonus entry.</p>
            {ugcUploaded ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: C.green + "20" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="text-lg font-semibold" style={{ color: C.green }}>Photo uploaded! Bonus entry earned.</p>
              </div>
            ) : (
              <>
                <label className="block w-full rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-gray-300 mb-3"
                  style={{ borderColor: ugcFile ? C.yellow : "#E0E0E0", background: ugcFile ? C.yellow + "08" : "transparent" }}>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setUgcFile(e.target.files?.[0] || null)} />
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ugcFile ? C.yellow : "#CCC"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span className="text-sm" style={{ color: ugcFile ? C.navy : "#AAA" }}>{ugcFile ? ugcFile.name : "Tap to upload a photo"}</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 text-xs text-gray-500 mb-3 cursor-pointer">
                  <input type="checkbox" checked={ugcConsent} onChange={(e) => setUgcConsent(e.target.checked)} className="mt-0.5" style={{ accentColor: C.green }} />
                  <span>I grant Flying Tumbler permission to use this image in marketing materials.</span>
                </label>
                <button onClick={handleUGCUpload} disabled={!ugcFile || !ugcConsent}
                  className="w-full h-11 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: C.coral, color: "white" }}>
                  Upload for bonus entry
                </button>
              </>
            )}
          </div>

          {/* Legal */}
          <footer className="text-center py-8 space-y-3">
            <p className="text-white/30 text-xs max-w-md mx-auto leading-relaxed">
              NO PURCHASE NECESSARY. Must be 21+. Open to legal US residents. Ends 12/31/2026.
              See <a href="/rules" className="underline hover:text-white/50 transition-colors">Official Rules</a>. Void where prohibited.
            </p>
            <p className="text-white/20 text-xs font-mono">&copy; {new Date().getFullYear()} Flying Tumbler Irish Whiskey. Please drink responsibly.</p>
          </footer>
        </div>
      </div>
    );
  }

  /* ====================================================================
     RENDER: ENTRY FORM — Direction A "The Arrival"
     ==================================================================== */
  return (
    <main className="min-h-screen" style={{ background: C.deepDark }}>
      <div ref={formTopRef} />

      {/* ═══════════════════════════════════════════════════════════════
          HERO + FORM
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative" style={{ background: C.deepDark }}>
        {/* Hero image zone */}
        <div className="relative" style={{ minHeight: 520 }}>
          {/* Background photo */}
          <Image
            src="/assets/carlow-fields-mountains.jpg"
            alt="Carlow fields under the Blackstairs Mountains"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay 1: multiply blend */}
          <div className="absolute inset-0" style={{ mixBlendMode: "multiply", background: "linear-gradient(180deg, #4a3a64 0%, #c08a3e 54%, #2a1c28 100%)", opacity: 0.55 }} />
          {/* Gradient overlay 2: depth */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(43,39,64,.62) 0%, rgba(53,47,99,.08) 28%, rgba(232,158,70,.16) 54%, rgba(40,26,38,.55) 76%, rgba(20,16,30,.96) 100%)" }} />

          {/* Top bar: wordmark + coordinates */}
          <div className="relative z-10 flex items-start justify-between px-5 pt-5">
            <Image src="/assets/wordmark-white.png" alt="Flying Tumbler" width={140} height={58} className="h-14 w-auto" />
            <div className="font-mono text-[10px] text-white/70 text-right pt-1.5 leading-relaxed">52&deg;44&prime;N<br />6&deg;52&prime;W</div>
          </div>

          {/* Paddy standing + glow */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="w-[168px] h-[168px]" style={{ background: "radial-gradient(circle at 50% 50%, rgba(252,224,150,.55) 0%, rgba(250,200,120,.22) 38%, rgba(252,224,150,0) 68%)" }} />
          </div>
          <Image
            src="/assets/paddy-standing.png"
            alt="Paddy the Pigeon, landed home"
            width={52} height={52}
            className="absolute left-1/2 top-3 -translate-x-1/2 z-20 h-[52px] w-auto"
          />

          {/* Hero text content */}
          <div className="relative z-10 mt-auto px-6 pb-7 pt-[260px] flex flex-col gap-3">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: C.yellow }}>Paddy&apos;s Homecoming</p>
            <h1 className="font-display font-extrabold text-[38px] sm:text-[41px] leading-[0.98] tracking-[0.015em] uppercase text-white" style={{ textShadow: "0 2px 24px rgba(20,14,28,.5)" }}>
              Win a trip to<br />Larch Grove
            </h1>
            <p className="text-[15.5px] leading-relaxed text-white/90 max-w-sm">
              The home of Flying Tumbler in Ireland. Paddy&apos;s flown back to the farm in Carlow &mdash; and he&apos;s saved you a seat.
            </p>
            <div className="self-start rounded-lg px-3.5 py-2.5 mt-1" style={{ background: C.yellow, color: C.purple }}>
              <span className="text-[11.5px] font-bold tracking-[0.05em] uppercase">A stay at the farm &middot; whiskey at the bond &middot; a night at the Lord Bagenal</span>
            </div>
          </div>
        </div>

        {/* ── Form zone ── */}
        <div className="relative px-4 pb-6 pt-1" style={{ background: C.deepDark }}>
          <form
            onSubmit={submitEntry}
            className="rounded-[18px] p-4 sm:p-5 flex flex-col gap-2.5 fade-in"
            style={{ background: "#FFFFFF", boxShadow: "0 16px 36px rgba(20,14,28,.4)", marginTop: -2 }}
          >
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: C.purple }}>Enter the draw</p>

            {/* Name row */}
            <div className="flex gap-2">
              <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="arrival-input flex-1 min-w-0" />
              <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="arrival-input flex-1 min-w-0" />
            </div>

            {/* Email */}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="arrival-input" />

            {/* DOB + Zip row */}
            <div className="flex gap-2">
              <div className="flex gap-1 flex-[1.3] min-w-0">
                <select value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} className="arrival-select flex-[1.4] min-w-0">
                  <option value="" disabled>Month</option>
                  {MONTH_NAMES.map((n, i) => <option key={i} value={String(i + 1)}>{n.slice(0, 3)}</option>)}
                </select>
                <select value={dobDay} onChange={(e) => setDobDay(e.target.value)} className="arrival-select w-[60px]">
                  <option value="" disabled>Day</option>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={dobYear} onChange={(e) => setDobYear(e.target.value)} className="arrival-select w-[76px]">
                  <option value="" disabled>Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <input type="text" inputMode="numeric" placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))} maxLength={5} className="arrival-input flex-[0.7] min-w-0" />
            </div>

            {/* State selector */}
            <div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {CORE_STATES.map((s) => (
                  <button type="button" key={s.code}
                    onClick={() => { setSelectedState(s.code); setStore(""); setStoreSearch(""); setShowMoreStates(false); }}
                    className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: selectedState === s.code ? C.green : "#F0EDE4", color: selectedState === s.code ? "white" : C.navy, border: `1.5px solid ${selectedState === s.code ? C.green : C.warmBorder}` }}>
                    {s.code}
                  </button>
                ))}
                <div ref={moreStatesRef} className="relative">
                  <button type="button" onClick={() => setShowMoreStates(!showMoreStates)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: OTHER_STATES.some(s => s.code === selectedState) ? C.green : "#F0EDE4", color: OTHER_STATES.some(s => s.code === selectedState) ? "white" : C.navy, border: `1.5px solid ${OTHER_STATES.some(s => s.code === selectedState) ? C.green : C.warmBorder}` }}>
                    {OTHER_STATES.some(s => s.code === selectedState) ? ALL_STATES.find(s => s.code === selectedState)?.code : "More ▾"}
                  </button>
                  {showMoreStates && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto rounded-lg border shadow-xl custom-scrollbar" style={{ background: "white", borderColor: C.warmBorder }}>
                      {OTHER_STATES.map((s) => (
                        <button type="button" key={s.code}
                          onClick={() => { setSelectedState(s.code); setStore(""); setStoreSearch(""); setShowMoreStates(false); }}
                          className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                          style={{ color: selectedState === s.code ? C.green : C.navy, fontWeight: selectedState === s.code ? 600 : 400 }}>
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
                <input type="text" value={store || storeSearch}
                  onChange={(e) => { setStore(""); setStoreSearch(e.target.value); setShowStoreDropdown(true); }}
                  onFocus={() => setShowStoreDropdown(true)}
                  placeholder={`Search stores in ${ALL_STATES.find(s => s.code === selectedState)?.name || selectedState}...`}
                  className="arrival-input" />
                {showStoreDropdown && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border shadow-xl custom-scrollbar" style={{ background: "white", borderColor: C.warmBorder }}>
                    {filteredStores.length > 0 ? filteredStores.map((s, idx) => (
                      <button type="button" key={`${s.n}-${s.c}-${idx}`}
                        onClick={() => { setStore(`${s.n} — ${s.c}`); setStoreSearch(""); setShowStoreDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex justify-between items-center" style={{ color: C.navy }}>
                        <span className="truncate mr-2">{s.n} <span className="text-gray-400">— {s.c}</span></span>
                        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold" style={{ background: C.green + "20", color: C.green }}>{s.s}</span>
                      </button>
                    )) : (
                      <div className="px-4 py-3 text-sm text-gray-400">No stores found — try a different search</div>
                    )}
                    {filteredStores.length === 50 && <div className="px-4 py-2 text-xs text-gray-300 border-t border-gray-100">Type to narrow results...</div>}
                    <button type="button"
                      onClick={() => { setStore(storeSearch || `Other — ${selectedState}`); setShowStoreDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-t border-gray-100 font-medium" style={{ color: C.gold }}>
                      Other / Not listed
                    </button>
                  </div>
                )}
              </div>
            )}

            {formError && <p className="text-sm text-center font-medium" style={{ color: C.coral }}>{formError}</p>}

            {/* CTA */}
            <button type="submit" disabled={submitting}
              className="w-full rounded-[10px] py-4 text-center font-display font-extrabold text-[16px] tracking-[0.05em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-0.5 glow-pulse"
              style={{ background: C.green, color: C.greenDark }}>
              {submitting ? "Entering..." : "Send Paddy home"}
            </button>
          </form>

          {/* Legal micro */}
          <p className="font-mono text-[9.5px] text-white/50 text-center mt-4 leading-relaxed px-4">
            NO PURCHASE NECESSARY. 21+ US residents. Void where prohibited. See <a href="/rules" className="underline hover:text-white/70">official rules</a>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRIZE EXPERIENCE SHOWCASE
          ═══════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.warmPaper }}>

        {/* ── Intro panel ── */}
        <div className="relative overflow-hidden px-6 pt-9 pb-8" style={{ background: C.purple }}>
          <Image src="/assets/cloud-gold-1.png" alt="" width={150} height={75} className="absolute -top-5 -right-8 opacity-40 pointer-events-none" />
          <p className="relative text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: C.yellow }}>The prize</p>
          <h2 className="relative font-display font-extrabold text-[30px] sm:text-[32px] leading-[1.02] tracking-[0.015em] uppercase text-white mt-3">
            This is where it all began
          </h2>
          <p className="relative text-[15px] leading-relaxed text-white/85 mt-3 max-w-lg">
            This is where Paddy&apos;s coming home to. The farm in Carlow where Flying Tumbler was born &mdash; and you could be there, glass in hand, by the fire.
          </p>
          <div className="relative flex flex-wrap gap-2 mt-5">
            {["Flights for two", "2 nights at the farmhouse", "A tasting in the bond", "A night at the Lord Bagenal"].map((t) => (
              <span key={t} className="rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold text-white" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── Editorial cards ── */}
        <div className="px-4 sm:px-5 pt-6 pb-2 flex flex-col gap-5 max-w-lg mx-auto">
          {PRIZE_CARDS.map((card) => (
            <div key={card.num} className="rounded-t-[28px] rounded-b-2xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 8px 22px rgba(40,28,46,.1)", border: `1px solid ${C.warmBorderLight}` }}>
              <div className="rounded-t-[28px] overflow-hidden h-[212px] relative">
                <Image src={card.img} alt={card.alt} fill className="object-cover" style={{ objectPosition: card.pos }} />
              </div>
              <div className="p-5 flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs" style={{ color: C.gold }}>{card.num}</span>
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: C.green }}>{card.label}</span>
                </div>
                <h3 className="font-display font-extrabold text-[22px] sm:text-[24px] leading-[1.04] tracking-[0.015em] uppercase" style={{ color: C.purple }}>{card.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: C.navy }}>{card.desc}</p>
                {card.extra && (
                  <div className="flex items-center gap-2 mt-1 font-mono text-[11px]" style={{ color: C.midPurple }}>
                    <span style={{ color: C.yellow, letterSpacing: "1.5px" }}>{card.extra.slice(0, 4)}</span>
                    <span>{card.extra.slice(5)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Craic nearby ── */}
        <div className="pt-4 pb-1.5">
          <div className="px-5 flex flex-col gap-1">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: C.gold }}>And the craic nearby</p>
            <h2 className="font-display font-extrabold text-[21px] tracking-[0.015em] uppercase" style={{ color: C.purple }}>Make a week of it</h2>
          </div>
          <div className="craic-row flex gap-3 overflow-x-auto px-5 pt-3.5 pb-5" style={{ scrollSnapType: "x mandatory" }}>
            {CRAIC_ITEMS.map((item) => (
              <div key={item.title} className="flex-shrink-0 w-[154px]" style={{ scrollSnapAlign: "start" }}>
                <div className="rounded-xl overflow-hidden h-[112px] relative">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />
                </div>
                <p className="text-[12.5px] font-bold mt-2" style={{ color: C.purple }}>{item.title}</p>
                <p className="text-[11.5px] leading-snug" style={{ color: C.midPurple }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Closer CTA ── */}
        <div className="relative flex flex-col gap-3 items-center text-center px-6 py-7" style={{ background: C.green }}>
          <Image src="/assets/paddy-flying.png" alt="Paddy the Pigeon" width={100} height={64} className="h-16 w-auto" />
          <h2 className="font-display font-extrabold text-[25px] leading-[1.05] tracking-[0.015em] uppercase" style={{ color: "#1d3b29" }}>
            This is where you&apos;re going
          </h2>
          <p className="text-[14px] leading-relaxed max-w-[32ch]" style={{ color: "#234a35" }}>
            Scan, enter, and you could be the one Paddy brings home. Drawn 31 December 2026.
          </p>
          <button onClick={scrollToForm}
            className="rounded-[10px] px-6 py-3.5 font-display font-extrabold text-[15px] tracking-[0.05em] uppercase text-white transition-all hover:scale-[1.02] active:scale-[0.98] mt-0.5"
            style={{ background: C.purple }}>
            Enter to win
          </button>
        </div>

        {/* ── Legal footer ── */}
        <div className="flex flex-col gap-2.5 items-center text-center px-6 py-6" style={{ background: C.warmPaper }}>
          <p className="text-[10px] leading-relaxed max-w-md" style={{ color: "#8B859C" }}>
            NO PURCHASE NECESSARY. Open to legal US residents 21+. One entry per person; bonus entries via referral and photo upload. Ends December 31, 2026. Void where prohibited. See <a href="/rules" className="underline hover:opacity-70">official rules</a>. Please enjoy responsibly.
          </p>
          <p className="font-mono text-[10px]" style={{ color: "#8B859C" }}>52&deg;44&prime;N &middot; 6&deg;52&prime;W</p>
        </div>
      </section>
    </main>
  );
}
