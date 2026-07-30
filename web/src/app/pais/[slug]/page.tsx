import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JobCard from "@/components/JobCard";
import AdSlot from "@/components/AdSlot";
import { COUNTRIES, countryLabel, getAllJobs } from "@/lib/jobs";

export const revalidate = 3600;

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = countryLabel(slug);
  return {
    title: `Trabajo remoto para candidatos en ${label}`,
    description: `Vacantes remotas internacionales abiertas a candidatos desde ${label}, actualizadas a diario.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) notFound();

  const jobs = getAllJobs().slice(0, 40);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Trabajo remoto para candidatos en {country.label}
      </h1>
      <p className="text-neutral-600 mb-2 max-w-2xl">
        Estas vacantes son 100% remotas y abiertas a candidatos que trabajan
        desde {country.label}, aunque la empresa contratante puede estar en
        cualquier país.
      </p>
      <p className="text-neutral-500 text-sm mb-6 max-w-2xl">
        {country.timezoneNote}
      </p>

      <AdSlot />

      <section className="grid gap-3 mt-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </section>
    </div>
  );
}
