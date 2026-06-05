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
    let roleShort = "C";
    let studentId: string | undefined;
    if (user.role === "student") {
      roleShort = "S";
      const st = await prisma.student.findFirst({ where: { userId: user.userId }, select: { id: true } });
      studentId = st?.id;
    } else if (user.role === "parent") {
      roleShort = "P";
      studentId = (await getParentStudent(user.userId))?.id;
    } else {
      roleShort = roleToVisibilityCode(user.role) ?? "C";
    }
    const feed = await getActivityFeed({ roleShort, userId: user.userId, studentId, locale, cursor });
    return Response.json(feed);
  }

  const admin = await getSession();
  if (!admin) return Response.json({ error: "unauthorized" }, { status: 401 });
  const feed = await getActivityFeed({ roleShort: "ADMIN", userId: admin.sub, locale, cursor });
  return Response.json(feed);
}
