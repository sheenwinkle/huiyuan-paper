import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { updateInquiryStatus } from "@/lib/data/inquiries-store";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/runtime/demo-mode";
import { updateInquirySchema } from "@/lib/validators/admin-inquiry";

type RouteContext = {
  params: Promise<{ inquiryId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = updateInquirySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "INVALID_INQUIRY_UPDATE", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const { inquiryId } = await context.params;

  try {
    if (isDemoMode()) {
      const inquiry = updateInquiryStatus(inquiryId, result.data.status);
      if (!inquiry) {
        return NextResponse.json({ error: "INQUIRY_NOT_FOUND" }, { status: 404 });
      }
      return NextResponse.json({ inquiry });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: result.data
    });

    return NextResponse.json({ inquiry });
  } catch {
    return NextResponse.json({ error: "INQUIRY_UPDATE_FAILED" }, { status: 503 });
  }
}
