"use client";

import { useRouter } from "next/navigation";

export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";
export type InquiryPriority = "LOW" | "NORMAL" | "HIGH";
export type CustomerType = "UNKNOWN" | "RETAILER" | "WHOLESALER";

export type InquiryRow = {
  id: string;
  name: string;
  phone: string;
  wechat: string | null;
  region: string | null;
  product: string;
  quantity: string | null;
  note: string | null;
  status: InquiryStatus;
  priority: InquiryPriority;
  customerType: CustomerType;
  followUpNote: string | null;
  nextFollowUpAt: string | null;
  lastContactedAt: string | null;
  createdAt: string;
};

const statusLabels: Record<InquiryStatus, string> = {
  NEW: "待跟进",
  CONTACTED: "已联系",
  CLOSED: "已关闭"
};

const priorityLabels: Record<InquiryPriority, string> = {
  LOW: "低",
  NORMAL: "普通",
  HIGH: "高"
};

const customerTypeLabels: Record<CustomerType, string> = {
  UNKNOWN: "未确认",
  RETAILER: "零售商",
  WHOLESALER: "批发商"
};

export function InquiriesTable({ inquiries }: { inquiries: InquiryRow[] }) {
  const router = useRouter();

  async function updateInquiry(
    inquiryId: string,
    payload: Partial<{
      status: InquiryStatus;
      priority: InquiryPriority;
      customerType: CustomerType;
      followUpNote: string | null;
      nextFollowUpAt: string | null;
    }>
  ) {
    const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
      <table className="w-full min-w-[1480px] border-collapse text-left text-sm">
        <thead className="bg-paper text-graphite">
          <tr>
            <th className="px-4 py-3 font-semibold">提交时间</th>
            <th className="px-4 py-3 font-semibold">客户</th>
            <th className="px-4 py-3 font-semibold">电话</th>
            <th className="px-4 py-3 font-semibold">微信</th>
            <th className="px-4 py-3 font-semibold">类型</th>
            <th className="px-4 py-3 font-semibold">产品</th>
            <th className="px-4 py-3 font-semibold">数量</th>
            <th className="px-4 py-3 font-semibold">地区</th>
            <th className="px-4 py-3 font-semibold">优先级</th>
            <th className="px-4 py-3 font-semibold">下次跟进</th>
            <th className="px-4 py-3 font-semibold">备注</th>
            <th className="px-4 py-3 font-semibold">跟进记录</th>
            <th className="px-4 py-3 font-semibold">状态</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-graphite/60" colSpan={13}>
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
                <td className="px-4 py-4">
                  <select
                    value={row.customerType}
                    onChange={(event) =>
                      void updateInquiry(row.id, {
                        customerType: event.target.value as CustomerType
                      })
                    }
                    className="focus-ring w-28 rounded-md border border-black/15 bg-white px-2 py-2 text-sm"
                    aria-label={`更新${row.name}的客户类型`}
                  >
                    {Object.entries(customerTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">{row.product}</td>
                <td className="px-4 py-4">{row.quantity || "-"}</td>
                <td className="px-4 py-4">{row.region || "-"}</td>
                <td className="px-4 py-4">
                  <select
                    value={row.priority}
                    onChange={(event) =>
                      void updateInquiry(row.id, {
                        priority: event.target.value as InquiryPriority
                      })
                    }
                    className="focus-ring w-24 rounded-md border border-black/15 bg-white px-2 py-2 text-sm"
                    aria-label={`更新${row.name}的优先级`}
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <input
                    type="date"
                    defaultValue={toDateInputValue(row.nextFollowUpAt)}
                    onBlur={(event) =>
                      void updateInquiry(row.id, {
                        nextFollowUpAt: event.currentTarget.value || null
                      })
                    }
                    className="focus-ring w-36 rounded-md border border-black/15 px-2 py-2 text-sm"
                    aria-label={`更新${row.name}的下次跟进时间`}
                  />
                </td>
                <td className="max-w-[220px] px-4 py-4 leading-6">{row.note || "-"}</td>
                <td className="px-4 py-4">
                  <textarea
                    defaultValue={row.followUpNote || ""}
                    onBlur={(event) =>
                      void updateInquiry(row.id, {
                        followUpNote: event.currentTarget.value || null
                      })
                    }
                    rows={3}
                    className="focus-ring w-60 resize-none rounded-md border border-black/15 px-2 py-2 text-sm leading-6"
                    placeholder="记录电话、微信、报价、规格确认情况"
                    aria-label={`更新${row.name}的跟进记录`}
                  />
                </td>
                <td className="px-4 py-4">
                  <select
                    value={row.status}
                    onChange={(event) =>
                      void updateInquiry(row.id, {
                        status: event.target.value as InquiryStatus
                      })
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

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}
