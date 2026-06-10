import { NextRequest, NextResponse } from "next/server";
import { addEntry } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, dob, zip, store, referredBy } = body;

    // Validation
    if (!firstName?.trim() || !email?.trim() || !dob || !zip?.trim() || !store?.trim()) {
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

    const result = addEntry({
      firstName: firstName.trim(),
      email: email.trim().toLowerCase(),
      dob,
      zip: zip.trim(),
      store: store.trim(),
      referredBy: referredBy || null,
    });

    if (!result.isNew) {
      return NextResponse.json({
        message: "You've already entered! Share your link for bonus entries.",
        referralCode: result.referralCode,
        alreadyEntered: true,
      });
    }

    return NextResponse.json({
      message: "Entry received! You're in the draw.",
      referralCode: result.referralCode,
      entryId: result.entry.id,
    });
  } catch {
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
