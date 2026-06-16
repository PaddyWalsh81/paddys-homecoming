/**
 * GET /api/receipt?pw=...&id=...
 *
 * Returns the base64 receipt image for a given merch redemption ID.
 * Admin only (password-gated).
 */

import { NextRequest, NextResponse } from "next/server";
import { getReceiptData } from "../../../lib/db";

const ADMIN_PW = process.env.ADMIN_PASSWORD || "flyingtumbler2026";

export async function GET(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw");
  if (pw !== ADMIN_PW) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  try {
    const receiptData = await getReceiptData(id);
    if (!receiptData) {
      return NextResponse.json({ error: "No receipt image found" }, { status: 404 });
    }

    return NextResponse.json({ receiptData });
  } catch (err) {
    console.error("Receipt API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
