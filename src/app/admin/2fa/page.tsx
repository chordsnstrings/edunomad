import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { beginEnrollment, mustEnrollTwoFactor } from "@/lib/twofactor";
import { otpauthUri } from "@/lib/totp";
import { EnrollForm, VerifyForm } from "@/components/admin/TwoFactorForms";

export const dynamic = "force-dynamic";

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-sm shadow-black/5">
        <div className="mb-4 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-gold-400">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-lg font-semibold text-navy">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export default async function TwoFactorPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.tfa) redirect("/admin");

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) redirect("/admin/login");

  // Enrolled but this session not yet verified → verification step.
  if (admin.totpEnabledAt) {
    return (
      <Shell title="Two-factor verification" subtitle="Enter the 6-digit code from your authenticator app.">
        <VerifyForm />
      </Shell>
    );
  }

  // Enrolment step — reuse a pending secret to avoid churn on retries.
  let uri: string;
  let recoveryCodes: string[] | null = null;
  if (!admin.totpSecret) {
    const e = await beginEnrollment(session.sub, session.email);
    uri = e.uri;
    recoveryCodes = e.recoveryCodes;
  } else {
    uri = otpauthUri(admin.totpSecret, session.email);
  }
  const qr = await QRCode.toDataURL(uri, { margin: 1, width: 200 });
  const mandatory = mustEnrollTwoFactor(session.role);

  return (
    <Shell
      title="Set up two-factor authentication"
      subtitle={mandatory ? "Required for your role before you can continue." : "Scan the QR code with your authenticator app."}
    >
      <div className="mb-4 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Two-factor QR code" width={200} height={200} className="rounded-lg border border-line" />
      </div>
      {recoveryCodes && (
        <div className="mb-4 rounded-lg border border-line bg-subtle p-3">
          <p className="mb-2 text-xs font-semibold text-navy">
            Save these recovery codes — shown once:
          </p>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-xs text-ink">
            {recoveryCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      )}
      <EnrollForm />
    </Shell>
  );
}
