"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="focus-ring rounded-md border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-black/5"
    >
      退出登录
    </button>
  );
}

