import type { Prisma, ServiceType } from "@prisma/client";
import { prisma } from "./db";
import { emit, withEvents } from "./events";
import { AUDIENCE } from "./event-visibility";
import { OPERATING_TENANT_ID } from "./tenant";

/** Stage 9 partner services (CLAUDE.md §4 ServiceBooking). Partner-facing UIs
 *  are Phase 2; the student-side request and its record are Phase 1. */
export const SERVICE_TYPES = [
  "housing",
  "bank",
  "sim",
  "insurance",
  "transport",
  "test_prep",
] as const;

export function isServiceType(v: string): v is ServiceType {
  return (SERVICE_TYPES as readonly string[]).includes(v);
}

/** Event emitted when a request is *confirmed* — matches docs/02-events.md. */
const CONFIRMED_EVENT: Record<ServiceType, string> = {
  housing: "housing.booked",
  bank: "bank_account.opening_initiated",
  sim: "sim.ordered",
  insurance: "insurance.activated",
  transport: "airport_pickup.booked",
  test_prep: "service.confirmed",
};

export type RequestResult =
  | { ok: true; created: boolean }
  | { ok: false; error: "invalid_service" | "already_open" };

/**
 * Record a student's request for a partner service.
 *
 * The unique index on (studentId, serviceType) is what makes a double-tap safe:
 * the second insert loses rather than creating a duplicate for a coordinator to
 * untangle. A previously cancelled request is reopened rather than duplicated.
 */
export async function requestService(
  studentId: string,
  serviceType: string,
  notes?: string,
): Promise<RequestResult> {
  if (!isServiceType(serviceType)) return { ok: false, error: "invalid_service" };

  const existing = await prisma.serviceBooking.findUnique({
    where: { studentId_serviceType: { studentId, serviceType } },
  });
  if (existing && existing.status !== "cancelled") return { ok: false, error: "already_open" };

  await withEvents(async (tx) => {
    await tx.serviceBooking.upsert({
      where: { studentId_serviceType: { studentId, serviceType } },
      create: {
        tenantId: OPERATING_TENANT_ID,
        studentId,
        serviceType,
        notes: notes || null,
      },
      update: {
        status: "requested",
        notes: notes || null,
        cancelledAt: null,
        confirmedAt: null,
        requestedAt: new Date(),
      },
    });
    await emit(
      {
        type: "service.requested",
        stage: 9,
        studentId,
        actorType: "student",
        actorId: studentId,
        visibility: AUDIENCE.predeparture,
        channels: { in_app: true, push: false, whatsapp: false, email: false },
        payload: { service_type: serviceType },
      },
      tx,
    );
  });
  return { ok: true, created: !existing };
}

/** Cancel an open request. Idempotent: cancelling twice is not an error. */
export async function cancelServiceRequest(studentId: string, serviceType: string) {
  if (!isServiceType(serviceType)) return { ok: false as const, error: "invalid_service" as const };
  const done = await prisma.serviceBooking.updateMany({
    where: { studentId, serviceType, status: { in: ["requested", "matched"] } },
    data: { status: "cancelled", cancelledAt: new Date() },
  });
  return { ok: true as const, cancelled: done.count };
}

/**
 * Staff-side confirmation: attach a partner and mark the booking confirmed.
 * Conditional on the booking still being open so a stale screen cannot confirm
 * something the student has since cancelled.
 */
export async function confirmServiceBooking(
  bookingId: string,
  actorUserId: string,
  partnerId?: string,
  details?: Record<string, unknown>,
) {
  const booking = await prisma.serviceBooking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.status === "cancelled" || booking.status === "confirmed") {
    return { ok: false as const, error: "unavailable" as const };
  }

  return withEvents(async (tx) => {
    const claimed = await tx.serviceBooking.updateMany({
      where: { id: bookingId, status: { in: ["requested", "matched"] } },
      data: {
        status: "confirmed",
        confirmedAt: new Date(),
        partnerId: partnerId ?? booking.partnerId,
        details: (details ?? booking.details ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
    if (claimed.count !== 1) return { ok: false as const, error: "unavailable" as const };

    await emit(
      {
        type: CONFIRMED_EVENT[booking.serviceType],
        stage: 9,
        studentId: booking.studentId,
        actorType: "ops",
        actorId: actorUserId,
        visibility: AUDIENCE.predeparture,
        channels: { in_app: true, push: true, whatsapp: true, email: false },
        payload: { service_type: booking.serviceType, ...(details ?? {}) },
      },
      tx,
    );
    return { ok: true as const };
  });
}

export async function listServiceBookings(studentId: string) {
  return prisma.serviceBooking.findMany({
    where: { studentId },
    orderBy: { requestedAt: "asc" },
  });
}
