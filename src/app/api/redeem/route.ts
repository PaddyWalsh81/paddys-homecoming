/**
 * POST /api/redeem
 *
 * Accepts a merch redemption request:
 * - Receipt photo (base64 encoded)
 * - Shipping address
 * - Consumer email (must match an existing sweepstakes entry)
 *
 * Creates a pending MerchRedemption for admin review.
 *
 * GET /api/redeem
 * Returns all merch redemptions (admin only, password-gated).
 */

import { NextRequest, NextResponse } from "next/server";
import { addMerchRedemption, getAllMerchRedemptions, updateMerchRedemption } from "../../../lib/db";

const ADMIN_PW = process.env.ADMIN_PASSWORD || "flyingtumbler2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      firstName,
      lastName,
      store,
      state,
      receiptBase64,
      receiptFilename,
      shippingName,
      shippingAddress1,
      shippingAddress2,
      shippingCity,
      shippingState,
      shippingZip,
      product,
    } = body;

    // Validate required fields
    if (
      !email ||
      !firstName ||
      !shippingName ||
      !shippingAddress1 ||
      !shippingCity ||
      !shippingState ||
      !shippingZip
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Store the receipt — for MVP we store the filename reference.
    // The actual base64 image data could be stored in KV or an external service.
    // For now, we store a reference and the admin can view submissions.
    const filename = receiptFilename || `receipt-${Date.now()}.jpg`;

    const { redemption, isNew } = await addMerchRedemption({
      email,
      firstName,
      lastName: lastName || "",
      store: store || "",
      state: state || "",
      receiptFilename: filename,
      shippingName,
      shippingAddress1,
      shippingAddress2: shippingAddress2 || "",
      shippingCity,
      shippingState,
      shippingZip,
      product: product || "canCooler",
    });

    if (!isNew) {
      return NextResponse.json({
        success: true,
        alreadyClaimed: true,
        message: "You've already claimed your merch! Check your email for shipping updates.",
        redemptionId: redemption.id,
        status: redemption.status,
      });
    }

    return NextResponse.json({
      success: true,
      alreadyClaimed: false,
      message: "Your merch request has been submitted! We'll review your receipt and ship your free merch soon.",
      redemptionId: redemption.id,
    });
  } catch (err) {
    console.error("Redeem API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw");
  if (pw !== ADMIN_PW) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const redemptions = await getAllMerchRedemptions();
    return NextResponse.json({ redemptions });
  } catch (err) {
    console.error("Redeem GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/redeem?pw=...&id=...&action=approve|reject
 *
 * Admin action to approve or reject a merch redemption.
 * On approval, creates a Printful order.
 */
export async function PATCH(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw");
  if (pw !== ADMIN_PW) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, action, notes } = body;

    if (!id || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Missing id or invalid action (approve/reject)" },
        { status: 400 }
      );
    }

    if (action === "reject") {
      const updated = await updateMerchRedemption(id, {
        status: "rejected",
        adminNotes: notes || "Receipt rejected",
      });
      return NextResponse.json({ success: true, redemption: updated });
    }

    // Approve: update status, then create Printful order
    if (action === "approve") {
      // First update to approved
      const updated = await updateMerchRedemption(id, {
        status: "approved",
        adminNotes: notes || "Receipt approved — Printful order pending",
      });

      if (!updated) {
        return NextResponse.json(
          { error: "Redemption not found" },
          { status: 404 }
        );
      }

      // Try to create Printful order
      let printfulOrderId: number | null = null;
      try {
        const { createCanCoolerOrder, confirmOrder } = await import(
          "../../../lib/printful"
        );

        const recipient = {
          name: updated.shippingName,
          address1: updated.shippingAddress1,
          address2: updated.shippingAddress2 || undefined,
          city: updated.shippingCity,
          state_code: updated.shippingState,
          zip: updated.shippingZip,
          country_code: "US",
          email: updated.email,
        };

        // TODO: Replace with actual FT can cooler design file URL
        const designUrl =
          "https://paddys-homecoming.vercel.app/assets/ft-can-cooler-design.png";

        const draftOrder = await createCanCoolerOrder(
          recipient,
          designUrl,
          `merch-${updated.id}`
        );

        printfulOrderId = draftOrder.id;

        // Confirm the order to send it to production
        await confirmOrder(draftOrder.id);

        // Update with Printful order ID
        await updateMerchRedemption(id, {
          printfulOrderId,
          status: "fulfilled",
          adminNotes: `Printful order #${printfulOrderId} created and confirmed`,
        });
      } catch (printfulErr) {
        console.error("Printful order creation failed:", printfulErr);
        // Keep as approved — admin can retry manually
        await updateMerchRedemption(id, {
          adminNotes: `Approved but Printful order failed: ${printfulErr instanceof Error ? printfulErr.message : "Unknown error"}. Retry manually.`,
        });
      }

      return NextResponse.json({
        success: true,
        printfulOrderId,
        redemption: await updateMerchRedemption(id, {}), // re-fetch latest
      });
    }
  } catch (err) {
    console.error("Redeem PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
