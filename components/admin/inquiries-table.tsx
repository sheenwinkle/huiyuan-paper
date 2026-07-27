"use client";

import { useRouter } from "next/navigation";

type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

type InquiryRow = {
  id: string;
  name: string;
  phone: string;
  wechat: string | null;
  region: string | null;
  product: string;
  quantity: string | null;
  note: string | null;
  status: InquiryStatus;
  createdAt: string;
};

const statusLabels: Record<InquiryStatus, string> = {
  NEW: "待跟进",
  CONTACTED: "已联系",
  CLOSED: "已关闭"
};

export function InquiriesTable({ inquiries }: { inquiries: InquiryRow[] }) {
  const router = useRouter();

  async function updateStatus(inquiryId: string, status: InquiryStatus) {
    const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
      <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
        <thead className="bg-paper text-graphite">
          <tr>
            <th className="px-4 py-3 font-semibold">提交时间</th>
            <th className="px-4 py-3 font-semibold">客户</th>
            <th className="px-4 py-3 font-semibold">电话</th>
            <th className="px-4 py-3 font-semibold">微信</th>
            <th className="px-4 py-3 font-semibold">产品</th>
            <th className="px-4 py-3 font-semibold">数量</th>
            <th className="px-4 py-3 font-semibold">地区</th>
            <th className="px-4 py-3 font-semibold">备注</th>
            <th className="px-4 py-3 font-semibold">状态</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-graphite/60" colSpan={9}>
                暂无询盘。可以先到在线咨询页提交一条测试数据。
              </td>
            </tr>
          ) : (
            inquiries.map((row) => (
              <tr key={row.id} className="border-t border-black/10 align-top">
                <td className="px-4 py-4">
                  {new Intl.DateTimeFormat("zh-CN", {
                    dateStyle: "short",
                    timeStyle: "short"
                  }).format(new Date(row.createdAt))}
                </td>
                <td className="px-4 py-4 font-medium text-ink">{row.name}</td>
                <td className="px-4 py-4">{row.phone}</td>
                <td className="px-4 py-4">{row.wechat || "-"}</td>
                <td className="px-4 py-4">{row.product}</td>
                <td className="px-4 py-4">{row.quantity || "-"}</td>
                <td className="px-4 py-4">{row.region || "-"}</td>
                <td className="max-w-[220px] px-4 py-4 leading-6">{row.note || "-"}</td>
                <td className="px-4 py-4">
                  <select
                    value={row.status}
                    onChange={(event) =>
                      void updateStatus(row.id, event.target.value as InquiryStatus)
                    }
                    className="focus-ring rounded-md border border-black/15 bg-white px-2 py-2 text-sm"
                    aria-label={`更新${row.name}的询盘状态`}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

