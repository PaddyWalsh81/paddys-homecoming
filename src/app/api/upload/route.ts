import { NextRequest, NextResponse } from "next/server";
import { addUGCBonusEntry, addUGCUpload } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const email = formData.get("email") as string;
    const referralCode = formData.get("referralCode") as string;

    if (!file || !email) {
      return NextResponse.json({ error: "File and email required." }, { status: 400 });
    }

    // In production: upload to Supabase Storage or Vercel Blob
    // For now, just record the metadata
    const upload = addUGCUpload({
      email: email.toLowerCase(),
      referralCode: referralCode || "",
      filename: file.name,
    });

    // Award bonus entry
    const bonusAwarded = addUGCBonusEntry(email.toLowerCase(), referralCode);

    return NextResponse.json({
      message: bonusAwarded
        ? "Photo uploaded! Bonus entry awarded."
        : "Photo uploaded! (Bonus entry already claimed.)",
      uploadId: upload.id,
      bonusAwarded,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
