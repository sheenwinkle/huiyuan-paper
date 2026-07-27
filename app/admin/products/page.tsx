import Link from "next/link";
import { ProductManagement } from "@/components/admin/product-management";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();

  return (
    <main className="section-shell py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
        <div>
          <div className="text-sm font-semibold text-cinnabar">产品管理</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
            分类与产品资料
          </h1>
          <p className="mt-3 text-sm leading-7 text-graphite/75">
            先把产品资料结构化，后续再扩展图片、规格表、上下架、SEO 和批量导入。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin"
            className="focus-ring rounded-md bg-cinnabar px-4 py-2 text-center text-sm font-semibold text-white"
          >
            返回总览
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-8">
        <ProductManagement />
      </div>
    </main>
  );
}

