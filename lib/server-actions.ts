"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authenticate, clearSession, createSession, hashPassword, requireSession } from "@/lib/auth";
import { getOrCreateCsrfToken, verifyCsrfToken } from "@/lib/csrf";
import { markLoginAttemptFailed, resetLoginAttempts, getLoginAttemptCount } from "@/lib/rate-limit";
import { followUpSchema, loginSchema, showroomSchema } from "@/lib/validations";

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter valid username and password." };

  const attempts = await getLoginAttemptCount();
  if (attempts >= 5) {
    return { error: "Too many failed login attempts. Please wait 15 minutes before trying again." };
  }

  const csrfValid = await verifyCsrfToken(formData.get("csrfToken"));
  if (!csrfValid) {
    await markLoginAttemptFailed();
    return { error: "Invalid security token. Please refresh and try again." };
  }

  const user = await authenticate(parsed.data.username, parsed.data.password);
  if (!user) {
    await markLoginAttemptFailed();
    return { error: "Invalid credentials or inactive account." };
  }

  await resetLoginAttempts();
  await createSession(user);
  redirect(user.role === "SUPER_ADMIN" ? "/admin" : "/follow-ups");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function createShowroomAction(_: unknown, formData: FormData) {
  await requireSession("SUPER_ADMIN");

  const csrfValid = await verifyCsrfToken(formData.get("csrfToken"));
  if (!csrfValid) return { error: "Invalid security token. Please refresh and try again." };

  const parsed = showroomSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please fill all showroom details correctly." };

  const { storeName, username, password, status } = parsed.data;
  const passwordHash = await hashPassword(password);

  await prisma.showroom.create({
    data: {
      storeName,
      status,
      users: {
        create: {
          username,
          passwordHash,
          role: "SHOWROOM",
          status
        }
      }
    }
  });

  revalidatePath("/admin");
  return { success: "Showroom created." };
}

export async function deleteShowroomAction(showroomId: string) {
  await requireSession("SUPER_ADMIN");
  await prisma.showroom.delete({ where: { id: showroomId } });
  revalidatePath("/admin");
}

export async function createFollowUpAction(_: unknown, formData: FormData) {
  const session = await requireSession("SHOWROOM");

  const csrfValid = await verifyCsrfToken(formData.get("csrfToken"));
  if (!csrfValid) return { error: "Invalid security token. Please refresh and try again." };

  const parsed = followUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please check the form fields." };

  const data = parsed.data;

  await prisma.followUp.create({
    data: {
      showroomId: session.showroomId!,
      date: new Date(data.date),
      salespersonName: data.salespersonName,
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      remarks: data.remarks,
      lastFollowupDate: data.lastFollowupDate ? new Date(data.lastFollowupDate) : null
    }
  });

  revalidatePath("/follow-ups");
  return { success: "Follow-up saved." };
}

export async function updateFollowUpAction(id: string, _: unknown, formData: FormData) {
  const session = await requireSession("SHOWROOM");

  const csrfValid = await verifyCsrfToken(formData.get("csrfToken"));
  if (!csrfValid) return { error: "Invalid security token. Please refresh and try again." };

  const parsed = followUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please check the form fields." };

  const existing = await prisma.followUp.findUnique({ where: { id } });
  if (!existing || existing.showroomId !== session.showroomId) {
    return { error: "Record not found." };
  }

  const data = parsed.data;

  await prisma.followUp.update({
    where: { id },
    data: {
      date: new Date(data.date),
      salespersonName: data.salespersonName,
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      remarks: data.remarks,
      lastFollowupDate: data.lastFollowupDate ? new Date(data.lastFollowupDate) : null
    }
  });

  revalidatePath("/follow-ups");
  return { success: "Follow-up updated." };
}

export async function deleteFollowUpAction(id: string) {
  const session = await requireSession("SHOWROOM");

  const existing = await prisma.followUp.findUnique({ where: { id } });
  if (!existing || existing.showroomId !== session.showroomId) return;

  await prisma.followUp.delete({ where: { id } });
  revalidatePath("/follow-ups");
}