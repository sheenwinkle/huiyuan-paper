"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type KnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  updatedAt: string;
};

type LoadState = "loading" | "ready" | "error";
type SubmitState = "idle" | "submitting" | "success" | "error";

export function KnowledgeManagement() {
  const router = useRouter();
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function loadDocuments() {
    setLoadState("loading");
    const response = await fetch("/api/admin/knowledge", { cache: "no-store" });

    if (!response.ok) {
      setLoadState("error");
      return;
    }

    const data = (await response.json()) as { documents: KnowledgeDocument[] };
    setDocuments(data.documents);
    setLoadState("ready");
  }

  useEffect(() => {
    void loadDocuments();
  }, []);

  async function refreshAfterChange() {
    await loadDocuments();
    router.refresh();
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/admin/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") || ""),
        content: String(formData.get("content") || ""),
        isActive: true
      })
    });

    if (!response.ok) {
      setSubmitState("error");
      return;
    }

    form.reset();
    setSubmitState("success");
    await refreshAfterChange();
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>, documentId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/admin/knowledge/${documentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") || ""),
        content: String(formData.get("content") || "")
      })
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  async function handleToggle(document: KnowledgeDocument) {
    const response = await fetch(`/api/admin/knowledge/${document.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !document.isActive })
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  async function handleDelete(document: KnowledgeDocument) {
    if (!window.confirm(`确认删除知识文档「${document.title}」吗？`)) {
      return;
    }

    const response = await fetch(`/api/admin/knowledge/${document.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      await refreshAfterChange();
    }
  }

  if (loadState === "error") {
    return (
      <div className="rounded-lg border border-cinnabar/20 bg-cinnabar/10 p-4 text-sm leading-7 text-cinnabar">
        知识库暂时不可用。请确认 PostgreSQL 已启动，并已运行 Prisma 迁移。
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <form onSubmit={handleCreate} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-ink">新增客服知识</h2>
          <p className="mt-2 text-sm leading-7 text-graphite/70">
            写给 AI 客服参考，不要写虚假产能、固定报价或未经确认的承诺。
          </p>
        </div>
        <input
          name="title"
          required
          className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
          placeholder="例如：抽泡纸咨询口径"
        />
        <textarea
          name="content"
          required
          rows={6}
          className="focus-ring resize-none rounded-md border border-black/15 px-3 py-3 text-sm"
          placeholder="例如：抽泡纸是慧缘纸制品主打产品，面向长三角批发和零售客户。涉及价格、发货和规格时，引导客户留下微信或手机号，由人工确认。"
        />
        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="focus-ring rounded-md bg-cinnabar px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {submitState === "submitting" ? "保存中..." : "保存知识"}
        </button>
        {submitState === "success" ? <p className="text-sm text-green-700">知识已保存。</p> : null}
        {submitState === "error" ? <p className="text-sm text-cinnabar">保存失败，请检查数据库状态。</p> : null}
      </form>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-semibold text-ink">当前知识库</h2>
            <p className="mt-2 text-sm leading-7 text-graphite/70">
              启用的资料会参与 AI 客服检索；停用后不再用于回复。
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadDocuments()}
            className="focus-ring rounded-md border border-black/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/5"
          >
            刷新
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {loadState === "loading" ? (
            <p className="text-sm text-graphite/65">正在读取知识库...</p>
          ) : documents.length === 0 ? (
            <p className="rounded-md bg-paper p-4 text-sm text-graphite/70">
              暂无知识文档。建议先录入主营产品、服务范围、价格边界和人工转接口径。
            </p>
          ) : (
            documents.map((document) => (
              <form
                key={document.id}
                onSubmit={(event) => void handleUpdate(event, document.id)}
                className="grid gap-3 rounded-lg border border-black/10 p-5"
              >
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <span className={`w-fit rounded-md px-2 py-1 text-xs font-semibold ${
                    document.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-black/10 text-graphite"
                  }`}>
                    {document.isActive ? "已启用" : "已停用"}
                  </span>
                  <span className="text-xs text-graphite/55">
                    更新于 {new Intl.DateTimeFormat("zh-CN", {
                      dateStyle: "short",
                      timeStyle: "short"
                    }).format(new Date(document.updatedAt))}
                  </span>
                </div>
                <input
                  name="title"
                  defaultValue={document.title}
                  required
                  className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm font-semibold"
                />
                <textarea
                  name="content"
                  defaultValue={document.content}
                  required
                  rows={5}
                  className="focus-ring resize-none rounded-md border border-black/15 px-3 py-2 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <button type="submit" className="focus-ring rounded-md bg-cinnabar px-3 py-2 text-sm font-semibold text-white">
                    保存
                  </button>
                  <button type="button" onClick={() => void handleToggle(document)} className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm font-semibold text-ink hover:bg-black/5">
                    {document.isActive ? "停用" : "启用"}
                  </button>
                  <button type="button" onClick={() => void handleDelete(document)} className="focus-ring rounded-md border border-black/15 px-3 py-2 text-sm font-semibold text-ink hover:bg-black/5">
                    删除
                  </button>
                </div>
              </form>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

