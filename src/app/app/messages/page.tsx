import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { sendStudentMessageAction } from "../actions";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Messages", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const { student } = await requireStudent();
  const msgs = await prisma.communication.findMany({
    where: { studentId: student.id, type: { in: ["message", "whatsapp"] } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
      <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Messages</h1>

      <div className="mt-4 flex-1 space-y-2">
        {msgs.length === 0 ? (
          <EmptyState title="No messages yet" body="Say hello — your counsellor will reply within working hours." />
        ) : (
          msgs.map((m) => (
            <div
              key={m.id}
              // Who sent it is otherwise conveyed by alignment and colour alone
              // (CLAUDE.md §9: colour is never the only signal). The visually
              // hidden label gives assistive tech the sender explicitly.
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                m.direction === "inbound"
                  ? "ml-auto bg-navy text-white"
                  : "mr-auto border border-line bg-white text-ink"
              }`}
            >
              <span className="sr-only">
                {m.direction === "inbound" ? "You wrote: " : "Your counsellor wrote: "}
              </span>
              {m.content}
            </div>
          ))
        )}
      </div>

      <form action={sendStudentMessageAction} className="sticky bottom-0 mt-4 flex gap-2 bg-white py-2">
        <input
          name="content"
          required
          placeholder="Type a message…" aria-label="Type a message…"
          className="flex-1 rounded-full border border-line px-4 py-2.5 outline-none focus:border-navy"
        />
        <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-white hover:bg-navy-700" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
