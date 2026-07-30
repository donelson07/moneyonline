import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { categoryLabel, getAllJobs, getJobBySlug } from "@/lib/jobs";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllJobs().map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return {};
  return {
    title: `${job.title} en ${job.company} (remoto)`,
    description: job.description.slice(0, 155),
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: job.location,
    },
    employmentType: "FULL_TIME",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href={`/categoria/${job.category}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← {categoryLabel(job.category)}
      </Link>

      <h1 className="text-2xl font-bold tracking-tight mt-3">{job.title}</h1>
      <p className="text-neutral-600 mt-1">
        {job.company} · {job.location} · Remoto
      </p>

      <a
        href={job.applyUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-block mt-6 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-md hover:bg-blue-700"
      >
        Postular en {job.source} →
      </a>

      <AdSlot />

      <div className="prose prose-neutral max-w-none mt-8 whitespace-pre-line text-neutral-700">
        {job.description}
      </div>

      <p className="text-xs text-neutral-400 mt-8">
        Publicado originalmente en{" "}
        <a href={job.sourceUrl} className="underline">
          {job.source}
        </a>
        .
      </p>
    </div>
  );
}
