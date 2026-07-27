import Link from "next/link";
import { KnowledgeManagement } from "@/components/admin/knowledge-management";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/auth/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminKnowledgePage() {
  await requireAdmin();

  return (
    <main className="section-shell py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
        <div>
          <div className="text-sm font-semibold text-cinnabar">AI 知识库</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
            客服参考资料
          </h1>
          <p className="mt-3 text-sm leading-7 text-graphite/75">
            维护 AI 客服可引用的资料，让它先承接客户问题，再把价格、发货和规格确认交给人工。
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
        <KnowledgeManagement />
      </div>
    </main>
  );
}

