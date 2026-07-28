import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(1).max(50),
  phone: z.string().trim().min(6).max(30),
  wechat: z.string().trim().max(60).optional().default(""),
  region: z.string().trim().max(80).optional().default(""),
  product: z.string().trim().min(1).max(80),
  quantity: z.string().trim().max(120).optional().default(""),
  note: z.string().trim().max(1000).optional().default(""),
  customerType: z
    .enum(["UNKNOWN", "RETAILER", "WHOLESALER"])
    .optional()
    .default("UNKNOWN"),
  source: z.string().trim().max(40).optional().default("website")
});

export type InquiryInput = z.infer<typeof inquirySchema>;
