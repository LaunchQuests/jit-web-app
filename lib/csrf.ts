import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "jit_csrf_token";

export async function getOrCreateCsrfToken() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (existing) return existing;

  const token = randomBytes(32).toString("hex");
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return token;
}

export async function verifyCsrfToken(token: FormDataEntryValue | null | undefined) {
  const cookieStore = await cookies();
  const expected = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  return Boolean(expected && typeof token === "string" && token.length > 0 && token === expected);
}
