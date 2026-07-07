import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const showroomSchema = z.object({
  storeName: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9._-]+$/),
  password: z.string().min(8),
  status: z.enum(["ACTIVE", "INACTIVE"])
});

export const followUpSchema = z.object({
  date: z.string().min(1),
  salespersonName: z.string().min(2).max(60),
  customerName: z.string().min(2).max(80),
  phoneNumber: z.string().regex(/^\d{10}$/),
  remarks: z.string().min(2).max(1000),
  lastFollowupDate: z.string().optional().nullable()
});