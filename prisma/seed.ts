import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { username: "superadmin" } });

  if (existing) {
    console.log("Super admin already exists. Updating password if needed.");
    const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!", 12);
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, role: "SUPER_ADMIN", status: "ACTIVE" }
    });
    return;
  }

  const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!", 12);

  await prisma.user.create({
    data: {
      username: process.env.SUPER_ADMIN_USERNAME || "superadmin",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE"
    }
  });

  console.log("Super admin created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
