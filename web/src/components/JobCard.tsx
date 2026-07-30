import Link from "next/link";
import type { Job } from "@/lib/jobs";
import { categoryLabel } from "@/lib/jobs";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "hoy";
  if (days === 1) return "hace 1 día";
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
}

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/empleos/${job.slug}`}
      className={`block border rounded-lg p-4 hover:shadow-sm transition ${
        job.featured
          ? "border-amber-300 bg-amber-50 hover:border-amber-400"
          : "border-neutral-200 hover:border-blue-400"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-neutral-900">{job.title}</h3>
          <p className="text-sm text-neutral-600">{job.company}</p>
        </div>
        <span className="text-xs text-neutral-400 whitespace-nowrap">
          {timeAgo(job.postedAt)}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {job.featured && (
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-medium">
            ★ Destacada
          </span>
        )}
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
          {categoryLabel(job.category)}
        </span>
        <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
          {job.location}
        </span>
      </div>
    </Link>
  );
}
