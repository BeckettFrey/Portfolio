import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['covers.openlibrary.org'],
  },
  async redirects() {
    return [
      {
        // Redirect to the latest resume PDF
        source: '/resume',
        destination: 'https://github.com/beckettfrey/latex-resume/releases/latest/download/resume.pdf',
        permanent: false,
      },
    ];
  },
}

export default nextConfig;
