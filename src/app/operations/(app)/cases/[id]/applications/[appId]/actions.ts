"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { packageApplication, submitApplication } from "@/lib/submission";
import { encryptSecret } from "@/lib/crypto-vault";

async function ops() {
  const s = await getCurrentSession();
  if (!s || !["operations_team", "operations_manager"].includes(s.role)) redirect("/operations/login");
  return s;
}

export async function packageAction(formData: FormData) {
  await ops();
  const appId = String(formData.get("appId"));
  const caseId = String(formData.get("caseId"));
  await packageApplication(appId, formData.getAll("docIds").map(String));
  redirect(`/operations/cases/${caseId}/applications/${appId}`);
}

export async function storeCredentialAction(formData: FormData) {
  await ops();
  const institutionId = String(formData.get("institutionId"));
  const caseId = String(formData.get("caseId"));
  const appId = String(formData.get("appId"));
  await prisma.institutionCredential.upsert({
    where: { institutionId },
    create: { institutionId, portalUrl: String(formData.get("portalUrl") ?? ""), username: String(formData.get("username") ?? ""), passwordEnc: encryptSecret(String(formData.get("password") ?? "")) },
    update: { portalUrl: String(formData.get("portalUrl") ?? ""), username: String(formData.get("username") ?? ""), passwordEnc: encryptSecret(String(formData.get("password") ?? "")) },
  });
  redirect(`/operations/cases/${caseId}/applications/${appId}`);
}

export async function submitAction(formData: FormData) {
  const s = await ops();
  const appId = String(formData.get("appId"));
  const caseId = String(formData.get("caseId"));
  const method = String(formData.get("method") ?? "email");
  const note = String(formData.get("proof") ?? "");
  const proof =
    method === "email" ? { channel: "email" } : method === "api" ? { channel: "api", stub: true } : note ? { channel: "portal", note } : null;
  const res = await submitApplication(appId, method, proof, s.userId);
  if (!res.ok) redirect(`/operations/cases/${caseId}/applications/${appId}?noproof=1`);
  redirect(`/operations/cases/${caseId}/applications/${appId}?submitted=1`);
}
