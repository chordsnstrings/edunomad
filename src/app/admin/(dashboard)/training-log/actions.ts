"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { text } from "@/lib/form";

export async function addTrainingAction(formData: FormData) {
  await requireAdmin();
  await prisma.trainingLog.create({ data: { staffName: text(formData, "staffName"), topic: text(formData, "topic") } });
  redirect("/admin/training-log");
}
