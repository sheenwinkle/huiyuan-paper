import { prisma } from "@/lib/db/prisma";
import { listDemoCategories } from "@/lib/data/demo-products-store";
import { productCategories as fallbackCategories } from "@/lib/data/site-content";
import { isDemoMode } from "@/lib/runtime/demo-mode";

export type ProductCardItem = {
  name: string;
  description: string;
  category?: string;
};

export async function getPublicProductCards(): Promise<{
  items: ProductCardItem[];
  source: "database" | "fallback";
}> {
  if (isDemoMode()) {
    const categories = listDemoCategories();
    const products = categories.flatMap((category) =>
      category.products
        .filter((product) => product.isActive)
        .map((product) => ({
          name: product.name,
          description: product.description,
          category: category.name
        }))
    );

    if (products.length > 0) {
      return { items: products, source: "database" };
    }

    return {
      items: categories.map((category) => ({
        name: category.name,
        description: category.description
      })),
      source: "database"
    };
  }

  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    const products = categories.flatMap((category) =>
      category.products.map((product) => ({
        name: product.name,
        description: product.description,
        category: category.name
      }))
    );

    if (products.length > 0) {
      return { items: products, source: "database" };
    }

    if (categories.length > 0) {
      return {
        items: categories.map((category) => ({
          name: category.name,
          description: category.description
        })),
        source: "database"
      };
    }
  } catch {
    // Database may not be running in early local setup.
  }

  return { items: fallbackCategories, source: "fallback" };
}
