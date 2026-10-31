const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/site-imaculada" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isGitHubPages && {
    output: "export",
    basePath,
    trailingSlash: true,
  }),
};

export default nextConfig;
