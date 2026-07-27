import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupportAgentProvider } from "@/lib/ai/support-agent";

const chatRequestSchema = z.object({
  message: z.string().trim().max(1000)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = chatRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "INVALID_CHAT_MESSAGE" }, { status: 400 });
  }

  const provider = getSupportAgentProvider();
  const answer = await provider.reply({ message: result.data.message });

  return NextResponse.json({
    ...answer,
    provider: provider.name
  });
}
