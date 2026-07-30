import Link from "next/link";
import JobCard from "@/components/JobCard";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES, COUNTRIES, getAllJobs, getJobsUpdatedAt } from "@/lib/jobs";

export const revalidate = 3600;

export default function Home() {
  const jobs = getAllJobs().slice(0, 40);
  const updatedAt = new Date(getJobsUpdatedAt()).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Empleos remotos para hispanohablantes
        </h1>
        <p className="text-neutral-600 max-w-2xl">
          Vacantes 100% remotas recopiladas a diario de las mejores bolsas de
          trabajo internacionales, pensadas para candidatos de LATAM y
          España. Última actualización: {updatedAt}.
        </p>
      </section>

      <section className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/categoria/${c.slug}`}
            className="text-sm border border-neutral-200 rounded-full px-3 py-1 hover:border-blue-400 hover:text-blue-600"
          >
            {c.label}
          </Link>
        ))}
      </section>

      <section className="mb-8 flex flex-wrap gap-2">
        {COUNTRIES.map((c) => (
          <Link
            key={c.slug}
            href={`/pais/${c.slug}`}
            className="text-sm text-neutral-500 hover:text-blue-600"
          >
            Trabajo remoto en {c.label}
          </Link>
        ))}
      </section>

      <AdSlot />

      <section className="grid gap-3 mt-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </section>
    </div>
  );
}
