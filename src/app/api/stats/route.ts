import { NextRequest, NextResponse } from "next/server";
import { getStats, exportCSV } from "@/lib/db";

// Simple admin auth — set ADMIN_PASSWORD env var in Vercel
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

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get("format");
  if (format === "csv") {
    const csv = await exportCSV();
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=paddys-homecoming-entries.csv",
      },
    });
  }

  const stats = await getStats();
  return NextResponse.json(stats);
}
