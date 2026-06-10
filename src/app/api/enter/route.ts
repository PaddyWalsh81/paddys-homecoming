import { NextRequest, NextResponse } from "next/server";
import { addEntry } from "@/lib/db";
import { addSweepstakesSubscriber } from "@/lib/mailchimp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, dob, zip, store, state, referredBy } = body;

    // Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !dob || !zip?.trim() || !store?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Age check (server-side verification)
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 21) {
      return NextResponse.json({ error: "Must be 21 or older to enter." }, { status: 403 });
    }

    const result = await addEntry({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      dob,
      zip: zip.trim(),
      store: store.trim(),
      state: state || null,
      referredBy: referredBy || null,
    });

    if (!result.isNew) {
      return NextResponse.json({
        message: "You've already entered! Share your link for bonus entries.",
        referralCode: result.referralCode,
        alreadyEntered: true,
      });
    }

    // Add to Mailchimp (non-blocking — don't let it break the entry flow)
    const resolvedState = state || (store.match(/\b(MA|NH|DC|NY|MD)\b/) || [])[1] || "Other";
    addSweepstakesSubscriber({
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      zip: zip.trim(),
      store: store.trim(),
      state: resolvedState,
      referralCode: result.referralCode,
    }).catch((err) => console.error("[Mailchimp] Background error:", err));

    return NextResponse.json({
      message: "Entry received! You're in the draw.",
      referralCode: result.referralCode,
      entryId: result.entry.id,
    });
  } catch {
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
