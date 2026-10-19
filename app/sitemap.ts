import type { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { LEGAL_LINKS } from "@/lib/site";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bethelhalalmeats.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/shop`, priority: 0.9 },
    { url: `${base}/cart`, priority: 0.2 },
    { url: `${base}/checkout`, priority: 0.2 },
    { url: `${base}/account`, priority: 0.3 },
    { url: `${base}/auth/signin`, priority: 0.3 },
    { url: `${base}/auth/signup`, priority: 0.3 },
    ...LEGAL_LINKS.map((link) => ({ url: `${base}${link.href}`, priority: 0.4 })),
    ...CATEGORIES.map((category) => ({
      url: `${base}/shop?category=${category.slug}`,
      priority: 0.7,
    })),
  ];

  return [
    ...staticPages.map((page) => ({
      url: page.url,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page.priority,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${base}/shop/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
