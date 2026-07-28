import { z } from "zod";

const nullableDate = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  return value;
}, z.coerce.date().nullable());

export const updateInquirySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).optional(),
  customerType: z.enum(["UNKNOWN", "RETAILER", "WHOLESALER"]).optional(),
  followUpNote: z.string().trim().max(1000).nullable().optional(),
  nextFollowUpAt: nullableDate.optional(),
  lastContactedAt: nullableDate.optional()
});

export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
