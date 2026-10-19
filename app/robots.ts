import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bethelhalalmeats.co.ke";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/account", "/checkout", "/cart", "/order-confirmation"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
