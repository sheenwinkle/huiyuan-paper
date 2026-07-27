import { retrieveKnowledge } from "@/lib/ai/knowledge-retrieval";
import { createSupportReply, type ChatReply } from "@/lib/ai/rule-based-support";

export type SupportAgentInput = {
  message: string;
};

export type SupportAgentProvider = {
  name: string;
  reply(input: SupportAgentInput): Promise<ChatReply>;
};

export const ruleAndKnowledgeProvider: SupportAgentProvider = {
  name: "rule-and-knowledge",
  async reply(input) {
    const knowledge = await retrieveKnowledge(input.message);
    return createSupportReply(input.message, { knowledge });
  }
};

export function getSupportAgentProvider() {
  return ruleAndKnowledgeProvider;
}

