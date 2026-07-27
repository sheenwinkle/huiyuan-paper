"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginState = "idle" | "submitting" | "error";

export function AdminLoginForm() {
  const router = useRouter();
  const [state, setState] = useState<LoginState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      })
    });

    if (!response.ok) {
      setState("error");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-lg bg-white p-6 shadow-soft">
      <label className="grid gap-2 text-sm font-medium text-ink">
        管理员邮箱
        <input
          name="email"
          type="email"
          required
          className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
          placeholder="admin@example.com"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-ink">
        管理员密码
        <input
          name="password"
          type="password"
          required
          className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
          placeholder="change-me"
        />
      </label>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="focus-ring rounded-md bg-cinnabar px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#87291f] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "submitting" ? "登录中..." : "登录后台"}
      </button>
      {state === "error" ? (
        <p className="text-sm text-cinnabar" role="status">
          登录失败，请检查邮箱和密码。
        </p>
      ) : null}
      <p className="text-xs leading-6 text-graphite/60">
        本地默认账号来自环境变量；如果未配置，使用 admin@example.com / change-me。
        上线前必须更换密码和 AUTH_SECRET。
      </p>
    </form>
  );
}

