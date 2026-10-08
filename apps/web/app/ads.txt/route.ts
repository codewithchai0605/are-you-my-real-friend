import { ADSENSE_CLIENT } from "@/lib/site";

export const dynamic = "force-static";

/** Served at /ads.txt – the line AdSense asks for ("Earnings at risk" warning if missing). */
export function GET() {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, ""); // "ca-pub-123…" → "pub-123…"
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# Set NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-1234567890123456) and rebuild to publish your ads.txt line.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
