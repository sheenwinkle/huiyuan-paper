import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/db/prisma";
import { createKnowledgeDocumentSchema } from "@/lib/validators/knowledge";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const documents = await prisma.knowledgeDocument.findMany({
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ documents });
  } catch {
    return NextResponse.json(
      { error: "DATABASE_UNAVAILABLE" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = createKnowledgeDocumentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "INVALID_KNOWLEDGE_DOCUMENT", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const document = await prisma.knowledgeDocument.create({
      data: result.data
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "KNOWLEDGE_CREATE_FAILED" },
      { status: 503 }
    );
  }
}

