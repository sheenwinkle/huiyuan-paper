import Link from "next/link";
import { InquiriesTable } from "@/components/admin/inquiries-table";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

async function getInquiries() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return {
      inquiries: inquiries.map((inquiry) => ({
        ...inquiry,
        createdAt: inquiry.createdAt.toISOString(),
        updatedAt: inquiry.updatedAt.toISOString()
      })),
      databaseReady: true
    };
  } catch {
    return { inquiries: [], databaseReady: false };
  }
}

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const { inquiries, databaseReady } = await getInquiries();

  return (
    <main className="section-shell py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
        <div>
          <div className="text-sm font-semibold text-cinnabar">询盘管理</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
            客户线索
          </h1>
          <p className="mt-3 text-sm leading-7 text-graphite/75">
            客户通过网站表单提交的姓名、电话、微信、产品、数量和地区会进入这里。
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

      {!databaseReady ? (
        <div className="mt-6 rounded-lg border border-cinnabar/20 bg-cinnabar/10 p-4 text-sm leading-7 text-cinnabar">
          数据库暂未连接。启动 PostgreSQL 并完成 Prisma 迁移后，询盘会显示在这里。
        </div>
      ) : null}

      <div className="mt-8">
        <InquiriesTable inquiries={inquiries} />
      </div>
    </main>
  );
}

