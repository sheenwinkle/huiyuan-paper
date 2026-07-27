import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/products", label: "产品中心" },
  { href: "/factory", label: "工厂实力" },
  { href: "/culture", label: "企业文化" },
  { href: "/contact", label: "在线咨询" },
  { href: "/admin", label: "后台" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/95 backdrop-blur">
      <div className="section-shell flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="min-w-0">
          <div className="text-sm text-cinnabar">丹阳市丹北镇</div>
          <div className="truncate text-lg font-semibold tracking-normal text-ink">
            慧缘纸制品
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-graphite transition hover:bg-black/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="focus-ring rounded-md bg-cinnabar px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#87291f]"
        >
          立即询盘
        </Link>
      </div>
    </header>
  );
}

