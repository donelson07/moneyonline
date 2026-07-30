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

export type Country = { slug: string; label: string; timezoneNote: string };

export const COUNTRIES: Country[] = [
  {
    slug: "mexico",
    label: "México",
    timezoneNote:
      "México comparte franja horaria con buena parte de EE. UU., lo que facilita coordinar reuniones en vivo con equipos de América del Norte.",
  },
  {
    slug: "colombia",
    label: "Colombia",
    timezoneNote:
      "Colombia opera en UTC-5 todo el año, muy cercano al horario del este de EE. UU., ideal para equipos remotos con clientes norteamericanos.",
  },
  {
    slug: "argentina",
    label: "Argentina",
    timezoneNote:
      "Argentina (UTC-3) se solapa bien con Europa por la mañana y con la costa este de EE. UU. por la tarde, útil para roles con equipos en ambos continentes.",
  },
  {
    slug: "chile",
    label: "Chile",
    timezoneNote:
      "Chile mantiene un huso horario similar al este de Sudamérica, con buena superposición horaria para trabajar con clientes de EE. UU. y Europa.",
  },
  {
    slug: "peru",
    label: "Perú",
    timezoneNote:
      "Perú (UTC-5) coincide con el horario del este de EE. UU. gran parte del año, cómodo para reuniones sincrónicas con empresas norteamericanas.",
  },
  {
    slug: "espana",
    label: "España",
    timezoneNote:
      "España comparte la mayor parte de la jornada laboral con el resto de Europa, lo que la hace atractiva para empresas remotas europeas.",
  },
];

export function countryLabel(slug: string): string {
  return COUNTRIES.find((c) => c.slug === slug)?.label ?? slug;
}
