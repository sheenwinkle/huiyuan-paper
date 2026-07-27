"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "您好，我是慧缘纸制品的在线客服。您可以先告诉我想咨询的产品、数量和地区，专业报价会由人工确认。"
  }
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get("message") || "").trim();

    if (!message) {
      return;
    }

    setMessages((current) => [...current, { role: "user", content: message }]);
    form.reset();
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "客服接口暂时不可用。请通过询盘表单留下联系方式，人工会继续跟进。"
        }
      ]);
      setLoading(false);
      return;
    }

    const data = (await response.json()) as { reply: string };
    setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <section className="mb-3 flex h-[520px] w-[min(360px,calc(100vw-40px))] flex-col rounded-lg border border-black/10 bg-white shadow-soft">
          <header className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-ink">慧缘 AI 客服</div>
              <div className="text-xs text-graphite/60">简单咨询 + 引导人工跟进</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-md px-2 py-1 text-sm text-graphite hover:bg-black/5"
              aria-label="关闭客服"
            >
              ×
            </button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-paper/60 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-cinnabar text-white"
                    : "bg-white text-graphite"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[88%] rounded-lg bg-white px-3 py-2 text-sm text-graphite">
                正在整理回复...
              </div>
            ) : null}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-black/10 p-3">
            <input
              name="message"
              className="focus-ring min-w-0 flex-1 rounded-md border border-black/15 px-3 py-2 text-sm"
              placeholder="输入产品、数量或地区"
            />
            <button
              type="submit"
              className="focus-ring rounded-md bg-cinnabar px-4 py-2 text-sm font-semibold text-white"
            >
              发送
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring rounded-md bg-cinnabar px-5 py-3 text-sm font-semibold text-white shadow-soft"
      >
        AI 客服
      </button>
    </div>
  );
}

