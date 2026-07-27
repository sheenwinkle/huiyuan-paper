import { ProductGrid } from "@/components/site/product-grid";
import { SectionTitle } from "@/components/site/section-title";
import { getPublicProductCards } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { items, source } = await getPublicProductCards();

  return (
    <main className="section-shell py-14">
      <SectionTitle
        eyebrow="产品中心"
        title="主打抽泡纸，覆盖多类祭祀纸制品"
        description="产品页会优先展示后台录入的数据；数据库暂未准备好时，仍会展示首版静态分类，方便业务演示不中断。"
      />
      {source === "database" ? (
        <div className="mt-5 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          当前展示后台数据库中的产品资料。
        </div>
      ) : null}
      <div className="mt-9">
        <ProductGrid items={items} />
      </div>
    </main>
  );
}

