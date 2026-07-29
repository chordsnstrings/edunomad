"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify, canEditSop } from "@/lib/sop-cms";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";
import { text, json } from "@/lib/form";

async function admin() {
  const s = await requireAdmin();
  return s;
}

export async function createSopAction(formData: FormData) {
  const s = await admin();
  const title = text(formData, "title") || "Untitled SOP";
  let slug = slugify(title);
  if (await prisma.sopArticle.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  const a = await prisma.sopArticle.create({ data: { title, slug, ownerUserId: s.sub, category: text(formData, "category") || null, blocks: [] } });
  redirect(`/admin/sop/${a.id}`);
}

export async function saveSopBlocksAction(formData: FormData) {
  const s = await admin();
  const id = text(formData, "id");
  const article = await prisma.sopArticle.findUnique({ where: { id } });
  if (!article) redirect("/admin/sop");
  if (!canEditSop(article, s)) redirect(`/admin/sop/${id}?denied=1`);
  const title = String(formData.get("title") ?? article.title);
  const blocks = JSON.parse(json(formData, "blocks") || "[]") as Prisma.InputJsonValue;
  // snapshot the previous version, then bump.
  await prisma.sopArticleVersion.create({ data: { articleId: id, version: article.version, title: article.title, blocks: article.blocks as Prisma.InputJsonValue } });
  await prisma.sopArticle.update({ where: { id }, data: { title, blocks, version: article.version + 1, status: article.status === "published" ? "published" : "draft" } });
  redirect(`/admin/sop/${id}?saved=1`);
}

export async function submitSopAction(formData: FormData) {
  await admin();
  await prisma.sopArticle.update({ where: { id: text(formData, "id") }, data: { status: "in_review" } });
  redirect(`/admin/sop/${text(formData, "id")}`);
}

export async function reviewSopAction(formData: FormData) {
  const s = await admin();
  const id = text(formData, "id");
  const decision = text(formData, "decision");
  await prisma.sopArticle.update({ where: { id }, data: { status: decision === "approve" ? "approved" : "draft", reviewerUserId: s.sub } });
  redirect(`/admin/sop/${id}`);
}

export async function publishSopAction(formData: FormData) {
  const s = await admin();
  const id = text(formData, "id");
  const a = await prisma.sopArticle.findUnique({ where: { id } });
  if (!a) redirect("/admin/sop");
  await prisma.sopArticle.update({ where: { id }, data: { status: "published", publishedVersion: a.version, publishedBlocks: a.blocks as Prisma.InputJsonValue } });
  await emit({ type: "sop_cms.published", stage: 2, actorType: "super_admin", actorId: s.sub, visibility: { ADMIN: true, C: true, O: true, CM: true, OM: true, COMP: true }, channels: { in_app: true }, payload: { slug: a.slug, version: a.version } });
  await logAudit({ actorUserId: s.sub, action: "sop.published", targetType: "SopArticle", targetId: id, result: "success", reason: `v${a.version}` });
  redirect(`/admin/sop/${id}?published=1`);
}

export async function setTranslationStatusAction(formData: FormData) {
  await admin();
  const id = text(formData, "id");
  const lang = text(formData, "lang");
  const status = text(formData, "status");
  const a = await prisma.sopArticle.findUnique({ where: { id } });
  if (!a) redirect("/admin/sop");
  const ts = { ...((a.translationStatus as Record<string, string> | null) ?? {}), [lang]: status };
  await prisma.sopArticle.update({ where: { id }, data: { translationStatus: ts as Prisma.InputJsonValue } });
  redirect(`/admin/sop/${id}`);
}
