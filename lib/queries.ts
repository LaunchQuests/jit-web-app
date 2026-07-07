import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Filters = {
  salespersonName?: string;
  date?: string;
  customerName?: string;
  phoneNumber?: string;
  search?: string;
};

export async function getShowroomFollowUps(showroomId: string, filters: Filters) {
  const where: Prisma.FollowUpWhereInput = {
    showroomId,
    ...(filters.salespersonName
      ? {
          salespersonName: {
            contains: filters.salespersonName,
            mode: "insensitive"
          }
        }
      : {}),
    ...(filters.customerName
      ? {
          customerName: {
            contains: filters.customerName,
            mode: "insensitive"
          }
        }
      : {}),
    ...(filters.phoneNumber
      ? {
          phoneNumber: {
            contains: filters.phoneNumber
          }
        }
      : {}),
    ...(filters.date
      ? {
          date: {
            gte: new Date(filters.date),
            lt: new Date(new Date(filters.date).getTime() + 86400000)
          }
        }
      : {}),
    ...(filters.search
      ? {
          OR: [
            { customerName: { contains: filters.search, mode: "insensitive" } },
            { phoneNumber: { contains: filters.search } },
            { remarks: { contains: filters.search, mode: "insensitive" } },
            { salespersonName: { contains: filters.search, mode: "insensitive" } }
          ]
        }
      : {})
  };

  return prisma.followUp.findMany({
    where,
    orderBy: [{ date: "desc" }, { createdAt: "desc" }]
  });
}

export async function getAllShowrooms() {
  return prisma.showroom.findMany({
    include: {
      users: true,
      _count: {
        select: {
          followUps: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}