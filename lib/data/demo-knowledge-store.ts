import type { CreateKnowledgeDocumentInput, UpdateKnowledgeDocumentInput } from "@/lib/validators/knowledge";

export type DemoKnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const globalForKnowledge = globalThis as unknown as {
  huiyuanDemoKnowledge?: DemoKnowledgeDocument[];
};

const now = new Date().toISOString();

export const demoKnowledge =
  globalForKnowledge.huiyuanDemoKnowledge ?? [
    {
      id: "demo-knowledge-basic",
      title: "慧缘纸制品基础客服口径",
      content:
        "慧缘纸制品位于江苏镇江丹阳市丹北镇埤城镇，主营抽泡纸，也覆盖黄纸/烧纸、元宝纸、锡箔纸、纸扎、竹浆纸、板纸和定制加工。服务范围以长三角批发商和零售商为主。涉及价格、规格、发货、账期和库存时，引导客户留下微信或手机号，由人工确认。",
      isActive: true,
      createdAt: now,
      updatedAt: now
    }
  ];

if (!globalForKnowledge.huiyuanDemoKnowledge) {
  globalForKnowledge.huiyuanDemoKnowledge = demoKnowledge;
}

export function listDemoKnowledge() {
  return demoKnowledge.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createDemoKnowledge(input: CreateKnowledgeDocumentInput) {
  const timestamp = new Date().toISOString();
  const document = {
    id: crypto.randomUUID(),
    title: input.title,
    content: input.content,
    isActive: input.isActive,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  demoKnowledge.unshift(document);
  return document;
}

export function updateDemoKnowledge(id: string, input: UpdateKnowledgeDocumentInput) {
  const document = demoKnowledge.find((item) => item.id === id);
  if (!document) return null;
  if (input.title !== undefined) document.title = input.title;
  if (input.content !== undefined) document.content = input.content;
  if (input.isActive !== undefined) document.isActive = input.isActive;
  document.updatedAt = new Date().toISOString();
  return document;
}

export function deleteDemoKnowledge(id: string) {
  const index = demoKnowledge.findIndex((item) => item.id === id);
  if (index === -1) return false;
  demoKnowledge.splice(index, 1);
  return true;
}

