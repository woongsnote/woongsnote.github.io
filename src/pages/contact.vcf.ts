import type { APIRoute } from "astro";
import { profile } from "../data/profile";

const escapeText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

export const GET: APIRoute = () => {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeText(profile.familyName)};${escapeText(profile.givenName)};;;`,
    `FN:${escapeText(profile.name)}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL:${profile.website}`,
    "END:VCARD",
    "",
  ].join("\r\n");

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.username}.vcf"`,
    },
  });
};
