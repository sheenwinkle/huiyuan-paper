import { z } from "zod";

export const createKnowledgeDocumentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(5000),
  isActive: z.boolean().optional().default(true)
});

export const updateKnowledgeDocumentSchema = createKnowledgeDocumentSchema.partial();

export type CreateKnowledgeDocumentInput = z.infer<typeof createKnowledgeDocumentSchema>;
export type UpdateKnowledgeDocumentInput = z.infer<typeof updateKnowledgeDocumentSchema>;

