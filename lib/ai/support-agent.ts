import { retrieveKnowledge } from "@/lib/ai/knowledge-retrieval";
import {
  createGoogleGeminiSupportReply,
  isGoogleGeminiConfigured
} from "@/lib/ai/google-gemini-support";
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

export const googleGeminiProvider: SupportAgentProvider = {
  name: "google-gemini",
  async reply(input) {
    return createGoogleGeminiSupportReply(input.message);
  }
};

export function getSupportAgentProvider() {
  const provider = (process.env.AI_PROVIDER || "rules").toLowerCase();

  if ((provider === "google" || provider === "gemini") && isGoogleGeminiConfigured()) {
    return googleGeminiProvider;
  }

  return ruleAndKnowledgeProvider;
}
