import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Quiz pages (/q/...) are private-ish and thin, so they carry <meta robots="noindex">
// themselves. We do NOT block them here: crawlers must be able to fetch a page to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
