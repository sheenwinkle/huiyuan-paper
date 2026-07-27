import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { deleteDemoCategory, updateDemoCategory } from "@/lib/data/demo-products-store";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/runtime/demo-mode";
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
    if (isDemoMode()) {
      const category = updateDemoCategory(categoryId, result.data);
      if (!category) {
        return NextResponse.json({ error: "CATEGORY_NOT_FOUND" }, { status: 404 });
      }
      return NextResponse.json({ category });
    }

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
    if (isDemoMode()) {
      const ok = deleteDemoCategory(categoryId);
      return NextResponse.json({ ok }, { status: ok ? 200 : 409 });
    }

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
