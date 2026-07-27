import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="section-shell grid min-h-[calc(100vh-180px)] items-center py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="text-sm font-semibold text-cinnabar">管理后台</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
          登录慧缘纸制品后台
        </h1>
        <p className="mt-3 text-sm leading-7 text-graphite/75">
          后台用于查看客户询盘、管理产品资料和后续维护 AI 知识库。
        </p>
        <AdminLoginForm />
      </div>
    </main>
  );
}

