export type ChatReply = {
  reply: string;
  handoffRecommended: boolean;
};

type SupportReplyOptions = {
  knowledge?: {
    title: string;
    content: string;
  }[];
};

const productKeywords = [
  "抽泡纸",
  "黄纸",
  "烧纸",
  "元宝",
  "锡箔",
  "纸扎",
  "竹浆",
  "板纸",
  "定制"
];

export function createSupportReply(message: string, options: SupportReplyOptions = {}): ChatReply {
  const normalized = message.trim();
  const hasProduct = productKeywords.some((keyword) => normalized.includes(keyword));
  const asksPrice = /价格|多少钱|报价|便宜|批发价/.test(normalized);
  const asksLogistics = /发货|物流|运费|几天|送到|配送/.test(normalized);
  const knowledge = options.knowledge || [];
  const knowledgeSummary =
    knowledge.length > 0
      ? `根据已录入资料：${knowledge
          .map((item) => `${item.title}：${item.content}`)
          .join("；")
          .slice(0, 260)}。`
      : "";

  if (!normalized) {
    return {
      reply: "您好，请告诉我您想咨询的产品、数量和所在地区，我先帮您记录需求。",
      handoffRecommended: false
    };
  }

  if (asksPrice || asksLogistics) {
    return {
      reply:
        `${knowledgeSummary}这类问题需要结合规格、数量、地区和当天供货情况确认。我建议您留下手机号或微信，人工会按实际需求给您确认价格和发货方案。`,
      handoffRecommended: true
    };
  }

  if (hasProduct) {
    return {
      reply:
        `${knowledgeSummary}这个品类我们可以先沟通。方便的话请补充预计数量、发货地区、是否长期拿货，以及您的微信或手机号，后续由人工确认规格和供货细节。`,
      handoffRecommended: true
    };
  }

  if (knowledgeSummary) {
    return {
      reply: `${knowledgeSummary}如果您要进一步确认规格、价格或发货，请留下微信或手机号，人工会继续跟进。`,
      handoffRecommended: true
    };
  }

  return {
    reply:
      "您好，这里是慧缘纸制品在线客服。我们主营抽泡纸，也做黄纸、元宝纸、锡箔纸、纸扎、竹浆纸、板纸和定制加工。您可以说下要哪类产品、数量和地区，我先帮您整理给人工跟进。",
    handoffRecommended: false
  };
}
