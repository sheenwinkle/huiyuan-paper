"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  isActive: boolean;
  specs?: { note?: string } | null;
};

type Category = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  products: Product[];
};

type LoadState = "loading" | "ready" | "error";
type SubmitState = "idle" | "submitting" | "success" | "error";

export function ProductManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [categoryState, setCategoryState] = useState<SubmitState>("idle");
  const [productState, setProductState] = useState<SubmitState>("idle");
  const firstCategoryId = useMemo(() => categories[0]?.id || "", [categories]);

  async function loadProducts() {
    setLoadState("loading");
    const response = await fetch("/api/admin/products", { cache: "no-store" });

    if (!response.ok) {
      setLoadState("error");
      return;
    }

    const data = (await response.json()) as { categories: Category[] };
    setCategories(data.categories);
    setLoadState("ready");
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function refreshAfterChange() {
    await loadProducts();
    router.refresh();
  }

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCategoryState("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "category",
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        sortOrder: Number(formData.get("sortOrder") || 0)
      })
    });

    if (!response.ok) {
      setCategoryState("error");
      return;
    }

    form.reset();
    setCategoryState("success");
    await refreshAfterChange();
  }

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProductState("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "product",
        categoryId: String(formData.get("categoryId") || ""),
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        specsText: String(formData.get("specsText") || "")
      })
    });

    if (!response.ok) {
      setProductState("error");
      return;
    }

    form.reset();
    setProductState("success");
    await refreshAfterChange();
  }

  async function handleUpdateCategory(event: FormEvent<HTMLFormElement>, categoryId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/admin/product-categories/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        sortOrder: Number(formData.get("sortOrder") || 0)
      })
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  async function handleDeleteCategory(category: Category) {
    if (category.products.length > 0) {
      window.alert("请先删除或移动该分类下的产品，再删除分类。");
      return;
    }

    if (!window.confirm(`确认删除分类「${category.name}」吗？`)) {
      return;
    }

    const response = await fetch(`/api/admin/product-categories/${category.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>, productId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: String(formData.get("categoryId") || ""),
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        specsText: String(formData.get("specsText") || "")
      })
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  async function handleToggleProduct(product: Product) {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive })
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  async function handleDeleteProduct(product: Product) {
    if (!window.confirm(`确认删除产品「${product.name}」吗？`)) {
      return;
    }

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  if (loadState === "error") {
    return (
      <div className="rounded-lg border border-cinnabar/20 bg-cinnabar/10 p-4 text-sm leading-7 text-cinnabar">
        产品数据暂时不可用。请确认 PostgreSQL 已启动，并已运行 Prisma 迁移。
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={handleCreateCategory} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-ink">新增产品分类</h2>
            <p className="mt-2 text-sm leading-7 text-graphite/70">
              分类用于组织官网和后台产品，例如抽泡纸、竹浆纸、纸扎。
            </p>
          </div>
          <input name="name" required className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm" placeholder="分类名称" />
          <textarea name="description" required rows={3} className="focus-ring resize-none rounded-md border border-black/15 px-3 py-3 text-sm" placeholder="分类说明" />
          <input name="sortOrder" type="number" min={0} max={999} defaultValue={0} className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm" />
          <button type="submit" disabled={categoryState === "submitting"} className="focus-ring rounded-md bg-cinnabar px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
            {categoryState === "submitting" ? "保存中..." : "保存分类"}
          </button>
          {categoryState === "success" ? <p className="text-sm text-green-700">分类已保存。</p> : null}
          {categoryState === "error" ? <p className="text-sm text-cinnabar">分类保存失败，请检查数据库或是否重名。</p> : null}
        </form>

        <form onSubmit={handleCreateProduct} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-ink">新增产品</h2>
            <p className="mt-2 text-sm leading-7 text-graphite/70">
              产品会展示在官网产品页，具体报价仍由人工确认。
            </p>
          </div>
          <select name="categoryId" required defaultValue={firstCategoryId} className="focus-ring rounded-md border border-black/15 bg-white px-3 py-3 text-sm">
            <option value="">请选择分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input name="name" required className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm" placeholder="产品名称" />
          <textarea name="description" required rows={3} className="focus-ring resize-none rounded-md border border-black/15 px-3 py-3 text-sm" placeholder="产品说明" />
          <textarea name="specsText" rows={2} className="focus-ring resize-none rounded-md border border-black/15 px-3 py-3 text-sm" placeholder="规格备注" />
          <button type="submit" disabled={productState === "submitting" || categories.length === 0} className="focus-ring rounded-md bg-cinnabar px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
            {productState === "submitting" ? "保存中..." : "保存产品"}
          </button>
          {categories.length === 0 ? <p className="text-sm text-graphite/65">请先新增一个产品分类。</p> : null}
          {productState === "success" ? <p className="text-sm text-green-700">产品已保存。</p> : null}
          {productState === "error" ? <p className="text-sm text-cinnabar">产品保存失败，请检查字段或数据库状态。</p> : null}
        </form>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-semibold text-ink">当前产品资料</h2>
            <p className="mt-2 text-sm leading-7 text-graphite/70">
              官网产品页优先读取这里的数据。隐藏产品不会在官网展示。
            </p>
          </div>
          <button type="button" onClick={() => void loadProducts()} className="focus-ring rounded-md border border-black/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/5">
            刷新
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {loadState === "loading" ? (
            <p className="text-sm text-graphite/65">正在读取产品资料...</p>
          ) : categories.length === 0 ? (
            <p className="rounded-md bg-paper p-4 text-sm text-graphite/70">
              暂无数据库产品资料。可以先运行 seed，或在这里新增分类和产品。
            </p>
          ) : (
            categories.map((category) => (
              <article key={category.id} className="rounded-lg border border-black/10 p-5">
                <form onSubmit={(event) => void handleUpdateCategory(event, category.id)} className="grid gap-3 md:grid-cols-[1fr_2fr_100px_auto]">
                  <input name="name" defaultValue={category.name} required className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm font-semibold" />
                  <input name="description" defaultValue={category.description} required className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm" />
                  <input name="sortOrder" type="number" min={0} max={999} defaultValue={category.sortOrder} className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm" />
                  <div className="flex gap-2">
                    <button type="submit" className="focus-ring rounded-md bg-cinnabar px-3 py-2 text-sm font-semibold text-white">保存</button>
                    <button type="button" onClick={() => void handleDeleteCategory(category)} className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm font-semibold text-ink hover:bg-black/5">删除</button>
                  </div>
                </form>

                <div className="mt-4 grid gap-3">
                  {category.products.length === 0 ? (
                    <p className="text-sm text-graphite/55">此分类下暂无产品。</p>
                  ) : (
                    category.products.map((product) => (
                      <form key={product.id} onSubmit={(event) => void handleUpdateProduct(event, product.id)} className="grid gap-3 rounded-md bg-paper p-4 lg:grid-cols-[1.2fr_1.4fr_1fr_1fr_auto]">
                        <input name="name" defaultValue={product.name} required className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm font-semibold" />
                        <input name="description" defaultValue={product.description} required className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm" />
                        <input name="specsText" defaultValue={product.specs?.note || ""} className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm" placeholder="规格备注" />
                        <select name="categoryId" defaultValue={product.categoryId || category.id} className="focus-ring rounded-md border border-black/15 bg-white px-3 py-2 text-sm">
                          {categories.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                          ))}
                        </select>
                        <div className="flex flex-wrap gap-2">
                          <button type="submit" className="focus-ring rounded-md bg-cinnabar px-3 py-2 text-sm font-semibold text-white">保存</button>
                          <button type="button" onClick={() => void handleToggleProduct(product)} className="focus-ring rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-ink">
                            {product.isActive ? "下架" : "上架"}
                          </button>
                          <button type="button" onClick={() => void handleDeleteProduct(product)} className="focus-ring rounded-md border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-ink">
                            删除
                          </button>
                        </div>
                      </form>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

