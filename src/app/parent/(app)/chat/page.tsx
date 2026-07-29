import type { Metadata } from "next";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { requireParent } from "@/lib/parent";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { parentChatSendAction } from "./actions";

export const metadata: Metadata = { title: "Message counsellor", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ParentChat() {
  const t = getTranslator(await getUserLocale());
  const { student } = await requireParent();
  const msgs = await prisma.communication.findMany({
    where: { studentId: student.id, type: "message", metadata: { path: ["kind"], equals: "parent_chat" } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return (
    <div className="flex min-h-[70vh] flex-col">
      <Link href="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{t("parent.chat.title")}</h1>
      <p className="mb-3 text-xs text-muted">{t("parent.chat.note")}</p>

      <div className="flex-1 space-y-2">
        {msgs.length === 0 ? (
          <EmptyState title="Start the conversation" body="Ask anything — your counsellor will reply in working hours." />
        ) : (
          msgs.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.direction === "inbound" ? "ml-auto bg-navy text-white" : "mr-auto border border-line bg-white text-ink"}`}>
              {m.content}
            </div>
          ))
        )}
      </div>

      <form action={parentChatSendAction} className="sticky bottom-0 mt-3 flex gap-2 bg-white py-2">
        <input name="content" required placeholder={t("app.messages.placeholder")} aria-label={t("app.messages.placeholder")} className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm outline-none focus:border-navy" />
        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-white hover:bg-navy-700" aria-label="Send"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
