import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getSession } from "@/lib/auth";
import { detectLocale } from "@/i18n/locale";
import { getActivityFeed, roleToVisibilityCode } from "@/lib/feed";
import { getParentStudent } from "@/lib/parent";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor");
  const locale = await detectLocale();

  const user = await getCurrentSession();
  if (user) {
    let roleShort: string;
    let studentId: string | undefined;
    let studentIds: string[] | undefined;

    if (user.role === "student") {
      roleShort = "S";
      const st = await prisma.student.findFirst({ where: { userId: user.userId }, select: { id: true } });
      studentId = st?.id;
      // No student record yet (signed up, not onboarded) => empty feed, not everyone's.
      if (!studentId) return Response.json({ items: [], nextCursor: null });
    } else if (user.role === "parent") {
      roleShort = "P";
      studentId = (await getParentStudent(user.userId))?.id;
      if (!studentId) return Response.json({ items: [], nextCursor: null });
    } else {
      const code = roleToVisibilityCode(user.role);
      // Deny by default: an unrecognised role gets nothing rather than the
      // counsellor feed (CLAUDE.md §6).
      if (!code) return Response.json({ error: "forbidden" }, { status: 403 });
      roleShort = code;

      // Counsellors see their assigned students; managers see their team's
      // (CLAUDE.md §6 own_assigned / own_team). Other internal roles are view:all.
      if (user.role === "counsellor") {
        const mine = await prisma.student.findMany({
          where: { assignedCounsellorId: user.userId },
          select: { id: true },
        });
        studentIds = mine.map((s) => s.id);
      } else if (user.role === "counsellor_manager") {
        const team = await prisma.counsellorProfile.findMany({
          where: { managerId: user.userId, active: true },
          select: { userId: true },
        });
        const teamStudents = await prisma.student.findMany({
          where: { assignedCounsellorId: { in: [...team.map((t) => t.userId), user.userId] } },
          select: { id: true },
        });
        studentIds = teamStudents.map((s) => s.id);
      }
    }

    const feed = await getActivityFeed({ roleShort, userId: user.userId, studentId, studentIds, locale, cursor });
    return Response.json(feed);
  }

  const admin = await getSession();
  if (!admin) return Response.json({ error: "unauthorized" }, { status: 401 });
  const feed = await getActivityFeed({ roleShort: "ADMIN", userId: admin.sub, locale, cursor });
  return Response.json(feed);
}
