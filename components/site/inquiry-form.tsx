"use client";

import { FormEvent, useState } from "react";

const productOptions = [
  "抽泡纸",
  "黄纸/烧纸",
  "元宝纸",
  "锡箔纸",
  "纸扎",
  "竹浆纸",
  "板纸",
  "定制加工",
  "其他"
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      wechat: String(formData.get("wechat") || ""),
      region: String(formData.get("region") || ""),
      product: String(formData.get("product") || ""),
      quantity: String(formData.get("quantity") || ""),
      note: String(formData.get("note") || ""),
      customerType: String(formData.get("customerType") || "UNKNOWN")
    };

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setState("error");
      setMessage("提交失败，请检查姓名、电话和产品需求后重试。");
      return;
    }

    event.currentTarget.reset();
    setState("success");
    setMessage("已收到询盘。后续后台会展示这条线索，人工销售可继续跟进。");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          姓名
          <input
            name="name"
            required
            className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
            placeholder="怎么称呼您"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          手机
          <input
            name="phone"
            required
            className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
            placeholder="方便人工跟进"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          微信
          <input
            name="wechat"
            className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
            placeholder="可选"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          所在地区
          <input
            name="region"
            className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
            placeholder="例如：苏州、上海、杭州"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          产品
          <select
            name="product"
            required
            className="focus-ring rounded-md border border-black/15 bg-white px-3 py-3 text-sm"
          >
            <option value="">请选择</option>
            {productOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          预计数量
          <input
            name="quantity"
            className="focus-ring rounded-md border border-black/15 px-3 py-3 text-sm"
            placeholder="例如：长期供货、100 箱、按车发"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-ink">
        客户类型
        <select
          name="customerType"
          className="focus-ring rounded-md border border-black/15 bg-white px-3 py-3 text-sm"
          defaultValue="UNKNOWN"
        >
          <option value="UNKNOWN">暂不确定</option>
          <option value="WHOLESALER">批发商</option>
          <option value="RETAILER">零售商</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-ink">
        需求说明
        <textarea
          name="note"
          rows={4}
          className="focus-ring resize-none rounded-md border border-black/15 px-3 py-3 text-sm"
          placeholder="请描述规格、用途、发货地区或其他要求"
        />
      </label>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="focus-ring rounded-md bg-cinnabar px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#87291f] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "submitting" ? "提交中..." : "提交询盘"}
      </button>
      {message ? (
        <p
          className={`text-sm ${state === "error" ? "text-cinnabar" : "text-green-700"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
