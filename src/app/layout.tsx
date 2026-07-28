import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { ToastProvider } from "@/components/ui/Toast";
import { PwaController } from "@/components/pwa/PwaController";
import { SyncManager } from "@/components/pwa/SyncManager";
import { LocaleProvider } from "@/i18n/LocaleProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings);
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSettings();
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: settings.themeColor,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('fontScale')==='large')document.documentElement.dataset.fontScale='large';}catch(e){}})();",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <LocaleProvider locale="en">
          <ToastProvider>
            {children}
            <SyncManager />
          </ToastProvider>
        </LocaleProvider>
        <PwaController />
        {/* Marketing analytics deliberately live in the public (site) layout, not
            here: on authenticated routes the URL carries student, application and
            visa-file identifiers, which must not be sent to Google/Meta. */}
      </body>
    </html>
  );
}
