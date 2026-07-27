import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/db/prisma";
import { inquirySchema } from "@/lib/validators/inquiry";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ inquiries });
  } catch {
    return NextResponse.json(
      { error: "DATABASE_UNAVAILABLE" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = inquirySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "INVALID_INQUIRY", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: result.data
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "DATABASE_UNAVAILABLE" },
      { status: 503 }
    );
  }
}
