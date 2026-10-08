import "@repo/ui/styles.css";
import "@fontsource-variable/fredoka";
import "@fontsource/gochi-hand";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { MY_QUIZZES_KEY } from "@/lib/constants";
import { ADSENSE_CLIENT, SITE_URL } from "@/lib/site";

/**
 * Runs in <head>, before the first paint, ONLY on a hard load of "/" (no flash of the home page):
 * a browser that already created a quiz is sent to that quiz's share page.
 * - `/?stay=1` skips it (the logo links there, so people can still reach the home page).
 * - Crawlers and first-time visitors have no localStorage entry, so they always see the home page.
 */
const OWNER_REDIRECT = `(function(){try{if(location.pathname!=="/"||/[?&]stay=/.test(location.search))return;var l=JSON.parse(localStorage.getItem(${JSON.stringify(MY_QUIZZES_KEY)})||"[]");var s=l&&l[0]&&l[0].slug;if(typeof s==="string"&&/^[a-z0-9]{6,16}$/.test(s))location.replace("/q/"+s+"/share")}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  other: ADSENSE_CLIENT ? { "google-adsense-account": ADSENSE_CLIENT } : undefined,
  title: {
    default: "Are you my real friend? — find your fake friends",
    template: "%s · Are you my real friend?",
  },
  description:
    "Make a funny quiz about yourself, share the link, and see which friends really know you. Real ones ace it, fake ones blow it!",
  openGraph: {
    title: "Are you my real friend? — find your fake friends",
    description: "Make a funny quiz about yourself and see which friends really know you.",
    images: ["/share.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7dd3fc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: OWNER_REDIRECT }} />
        {ADSENSE_CLIENT ? (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body className={GeistSans.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
