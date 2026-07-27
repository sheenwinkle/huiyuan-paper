import type { InquiryInput } from "@/lib/validators/inquiry";

export type InquiryRecord = InquiryInput & {
  id: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

const globalForInquiries = globalThis as unknown as {
  huiyuanInquiries?: InquiryRecord[];
};

export const inquiries = globalForInquiries.huiyuanInquiries ?? [];

if (!globalForInquiries.huiyuanInquiries) {
  globalForInquiries.huiyuanInquiries = inquiries;
}

export function addInquiry(input: InquiryInput) {
  const record: InquiryRecord = {
    ...input,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(record);
  return record;
}

export function listInquiries() {
  return inquiries;
}

