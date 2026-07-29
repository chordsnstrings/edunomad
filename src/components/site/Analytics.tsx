import Script from "next/script";
import type { SiteSettings } from "@/lib/settings";

/**
 * Provider IDs are admin-editable and were interpolated straight into inline
 * <script> bodies, so a malicious or compromised admin could close the string and
 * execute arbitrary JS on every public page (stored XSS). Each ID is validated
 * against its provider's format and anything else is dropped.
 */
const GA_ID = /^G-[A-Z0-9]{4,20}$/i;
const GTM_ID = /^GTM-[A-Z0-9]{4,20}$/i;
const PIXEL_ID = /^\d{5,20}$/;
const PLAUSIBLE_DOMAIN = /^[a-z0-9.-]{3,255}$/i;

const safe = (value: string | null | undefined, pattern: RegExp) =>
  value && pattern.test(value) ? value : null;

/** Renders only the analytics tags that have a VALID ID configured in admin. */
export function Analytics({ settings }: { settings: SiteSettings }) {
  const gaMeasurementId = safe(settings.gaMeasurementId, GA_ID);
  const gtmId = safe(settings.gtmId, GTM_ID);
  const metaPixelId = safe(settings.metaPixelId, PIXEL_ID);
  const plausibleDomain = safe(settings.plausibleDomain, PLAUSIBLE_DOMAIN);

  return (
    <>
      {gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaMeasurementId}');`}
          </Script>
        </>
      )}

      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
