import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/db/prisma";
import { updateCategorySchema } from "@/lib/validators/product";

type RouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = updateCategorySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "INVALID_CATEGORY_UPDATE", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const { categoryId } = await context.params;

  try {
    const category = await prisma.productCategory.update({
      where: { id: categoryId },
      data: result.data
    });

    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "CATEGORY_UPDATE_FAILED" }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { categoryId } = await context.params;

  try {
    const productCount = await prisma.product.count({
      where: { categoryId }
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: "CATEGORY_HAS_PRODUCTS" },
        { status: 409 }
      );
    }

    await prisma.productCategory.delete({ where: { id: categoryId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "CATEGORY_DELETE_FAILED" }, { status: 503 });
  }
}

