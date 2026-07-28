import type { InquiryInput } from "@/lib/validators/inquiry";

export type InquiryRecord = InquiryInput & {
  id: string;
  status: "new" | "contacted" | "closed";
  priority: "LOW" | "NORMAL" | "HIGH";
  followUpNote: string | null;
  nextFollowUpAt: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
    priority: "NORMAL",
    followUpNote: null,
    nextFollowUpAt: null,
    lastContactedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inquiries.unshift(record);
  return record;
}

export function listInquiries() {
  return inquiries;
}

export function updateInquiryStatus(
  id: string,
  status: InquiryRecord["status"] | "NEW" | "CONTACTED" | "CLOSED"
) {
  return updateInquiry(id, { status });
}

export function updateInquiry(
  id: string,
  input: Partial<{
    status: InquiryRecord["status"] | "NEW" | "CONTACTED" | "CLOSED";
    priority: InquiryRecord["priority"];
    customerType: InquiryRecord["customerType"];
    followUpNote: string | null;
    nextFollowUpAt: string | Date | null;
    lastContactedAt: string | Date | null;
  }>
) {
  const inquiry = inquiries.find((item) => item.id === id);

  if (!inquiry) {
    return null;
  }

  if (input.status) {
    inquiry.status =
      input.status === "NEW"
        ? "new"
        : input.status === "CONTACTED"
          ? "contacted"
          : input.status === "CLOSED"
            ? "closed"
            : input.status;
  }

  if (input.priority) {
    inquiry.priority = input.priority;
  }

  if (input.customerType) {
    inquiry.customerType = input.customerType;
  }

  if (input.followUpNote !== undefined) {
    inquiry.followUpNote = input.followUpNote;
  }

  if (input.nextFollowUpAt !== undefined) {
    inquiry.nextFollowUpAt = normalizeDate(input.nextFollowUpAt);
  }

  if (input.lastContactedAt !== undefined) {
    inquiry.lastContactedAt = normalizeDate(input.lastContactedAt);
  }

  inquiry.updatedAt = new Date().toISOString();
  return inquiry;
}

function normalizeDate(value: string | Date | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
