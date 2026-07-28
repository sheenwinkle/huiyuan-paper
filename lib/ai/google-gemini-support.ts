import { retrieveKnowledge, type RetrievedKnowledge } from "@/lib/ai/knowledge-retrieval";
import { createSupportReply, type ChatReply } from "@/lib/ai/rule-based-support";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";

type GeminiGenerateContentResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
};

function getGoogleApiKey() {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || "";
}

function getGoogleModel() {
  return process.env.GOOGLE_GEMINI_MODEL || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
}

export function isGoogleGeminiConfigured() {
  return getGoogleApiKey().trim().length > 0;
}

function formatKnowledge(knowledge: RetrievedKnowledge[]) {
  if (knowledge.length === 0) {
    return "暂无命中的后台知识库资料。";
  }

  return knowledge
    .map((item, index) => `${index + 1}. ${item.title}\n${item.content}`)
    .join("\n\n")
    .slice(0, 1800);
}

function shouldRecommendHandoff(message: string, reply: string) {
  const text = `${message}\n${reply}`;
  return /微信|手机号|电话|联系|人工|报价|价格|运费|发货|库存|定制|批发|下单/.test(text);
}

function buildPrompt(message: string, knowledge: RetrievedKnowledge[]) {
  return `你是丹阳市丹北镇慧缘纸制品的在线客服，服务对象主要是长三角批发商和零售商。

业务背景：
- 工厂位于江苏镇江丹阳市丹北镇埤城镇。
- 主打抽泡纸，也经营纸扎、竹浆纸、板纸、黄纸、烧纸、元宝纸、锡箔纸等祭祀用纸加工和批发。
- 品牌调性是传统、可信、三代世家造纸，同时具备现代工厂式生产和销售能力。

回答规则：
- 必须使用简体中文。
- 每次回复控制在 160 个中文字符以内。
- 不要编造具体价格、库存、账期、运输时效或联系方式。
- 遇到价格、发货、库存、规格、定制、长期批发等问题，引导客户留下微信或手机号，由人工确认。
- 如果客户需求不清楚，优先询问产品类别、数量、发货地区、客户类型。
- 可以参考后台知识库，但不要说“根据知识库”这种技术词。

后台资料：
${formatKnowledge(knowledge)}

客户消息：
${message}

请直接输出客服回复，不要输出解释。`;
}

export async function createGoogleGeminiSupportReply(message: string): Promise<ChatReply> {
  const knowledge = await retrieveKnowledge(message);
  const fallback = () => createSupportReply(message, { knowledge });
  const apiKey = getGoogleApiKey().trim();

  if (!apiKey) {
    return fallback();
  }

  const model = getGoogleModel();
  const url = `${GEMINI_API_BASE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(message, knowledge) }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 220
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      return fallback();
    }

    const data = (await response.json()) as GeminiGenerateContentResponse;
    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return fallback();
    }

    return {
      reply,
      handoffRecommended: shouldRecommendHandoff(message, reply)
    };
  } catch {
    return fallback();
  } finally {
    clearTimeout(timeout);
  }
}
