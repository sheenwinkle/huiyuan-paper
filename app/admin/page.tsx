import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { listDemoKnowledge } from "@/lib/data/demo-knowledge-store";
import { listDemoCategories } from "@/lib/data/demo-products-store";
import { listInquiries } from "@/lib/data/inquiries-store";
import { productCategories } from "@/lib/data/site-content";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/runtime/demo-mode";

export const dynamic = "force-dynamic";

async function getDashboardMetrics() {
  if (isDemoMode()) {
    const categories = listDemoCategories();
    const inquiries = listInquiries();
    return {
      inquiryCount: inquiries.length,
      pendingCount: inquiries.filter((inquiry) => inquiry.status === "new").length,
      highPriorityCount: inquiries.filter((inquiry) => inquiry.priority === "HIGH").length,
      categoryCount: categories.length,
      productCount: categories.reduce((count, category) => count + category.products.length, 0),
      knowledgeCount: listDemoKnowledge().filter((document) => document.isActive).length,
      databaseReady: true
    };
  }

  try {
    const [
      inquiryCount,
      pendingCount,
      highPriorityCount,
      dbCategoryCount,
      dbProductCount,
      knowledgeCount
    ] =
      await Promise.all([
        prisma.inquiry.count(),
        prisma.inquiry.count({ where: { status: "NEW" } }),
        prisma.inquiry.count({ where: { priority: "HIGH" } }),
        prisma.productCategory.count(),
        prisma.product.count(),
        prisma.knowledgeDocument.count({ where: { isActive: true } })
      ]);

    return {
      inquiryCount,
      pendingCount,
      highPriorityCount,
      categoryCount: dbCategoryCount || productCategories.length,
      productCount: dbProductCount,
      knowledgeCount,
      databaseReady: true
    };
  } catch {
    return {
      inquiryCount: 0,
      pendingCount: 0,
      highPriorityCount: 0,
      categoryCount: productCategories.length,
      productCount: 0,
      knowledgeCount: 0,
      databaseReady: false
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const metrics = await getDashboardMetrics();

  const cards = [
    { label: "产品分类", value: metrics.categoryCount },
    { label: "产品条目", value: metrics.productCount },
    { label: "总询盘", value: metrics.inquiryCount },
    { label: "高优先级", value: metrics.highPriorityCount }
  ];

  return (
    <main className="section-shell py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
        <div>
          <div className="text-sm font-semibold text-cinnabar">管理后台</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
            慧缘纸制品运营总览
          </h1>
          <p className="mt-3 text-sm leading-7 text-graphite/75">
            当前管理员：{session.email}。后台逐步承接询盘、产品、企业内容和 AI 知识库管理。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/products"
            className="focus-ring rounded-md bg-cinnabar px-4 py-2 text-center text-sm font-semibold text-white"
          >
            管理产品
          </Link>
          <Link
            href="/admin/inquiries"
            className="focus-ring rounded-md border border-black/15 bg-white px-4 py-2 text-center text-sm font-semibold text-ink"
          >
            查看询盘
          </Link>
          <Link
            href="/admin/knowledge"
            className="focus-ring rounded-md border border-black/15 bg-white px-4 py-2 text-center text-sm font-semibold text-ink"
          >
            AI 知识库
          </Link>
          <LogoutButton />
        </div>
      </div>

      {!metrics.databaseReady ? (
        <div className="mt-6 rounded-lg border border-cinnabar/20 bg-cinnabar/10 p-4 text-sm leading-7 text-cinnabar">
          数据库暂未连接。请先启动 PostgreSQL，并运行 Prisma 迁移命令。
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {cards.map((metric) => (
          <article key={metric.label} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="text-sm text-graphite/65">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold text-ink">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-ink">后台迭代顺序</h2>
          <div className="mt-5 grid gap-3">
            {[
              "管理员登录保护后台页面",
              "询盘列表接入 PostgreSQL",
              "询盘 CRM 跟进字段和 CSV 导出",
              "产品分类和产品详情可新增",
              "AI 知识库可维护",
              "AI 知识库上传与检索"
            ].map((item, index) => (
              <div key={item} className="flex gap-3 rounded-md bg-paper p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cinnabar text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-7 text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-[#20231f] p-6 text-white shadow-sm">
          <h2 className="text-xl font-semibold">作品集亮点</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">
            这个后台不是普通管理页，而是展示传统制造业数字化闭环：
            官网获客、AI 初筛、询盘入库、人工跟进、资料沉淀、持续优化。
          </p>
        </div>
      </section>
    </main>
  );
}
