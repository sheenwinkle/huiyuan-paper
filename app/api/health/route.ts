import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "huiyuan-paper",
    timestamp: new Date().toISOString()
  });
}

