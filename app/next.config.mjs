import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Disambiguate workspace root — repo root has its own package-lock.json
    // for the marketing site / waitlist API; this app is its own deploy.
    root: __dirname,
  },
};

export default nextConfig;
