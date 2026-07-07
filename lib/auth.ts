import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "jit_portal_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export type SessionUser = {
  id: string;
  username: string;
  role: "SUPER_ADMIN" | "SHOWROOM";
  showroomId: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSession(user: SessionUser) {
  return new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
}

export async function createSession(user: SessionUser) {
  const token = await signSession(user);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify<SessionUser>(token, secret);
    return verified.payload;
  } catch {
    return null;
  }
}

export async function requireSession(role?: "SUPER_ADMIN" | "SHOWROOM") {
  const session = await getSession();

  if (!session) redirect("/login");

  if (role && session.role !== role) {
    redirect(session.role === "SUPER_ADMIN" ? "/admin" : "/follow-ups");
  }

  return session as SessionUser;
}

export async function authenticate(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user || user.status !== "ACTIVE") return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    showroomId: user.showroomId ?? null,
    status: user.status
  } satisfies SessionUser;
}