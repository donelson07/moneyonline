import type { NextConfig } from "next";

// GH_PAGES_EXPORT is only set for the interim static-export publish to
// GitHub Pages (no API routes there). The normal Vercel build ignores this.
const isGhPagesExport = process.env.GH_PAGES_EXPORT === "1";

const nextConfig: NextConfig = isGhPagesExport
  ? {
      output: "export",
      basePath: "/moneyonline",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
