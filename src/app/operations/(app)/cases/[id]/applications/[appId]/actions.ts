"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { packageApplication, submitApplication } from "@/lib/submission";
import { encryptSecret } from "@/lib/crypto-vault";
import { Prisma } from "@prisma/client";
import { text, secret } from "@/lib/form";

async function ops() {
  const s = await getCurrentSession();
  if (!s || !["operations_team", "operations_manager"].includes(s.role)) redirect("/operations/login");
  return s;
}

export async function packageAction(formData: FormData) {
  await ops();
  const appId = text(formData, "appId");
  const caseId = text(formData, "caseId");
  await packageApplication(appId, formData.getAll("docIds").map(String));
  redirect(`/operations/cases/${caseId}/applications/${appId}`);
}

export async function storeCredentialAction(formData: FormData) {
  await ops();
  const institutionId = text(formData, "institutionId");
  const caseId = text(formData, "caseId");
  const appId = text(formData, "appId");
  await prisma.institutionCredential.upsert({
    where: { institutionId },
    create: { institutionId, portalUrl: text(formData, "portalUrl"), username: text(formData, "username"), passwordEnc: encryptSecret(secret(formData, "password")) },
    update: { portalUrl: text(formData, "portalUrl"), username: text(formData, "username"), passwordEnc: encryptSecret(secret(formData, "password")) },
  });
  redirect(`/operations/cases/${caseId}/applications/${appId}`);
}

export async function saveOfferAction(formData: FormData) {
  await ops();
  const appId = text(formData, "appId");
  const caseId = text(formData, "caseId");
  const offerUrl = text(formData, "offerUrl") || null;
  const conditions = text(formData, "conditions").split("\n").map((s) => s.trim()).filter(Boolean);
  await prisma.application.update({
    where: { id: appId },
    data: { offerUrl, conditions: conditions as unknown as Prisma.InputJsonValue },
  });
  redirect(`/operations/cases/${caseId}/applications/${appId}`);
}

export async function submitAction(formData: FormData) {
  const s = await ops();
  const appId = text(formData, "appId");
  const caseId = text(formData, "caseId");
  const method = text(formData, "method");
  const note = text(formData, "proof");
  const proof =
    method === "email" ? { channel: "email" } : method === "api" ? { channel: "api", stub: true } : note ? { channel: "portal", note } : null;
  const res = await submitApplication(appId, method, proof, s.userId);
  if (!res.ok) redirect(`/operations/cases/${caseId}/applications/${appId}?noproof=1`);
  redirect(`/operations/cases/${caseId}/applications/${appId}?submitted=1`);
}
