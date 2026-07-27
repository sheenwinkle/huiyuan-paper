import { NextResponse } from "next/server";
import { z } from "zod";
import { adminSessionCookie, createAdminToken } from "@/lib/auth/admin-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "INVALID_LOGIN" }, { status: 400 });
  }

  const expectedEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const expectedPassword = process.env.ADMIN_PASSWORD || "change-me";

  if (
    result.data.email !== expectedEmail ||
    result.data.password !== expectedPassword
  ) {
    return NextResponse.json({ error: "BAD_CREDENTIALS" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, createAdminToken(result.data.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/"
  });

  return response;
}

