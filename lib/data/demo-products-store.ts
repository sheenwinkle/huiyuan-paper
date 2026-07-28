import { productCategories } from "@/lib/data/site-content";
import type { CreateCategoryInput, CreateProductInput, UpdateCategoryInput, UpdateProductInput } from "@/lib/validators/product";

export type DemoProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;
  specs?: { note?: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type DemoCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  products: DemoProduct[];
  createdAt: string;
  updatedAt: string;
};

const globalForDemoProducts = globalThis as unknown as {
  huiyuanDemoCategories?: DemoCategory[];
};

function createInitialCategories() {
  const now = new Date().toISOString();
  return productCategories.map((category, index) => ({
    id: `demo-category-${index + 1}`,
    name: category.name,
    slug: `demo-category-${index + 1}`,
    description: category.description,
    sortOrder: index + 1,
    products: [],
    createdAt: now,
    updatedAt: now
  }));
}

export const demoCategories =
  globalForDemoProducts.huiyuanDemoCategories ?? createInitialCategories();

if (!globalForDemoProducts.huiyuanDemoCategories) {
  globalForDemoProducts.huiyuanDemoCategories = demoCategories;
}

export function listDemoCategories() {
  return demoCategories
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      ...category,
      products: category.products.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }));
}

export function createDemoCategory(input: CreateCategoryInput) {
  const now = new Date().toISOString();
  const category: DemoCategory = {
    id: crypto.randomUUID(),
    name: input.name,
    slug: crypto.randomUUID(),
    description: input.description,
    sortOrder: input.sortOrder,
    products: [],
    createdAt: now,
    updatedAt: now
  };
  demoCategories.push(category);
  return category;
}

export function updateDemoCategory(id: string, input: UpdateCategoryInput) {
  const category = demoCategories.find((item) => item.id === id);
  if (!category) return null;
  category.name = input.name;
  category.description = input.description;
  category.sortOrder = input.sortOrder;
  category.updatedAt = new Date().toISOString();
  return category;
}

export function deleteDemoCategory(id: string) {
  const index = demoCategories.findIndex((item) => item.id === id);
  if (index === -1 || demoCategories[index].products.length > 0) return false;
  demoCategories.splice(index, 1);
  return true;
}

export function createDemoProduct(input: CreateProductInput) {
  const category = demoCategories.find((item) => item.id === input.categoryId);
  if (!category) return null;
  const now = new Date().toISOString();
  const product: DemoProduct = {
    id: crypto.randomUUID(),
    categoryId: input.categoryId,
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl || null,
    isActive: true,
    specs: input.specsText ? { note: input.specsText } : null,
    createdAt: now,
    updatedAt: now
  };
  category.products.unshift(product);
  return product;
}

export function updateDemoProduct(id: string, input: UpdateProductInput) {
  const currentCategory = demoCategories.find((category) =>
    category.products.some((product) => product.id === id)
  );
  const product = currentCategory?.products.find((item) => item.id === id);
  if (!currentCategory || !product) return null;

  if (input.categoryId && input.categoryId !== currentCategory.id) {
    const nextCategory = demoCategories.find((category) => category.id === input.categoryId);
    if (!nextCategory) return null;
    currentCategory.products = currentCategory.products.filter((item) => item.id !== id);
    product.categoryId = nextCategory.id;
    nextCategory.products.unshift(product);
  }

  if (input.name !== undefined) product.name = input.name;
  if (input.description !== undefined) product.description = input.description;
  if (input.imageUrl !== undefined) product.imageUrl = input.imageUrl || null;
  if (input.isActive !== undefined) product.isActive = input.isActive;
  if (input.specsText !== undefined) product.specs = input.specsText ? { note: input.specsText } : null;
  product.updatedAt = new Date().toISOString();
  return product;
}

export function deleteDemoProduct(id: string) {
  const category = demoCategories.find((item) =>
    item.products.some((product) => product.id === id)
  );
  if (!category) return false;
  category.products = category.products.filter((product) => product.id !== id);
  return true;
}
