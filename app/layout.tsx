import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ChatWidget } from "@/components/chat/chat-widget";

export const metadata: Metadata = {
  title: "慧缘纸制品 | 丹阳纸制祭祀用品加工与批发",
  description:
    "丹阳市丹北镇慧缘纸制品，三代世家造纸，主营抽泡纸、黄纸、元宝纸、锡箔纸、纸扎、竹浆纸、板纸及定制加工，服务长三角批发与零售客户。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}

