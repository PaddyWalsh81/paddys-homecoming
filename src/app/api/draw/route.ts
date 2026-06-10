import { NextRequest, NextResponse } from "next/server";
import { executeDraw } from "@/lib/db";

// Admin auth
function isAuthed(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const password = process.env.ADMIN_PASSWORD || "flyingtumbler2026";
  if (!authHeader) return false;
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Basic") return false;
  const decoded = Buffer.from(token, "base64").toString();
  const [, pwd] = decoded.split(":");
  return pwd === password;
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await executeDraw();
  if (!result) {
    return NextResponse.json({ error: "No entries in the draw." }, { status: 400 });
  }

  return NextResponse.json({
    winner: {
      name: result.winner.firstName,
      email: result.winner.email,
      store: result.winner.store,
      entryType: result.winner.entryType,
    },
    totalEntries: result.totalEntries,
    drawTimestamp: result.drawTimestamp,
    auditLog: result.auditLog,
  });
}
