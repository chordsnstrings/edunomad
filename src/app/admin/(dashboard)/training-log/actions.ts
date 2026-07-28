"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function addTrainingAction(formData: FormData) {
  await requireAdmin();
  await prisma.trainingLog.create({ data: { staffName: String(formData.get("staffName") ?? ""), topic: String(formData.get("topic") ?? "") } });
  redirect("/admin/training-log");
}
