import Link from "next/link";
import {
  InquiriesTable,
  type CustomerType,
  type InquiryPriority,
  type InquiryRow,
  type InquiryStatus
} from "@/components/admin/inquiries-table";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { listInquiries } from "@/lib/data/inquiries-store";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/runtime/demo-mode";

export const dynamic = "force-dynamic";

function normalizeDemoStatus(status: string): InquiryStatus {
  if (status === "contacted") return "CONTACTED";
  if (status === "closed") return "CLOSED";
  return "NEW";
}

function normalizePriority(priority?: string): InquiryPriority {
  if (priority === "LOW" || priority === "HIGH") return priority;
  return "NORMAL";
}

function normalizeCustomerType(customerType?: string): CustomerType {
  if (customerType === "RETAILER" || customerType === "WHOLESALER") {
    return customerType;
  }
  return "UNKNOWN";
}

async function getInquiries() {
  if (isDemoMode()) {
    return {
      inquiries: listInquiries().map((inquiry) => ({
        ...inquiry,
        status: normalizeDemoStatus(inquiry.status),
        priority: normalizePriority(inquiry.priority),
        customerType: normalizeCustomerType(inquiry.customerType),
        updatedAt: inquiry.updatedAt || inquiry.createdAt
      })),
      databaseReady: true
    };
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return {
      inquiries: inquiries.map((inquiry) => ({
        ...inquiry,
        createdAt: inquiry.createdAt.toISOString(),
        updatedAt: inquiry.updatedAt.toISOString(),
        nextFollowUpAt: inquiry.nextFollowUpAt?.toISOString() || null,
        lastContactedAt: inquiry.lastContactedAt?.toISOString() || null
      })),
      databaseReady: true
    };
  } catch {
    return { inquiries: [], databaseReady: false };
  }
}

function getCrmMetrics(inquiries: InquiryRow[]) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return [
    {
      label: "总线索",
      value: inquiries.length
    },
    {
      label: "待跟进",
      value: inquiries.filter((inquiry) => inquiry.status === "NEW").length
    },
    {
      label: "高优先级",
      value: inquiries.filter((inquiry) => inquiry.priority === "HIGH").length
    },
    {
      label: "今日/超期跟进",
      value: inquiries.filter((inquiry) => {
        if (!inquiry.nextFollowUpAt || inquiry.status === "CLOSED") {
          return false;
        }
        const date = new Date(inquiry.nextFollowUpAt);
        return !Number.isNaN(date.getTime()) && date <= today;
      }).length
    }
  ];
}

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const { inquiries, databaseReady } = await getInquiries();
  const metrics = getCrmMetrics(inquiries);

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
          <a
            href="/api/admin/inquiries/export"
            className="focus-ring rounded-md border border-black/15 bg-white px-4 py-2 text-center text-sm font-semibold text-ink"
          >
            导出 CSV
          </a>
          <Link href="/admin" className="focus-ring rounded-md bg-cinnabar px-4 py-2 text-center text-sm font-semibold text-white">
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

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="text-sm text-graphite/65">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold text-ink">{metric.value}</div>
          </article>
        ))}
      </section>

      <div className="mt-8">
        <InquiriesTable inquiries={inquiries} />
      </div>
    </main>
  );
}
