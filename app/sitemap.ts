import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const SITE_URL = "https://phantextech.com"; // ← replace

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
  }));
  return [{ url: SITE_URL, lastModified: new Date() }, ...articles];
}
