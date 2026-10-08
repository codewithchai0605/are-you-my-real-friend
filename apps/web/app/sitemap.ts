import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/create", "/guides", "/about", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.6 })),
    ...GUIDES.map((g) => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: g.date, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
