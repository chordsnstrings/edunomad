# TLS everywhere + HSTS (G183)

## Production serves only HTTPS

TLS terminates at the platform edge (Vercel / Fly / load balancer). HTTP is
redirected to HTTPS by the edge (301), so no application traffic is served over
plaintext. Internal service-to-service calls (DB, object storage, Sentry,
WhatsApp/Twilio, Anthropic) all use `https://` / TLS endpoints.

## HSTS

`next.config.ts` emits the HSTS header **in production only** on every route:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

- `max-age` = 2 years.
- `includeSubDomains` + `preload` so the apex and all subdomains are pinned and
  the domain is eligible for the browser preload list.
- Emitted only when `NODE_ENV=production` so local HTTP dev is not pinned.

Baseline hardening headers (also set): `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(self), microphone=(), geolocation=()` (camera is
allowed for document capture; mic/geo denied). `X-Powered-By` is disabled.

## Certificate auto-renewal

Certificates are issued and **auto-renewed** by the platform (Let's Encrypt via
the host's managed TLS, or provider-managed certs). No manual rotation; renewal
is monitored by the uptime/TLS-expiry check (docs/cc/observability.md).

## Verification

- AC1 HTTPS-only — **[MANUAL/edge]** redirect + TLS config at the host.
- AC2 HSTS header — **PASS** (`next.config.ts`; observable via
  `curl -sI https://<host>/ | grep -i strict-transport`).
- AC3 Cert auto-renewal — **[MANUAL/edge]** provider-managed Let's Encrypt.
