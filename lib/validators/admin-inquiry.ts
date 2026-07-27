import { z } from "zod";

export const updateInquirySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"])
});

export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;

