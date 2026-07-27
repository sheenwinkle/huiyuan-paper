import { prisma } from "@/lib/db/prisma";

export type RetrievedKnowledge = {
  title: string;
  content: string;
};

function tokenize(input: string) {
  const compact = input.toLowerCase();
  const chineseTokens = compact.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  const asciiTokens = compact.match(/[a-z0-9]{2,}/g) || [];
  return [...chineseTokens, ...asciiTokens];
}

function scoreDocument(queryTokens: string[], title: string, content: string) {
  const haystack = `${title}\n${content}`.toLowerCase();
  return queryTokens.reduce((score, token) => {
    return haystack.includes(token) ? score + 1 : score;
  }, 0);
}

export async function retrieveKnowledge(message: string, limit = 3): Promise<RetrievedKnowledge[]> {
  const queryTokens = tokenize(message);

  if (queryTokens.length === 0) {
    return [];
  }

  try {
    const documents = await prisma.knowledgeDocument.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
      take: 50
    });

    return documents
      .map((document) => ({
        document,
        score: scoreDocument(queryTokens, document.title, document.content)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ document }) => ({
        title: document.title,
        content: document.content
      }));
  } catch {
    return [];
  }
}

