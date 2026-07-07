import { cookies } from "next/headers";

const RATE_LIMIT_COOKIE_PREFIX = "jit_login_rate_limit";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function getLoginAttemptCount() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(RATE_LIMIT_COOKIE_PREFIX)?.value;

  if (!cookie) return 0;

  try {
    const [count, expiresAt] = cookie.split(":").map((value) => Number(value));
    if (!Number.isFinite(count) || !Number.isFinite(expiresAt)) return 0;

    if (Date.now() > expiresAt) {
      cookieStore.delete(RATE_LIMIT_COOKIE_PREFIX);
      return 0;
    }

    return count;
  } catch {
    cookieStore.delete(RATE_LIMIT_COOKIE_PREFIX);
    return 0;
  }
}

export async function markLoginAttemptFailed() {
  const cookieStore = await cookies();
  const current = await getLoginAttemptCount();
  const nextCount = current + 1;
  const expiresAt = Date.now() + WINDOW_MS;

  cookieStore.set(RATE_LIMIT_COOKIE_PREFIX, `${nextCount}:${expiresAt}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15
  });

  return nextCount;
}

export async function resetLoginAttempts() {
  const cookieStore = await cookies();
  cookieStore.delete(RATE_LIMIT_COOKIE_PREFIX);
}
