import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JobCard from "@/components/JobCard";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES, categoryLabel, getJobsByCategory } from "@/lib/jobs";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = categoryLabel(slug);
  return {
    title: `Empleos remotos de ${label}`,
    description: `Vacantes remotas de ${label} para hispanohablantes, actualizadas a diario.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!CATEGORIES.some((c) => c.slug === slug)) notFound();

  const jobs = getJobsByCategory(slug);
  const label = categoryLabel(slug);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Empleos remotos de {label}
      </h1>
      <p className="text-neutral-600 mb-6">
        {jobs.length} vacante{jobs.length === 1 ? "" : "s"} remota
        {jobs.length === 1 ? "" : "s"} disponible{jobs.length === 1 ? "" : "s"}{" "}
        ahora mismo en {label.toLowerCase()}.
      </p>

      <AdSlot />

      <section className="grid gap-3 mt-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && (
          <p className="text-neutral-500">
            No hay vacantes en esta categoría por ahora. Vuelve pronto.
          </p>
        )}
      </section>
    </div>
  );
}
