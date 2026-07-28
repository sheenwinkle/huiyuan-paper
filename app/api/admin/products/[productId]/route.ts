import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { deleteDemoProduct, updateDemoProduct } from "@/lib/data/demo-products-store";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/runtime/demo-mode";
import { updateProductSchema } from "@/lib/validators/product";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = updateProductSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "INVALID_PRODUCT_UPDATE", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const { productId } = await context.params;
  const { imageUrl, specsText, ...data } = result.data;

  try {
    if (isDemoMode()) {
      const product = updateDemoProduct(productId, result.data);
      if (!product) {
        return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
        ...(specsText !== undefined ? { specs: specsText ? { note: specsText } : undefined } : {})
      }
    });

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "PRODUCT_UPDATE_FAILED" }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { productId } = await context.params;

  try {
    if (isDemoMode()) {
      const ok = deleteDemoProduct(productId);
      return NextResponse.json({ ok });
    }

    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "PRODUCT_DELETE_FAILED" }, { status: 503 });
  }
}
