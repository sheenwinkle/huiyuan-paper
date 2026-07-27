import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/db/prisma";
import { updateKnowledgeDocumentSchema } from "@/lib/validators/knowledge";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = updateKnowledgeDocumentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "INVALID_KNOWLEDGE_UPDATE", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const { documentId } = await context.params;

  try {
    const document = await prisma.knowledgeDocument.update({
      where: { id: documentId },
      data: result.data
    });

    return NextResponse.json({ document });
  } catch {
    return NextResponse.json(
      { error: "KNOWLEDGE_UPDATE_FAILED" },
      { status: 503 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { documentId } = await context.params;

  try {
    await prisma.knowledgeDocument.delete({ where: { id: documentId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "KNOWLEDGE_DELETE_FAILED" },
      { status: 503 }
    );
  }
}

