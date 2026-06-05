"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function addTrainingAction(formData: FormData) {
  if (!(await getSession())) redirect("/admin/login");
  await prisma.trainingLog.create({ data: { staffName: String(formData.get("staffName") ?? ""), topic: String(formData.get("topic") ?? "") } });
  redirect("/admin/training-log");
}
