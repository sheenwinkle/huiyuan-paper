import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { createDemoCategory, createDemoProduct, listDemoCategories } from "@/lib/data/demo-products-store";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/runtime/demo-mode";
import { createSlug } from "@/lib/utils/slug";
import { productManagementSchema } from "@/lib/validators/product";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({ categories: listDemoCategories() });
  }

  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        products: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    return NextResponse.json({ categories });
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
  const result = productManagementSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "INVALID_PRODUCT_PAYLOAD", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    if (result.data.kind === "category") {
      if (isDemoMode()) {
        const category = createDemoCategory(result.data);
        return NextResponse.json({ category }, { status: 201 });
      }

      const category = await prisma.productCategory.create({
        data: {
          name: result.data.name,
          description: result.data.description,
          sortOrder: result.data.sortOrder,
          slug: createSlug(result.data.name, "category")
        }
      });

      return NextResponse.json({ category }, { status: 201 });
    }

    if (isDemoMode()) {
      const product = createDemoProduct(result.data);
      if (!product) {
        return NextResponse.json({ error: "CATEGORY_NOT_FOUND" }, { status: 404 });
      }
      return NextResponse.json({ product }, { status: 201 });
    }

    const product = await prisma.product.create({
      data: {
        categoryId: result.data.categoryId,
        name: result.data.name,
        description: result.data.description,
        specs: result.data.specsText ? { note: result.data.specsText } : undefined,
        slug: createSlug(result.data.name, "product")
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "DATABASE_WRITE_FAILED" },
      { status: 503 }
    );
  }
}
