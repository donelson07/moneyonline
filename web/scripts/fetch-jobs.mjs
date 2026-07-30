// Pulls remote-job listings from free public APIs, normalizes them into one
// schema, and writes src/data/jobs.json. Run daily by .github/workflows/refresh-jobs.yml
// so the site's content refreshes with zero manual work.

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

// Short, stable id for sources whose natural identifier (a full URL, in
// Himalayas' case) is too long to safely appear in a filesystem path.
function shortHash(str) {
  return createHash("sha1").update(str).digest("hex").slice(0, 10);
}

const UA = "Mozilla/5.0 (compatible; TrabajoRemotoBot/1.0; +https://example.com)";

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Keeps generated paths well under filesystem limits (some job titles run
// to 150+ chars) while keeping the id suffix that guarantees uniqueness.
function jobSlug(title, company, id) {
  const titlePart = slugify(title).slice(0, 50).replace(/-+$/, "");
  const companyPart = slugify(company).slice(0, 20).replace(/-+$/, "");
  const idPart = slugify(id).slice(0, 30).replace(/-+$/, "");
  return `${titlePart}-${companyPart}-${idPart}`;
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchRemoteOK() {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) throw new Error(`RemoteOK HTTP ${res.status}`);
    const data = await res.json();
    return data
      .filter((j) => j && j.id && j.position)
      .map((j) => ({
        id: `remoteok-${j.id}`,
        source: "RemoteOK",
        sourceUrl: "https://remoteok.com",
        title: j.position,
        company: j.company || "Empresa remota",
        tags: Array.isArray(j.tags) ? j.tags : [],
        location: j.location || "Worldwide",
        applyUrl: j.url || j.apply_url || `https://remoteok.com/remote-jobs/${j.id}`,
        description: stripHtml(j.description || "").slice(0, 600),
        postedAt: j.date || new Date().toISOString(),
      }));
  } catch (err) {
    console.error("RemoteOK fetch failed:", err.message);
    return [];
  }
}

async function fetchJobicy() {
  try {
    const res = await fetch(
      "https://jobicy.com/api/v2/remote-jobs?count=100",
      { headers: { "User-Agent": UA } }
    );
    if (!res.ok) throw new Error(`Jobicy HTTP ${res.status}`);
    const data = await res.json();
    return (data.jobs || []).map((j) => ({
      id: `jobicy-${j.id}`,
      source: "Jobicy",
      sourceUrl: "https://jobicy.com",
      title: j.jobTitle,
      company: j.companyName || "Empresa remota",
      tags: [...(j.jobIndustry || []), ...(j.jobType || [])],
      location: j.jobGeo || "Worldwide",
      applyUrl: j.url,
      description: stripHtml(j.jobExcerpt || j.jobDescription || "").slice(0, 600),
      postedAt: j.pubDate || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Jobicy fetch failed:", err.message);
    return [];
  }
}

async function fetchArbeitnow() {
  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) throw new Error(`Arbeitnow HTTP ${res.status}`);
    const data = await res.json();
    return (data.data || [])
      .filter((j) => j.remote)
      .map((j) => ({
        id: `arbeitnow-${j.slug}`,
        source: "Arbeitnow",
        sourceUrl: "https://arbeitnow.com",
        title: j.title,
        company: j.company_name || "Empresa remota",
        tags: [...(j.tags || []), ...(j.job_types || [])],
        location: j.location || "Worldwide",
        applyUrl: j.url,
        description: stripHtml(j.description || "").slice(0, 600),
        postedAt: j.created_at
          ? new Date(j.created_at * 1000).toISOString()
          : new Date().toISOString(),
      }));
  } catch (err) {
    console.error("Arbeitnow fetch failed:", err.message);
    return [];
  }
}

async function fetchHimalayas() {
  try {
    const res = await fetch("https://himalayas.app/jobs/api?limit=100", {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) throw new Error(`Himalayas HTTP ${res.status}`);
    const data = await res.json();
    return (data.jobs || []).map((j) => ({
      id: `himalayas-${shortHash(j.guid || j.title + j.companyName)}`,
      source: "Himalayas",
      sourceUrl: "https://himalayas.app",
      title: j.title,
      company: j.companyName || "Empresa remota",
      tags: [
        ...(j.categories || []),
        ...(j.locationRestrictions || []),
      ],
      location: (j.locationRestrictions || []).join(", ") || "Worldwide",
      applyUrl: j.applicationLink || j.guid,
      description: stripHtml(j.excerpt || "").slice(0, 600),
      postedAt: j.pubDate || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Himalayas fetch failed:", err.message);
    return [];
  }
}

async function fetchFeaturedFromStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return [];
  try {
    const res = await fetch(
      "https://api.stripe.com/v1/checkout/sessions?limit=100&status=complete",
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    if (!res.ok) throw new Error(`Stripe HTTP ${res.status}`);
    const data = await res.json();
    const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;
    return (data.data || [])
      .filter((s) => s.metadata?.title && s.metadata?.applyUrl && s.created > sevenDaysAgo)
      .map((s) => ({
        id: `featured-${s.id}`,
        source: "Destacado",
        sourceUrl: "https://trabajoremoto.es",
        title: s.metadata.title,
        company: s.metadata.company || "Empresa",
        tags: [],
        location: "Worldwide",
        applyUrl: s.metadata.applyUrl,
        description: `Vacante destacada publicada directamente por ${s.metadata.company || "la empresa"}.`,
        postedAt: new Date(s.created * 1000).toISOString(),
        featured: true,
      }));
  } catch (err) {
    console.error("Stripe featured-listings fetch failed:", err.message);
    return [];
  }
}

const CATEGORIES = [
  { slug: "desarrollo", label: "Desarrollo / Programación", keywords: ["dev", "engineer", "developer", "software", "frontend", "backend", "full stack", "fullstack", "data", "devops", "programador", "qa", "mobile", "ios", "android"] },
  { slug: "diseno", label: "Diseño", keywords: ["design", "designer", "ux", "ui", "product design"] },
  { slug: "marketing", label: "Marketing", keywords: ["marketing", "seo", "growth", "content", "social media", "brand"] },
  { slug: "ventas", label: "Ventas", keywords: ["sales", "account executive", "business development", "sdr", "bdr"] },
  { slug: "soporte", label: "Atención al Cliente / Soporte", keywords: ["support", "customer service", "customer success", "helpdesk"] },
  { slug: "producto-y-gestion", label: "Producto y Gestión", keywords: ["product manager", "project manager", "product owner", "scrum", "operations", "ops"] },
  { slug: "finanzas-y-admin", label: "Finanzas y Administración", keywords: ["finance", "accounting", "admin", "hr ", "human resources", "recruiter", "payroll", "legal"] },
];

function categorize(job) {
  const haystack = `${job.title} ${job.tags.join(" ")}`.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => haystack.includes(kw))) return cat.slug;
  }
  return "otros";
}

async function main() {
  const [remoteok, jobicy, himalayas, arbeitnow, featured] = await Promise.all([
    fetchRemoteOK(),
    fetchJobicy(),
    fetchHimalayas(),
    fetchArbeitnow(),
    fetchFeaturedFromStripe(),
  ]);

  const all = [...featured, ...remoteok, ...jobicy, ...himalayas, ...arbeitnow]
    .filter((j) => j.title && j.applyUrl)
    .map((j) => ({
      featured: false,
      ...j,
      slug: jobSlug(j.title, j.company, j.id),
      category: categorize(j),
    }));

  // De-duplicate by title+company (same role often listed on multiple boards)
  const seen = new Set();
  const deduped = all.filter((j) => {
    const key = slugify(`${j.title}-${j.company}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.postedAt) - new Date(a.postedAt);
  });

  const outPath = path.join(process.cwd(), "src", "data", "jobs.json");
  await writeFile(
    outPath,
    JSON.stringify(
      { updatedAt: new Date().toISOString(), count: deduped.length, jobs: deduped },
      null,
      2
    )
  );
  console.log(`Wrote ${deduped.length} jobs to ${outPath}`);
}

main();
