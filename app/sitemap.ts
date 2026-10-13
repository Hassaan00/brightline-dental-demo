import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const b = process.env.NEXT_PUBLIC_SITE_URL || "https://brightline-dental-demo.vercel.app";
  return ["", "/book", "/app"].map((p) => ({ url: b + p, lastModified: new Date() }));
}
