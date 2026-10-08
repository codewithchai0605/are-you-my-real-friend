/** Site-wide constants. NEXT_PUBLIC_* values are inlined at build time. */
export const SITE_NAME = "Are you my real friend?";
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001").replace(/\/$/, "");

/** Your AdSense publisher id, e.g. "ca-pub-1234567890123456". Leave empty until you have one. */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/** A real, monitored address – Google checks that a contact route exists. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export const COPYRIGHT_YEAR = 2026;
export const POLICY_UPDATED = "October 8, 2026";
