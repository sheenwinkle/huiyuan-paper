import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { listInquiries } from "@/lib/data/inquiries-store";
import { prisma } from "@/lib/db/prisma";
import { isDemoMode } from "@/lib/runtime/demo-mode";

const headers = [
  "提交时间",
  "客户姓名",
  "电话",
  "微信",
  "地区",
  "产品",
  "数量",
  "需求备注",
  "状态"
];

const statusLabels: Record<string, string> = {
  NEW: "待跟进",
  CONTACTED: "已联系",
  CLOSED: "已关闭",
  new: "待跟进",
  contacted: "已联系",
  closed: "已关闭"
};

type ExportInquiry = {
  createdAt: string | Date;
  name: string;
  phone: string;
  wechat?: string | null;
  region?: string | null;
  product: string;
  quantity?: string | null;
  note?: string | null;
  status: string;
};

function csvCell(value: string | null | undefined) {
  const text = value ?? "";
  return `"${text.replaceAll('"', '""')}"`;
}

function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Shanghai"
  }).format(date);
}

function toCsv(inquiries: ExportInquiry[]) {
  const rows = inquiries.map((inquiry) =>
    [
      formatDate(inquiry.createdAt),
      inquiry.name,
      inquiry.phone,
      inquiry.wechat,
      inquiry.region,
      inquiry.product,
      inquiry.quantity,
      inquiry.note,
      statusLabels[inquiry.status] ?? inquiry.status
    ].map(csvCell).join(",")
  );

  return `\uFEFF${[headers.map(csvCell).join(","), ...rows].join("\n")}`;
}

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const inquiries = isDemoMode()
    ? listInquiries()
    : await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 1000
      });

  return new NextResponse(toCsv(inquiries), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="huiyuan-inquiries-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`
    }
  });
}
