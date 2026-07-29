"use server";

import { revalidatePath } from "next/cache";
import { requireStudent } from "@/lib/require-student";
import { cancelServiceRequest, requestService } from "@/lib/services";
import { text } from "@/lib/form";

/** Stage 9: a student asks for a partner service. Scoped to the caller's own
 *  student record — the id is never taken from the form. */
export async function requestServiceAction(formData: FormData) {
  const { student } = await requireStudent();
  const serviceType = text(formData, "serviceType");
  const notes = text(formData, "notes", 500);
  await requestService(student.id, serviceType, notes);
  revalidatePath("/app/predeparture");
}

export async function cancelServiceAction(formData: FormData) {
  const { student } = await requireStudent();
  await cancelServiceRequest(student.id, text(formData, "serviceType"));
  revalidatePath("/app/predeparture");
}
