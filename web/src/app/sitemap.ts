import type { MetadataRoute } from "next";
import { CATEGORIES, COUNTRIES, getAllJobs } from "@/lib/jobs";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trabajoremoto.es";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const jobs = getAllJobs();

  return [
    { url: BASE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE_URL}/destacar-vacante`, changeFrequency: "monthly", priority: 0.5 },
    ...CATEGORIES.map((c) => ({
      url: `${BASE_URL}/categoria/${c.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...COUNTRIES.map((c) => ({
      url: `${BASE_URL}/pais/${c.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    ...jobs.map((j) => ({
      url: `${BASE_URL}/empleos/${j.slug}`,
      lastModified: j.postedAt,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
