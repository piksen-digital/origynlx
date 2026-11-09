import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://origynlx.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: {
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/calculator", priority: 0.9, changeFrequency: "weekly" },
    { path: "/batch", priority: 0.8, changeFrequency: "monthly" },
    { path: "/guides/how-to-qualify-a-product-for-usmca", priority: 0.8, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/refund", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/es", priority: 0.8, changeFrequency: "weekly" },
    { path: "/es/pricing", priority: 0.7, changeFrequency: "monthly" },
    { path: "/es/refund", priority: 0.6, changeFrequency: "monthly" },
    { path: "/es/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/es/guides/como-calificar-un-producto-para-el-usmca", priority: 0.8, changeFrequency: "monthly" },
    { path: "/es/calculator", priority: 0.9, changeFrequency: "weekly" },
    { path: "/es/batch", priority: 0.7, changeFrequency: "monthly" },
    { path: "/es/vault", priority: 0.6, changeFrequency: "monthly" },
    { path: "/legal/disclaimer", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  ];
  return routes.map((r) => ({
    url: BASE + r.path,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}