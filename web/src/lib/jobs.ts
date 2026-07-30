import jobsData from "@/data/jobs.json";

export type Job = {
  id: string;
  source: string;
  sourceUrl: string;
  title: string;
  company: string;
  tags: string[];
  location: string;
  applyUrl: string;
  description: string;
  postedAt: string;
  slug: string;
  category: string;
  featured?: boolean;
};

export type Category = { slug: string; label: string };

export const CATEGORIES: Category[] = [
  { slug: "desarrollo", label: "Desarrollo / Programación" },
  { slug: "diseno", label: "Diseño" },
  { slug: "marketing", label: "Marketing" },
  { slug: "ventas", label: "Ventas" },
  { slug: "soporte", label: "Atención al Cliente / Soporte" },
  { slug: "producto-y-gestion", label: "Producto y Gestión" },
  { slug: "finanzas-y-admin", label: "Finanzas y Administración" },
  { slug: "otros", label: "Otros" },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function getAllJobs(): Job[] {
  return (jobsData as { jobs: Job[] }).jobs;
}

export function getJobsUpdatedAt(): string {
  return (jobsData as { updatedAt: string }).updatedAt;
}

export function getJobBySlug(slug: string): Job | undefined {
  return getAllJobs().find((j) => j.slug === slug);
}

export function getJobsByCategory(categorySlug: string): Job[] {
  return getAllJobs().filter((j) => j.category === categorySlug);
}
