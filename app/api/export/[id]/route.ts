import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildFollowUpsWorkbook } from "@/lib/export";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireSession("SUPER_ADMIN");

  const { id } = await params;

  const showroom = await prisma.showroom.findUnique({
    where: { id }
  });

  if (!showroom) {
    return new NextResponse("Showroom not found", { status: 404 });
  }

  const rows = await prisma.followUp.findMany({
    where: { showroomId: id },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }]
  });

  const workbook = buildFollowUpsWorkbook(rows);

  return new NextResponse(workbook, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${showroom.storeName.replace(/\s+/g, "-").toLowerCase()}-followups.xlsx"`
    }
  });
}