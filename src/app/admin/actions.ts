"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  authenticate,
  startSession,
  endSession,
  getSession,
} from "@/lib/auth";
import {
  isTwoFactorEnabled,
  mustEnrollTwoFactor,
  confirmEnrollment,
  verifyTwoFactor,
  disableTwoFactor,
} from "@/lib/twofactor";
import { settingsSchema, countrySchema } from "@/lib/validation";
import { SINGLETON_ID } from "@/lib/settings";

export type FormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
};

async function ensureAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

function firstErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fieldErrors)) {
    if (v && v[0]) out[k] = v[0];
  }
  return out;
}

// ── Auth ────────────────────────────────────────────────────────────
export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const session = await authenticate(email, password);
  if (!session) return { error: "Invalid email or password." };

  // 2FA gate: enrolled users verify a code; mandatory roles must enrol first.
  const enabled = await isTwoFactorEnabled(session.sub);
  const tfa = !enabled && !mustEnrollTwoFactor(session.role);
  await startSession({
    id: session.sub,
    email: session.email,
    name: session.name,
    role: session.role,
    tfa,
  });
  redirect(tfa ? "/admin" : "/admin/2fa");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

// ── Two-factor (TOTP) ───────────────────────────────────────────────
export async function confirmEnrollmentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const code = String(formData.get("code") ?? "").trim();
  if (!(await confirmEnrollment(session.sub, code))) {
    return { error: "That code didn't match. Enter the current 6-digit code." };
  }
  await startSession({ id: session.sub, email: session.email, name: session.name, role: session.role, tfa: true });
  redirect("/admin");
}

export async function verifyTwoFactorAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const code = String(formData.get("code") ?? "").trim();
  if (!(await verifyTwoFactor(session.sub, code))) {
    return { error: "Invalid code. Use your authenticator app or a recovery code." };
  }
  await startSession({ id: session.sub, email: session.email, name: session.name, role: session.role, tfa: true });
  redirect("/admin");
}

export async function disableTwoFactorAction() {
  const session = await ensureAdmin();
  await disableTwoFactor(session.sub, session.sub);
  const tfa = !mustEnrollTwoFactor(session.role);
  await startSession({ id: session.sub, email: session.email, name: session.name, role: session.role, tfa });
  redirect(tfa ? "/admin" : "/admin/2fa");
}

// ── Company settings ────────────────────────────────────────────────
export async function saveSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await ensureAdmin();

  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  // Unchecked switches are absent from FormData → coerce to explicit false.
  for (const key of ["showFloatingWhatsapp", "showFloatingCall", "geoEnabled"]) {
    raw[key] = formData.get(key) === "on";
  }

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: firstErrors(parsed.error.flatten().fieldErrors),
    };
  }

  await prisma.siteSettings.update({
    where: { id: SINGLETON_ID },
    data: parsed.data,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Settings saved." };
}

// ── Country contacts ────────────────────────────────────────────────
export async function upsertCountryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await ensureAdmin();

  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  raw.enabled = formData.get("enabled") === "on";

  const parsed = countrySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: firstErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const { id, ...data } = parsed.data;

  // Guard against duplicate country codes on create / re-code.
  const clash = await prisma.countryContact.findFirst({
    where: { countryCode: data.countryCode, NOT: id ? { id } : undefined },
    select: { id: true },
  });
  if (clash) {
    return {
      error: `A contact for ${data.countryCode} already exists.`,
      fieldErrors: { countryCode: "This country already has an entry." },
    };
  }

  if (id) {
    await prisma.countryContact.update({ where: { id }, data });
  } else {
    await prisma.countryContact.create({ data });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/countries");
  return { ok: true, message: id ? "Country updated." : "Country added." };
}

export async function deleteCountryAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.countryContact.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/countries");
  }
}
