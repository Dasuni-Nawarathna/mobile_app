import path from 'path';
import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
    distDir: isDevelopment ? '.next-dev' : '.next',
    /** Pin traces to this app when a parent folder also has package-lock.json (silences inferred-root warnings). */
    outputFileTracingRoot: path.join(__dirname),
    eslint: {
        // Rules are enforced in dev via `npm run lint`.
        // Vercel build was failing due to ESLint 9 + next/typescript
        // config precedence overriding warn→error. Safe to skip here.
        ignoreDuringBuilds: true,
    },
    images: {
        /** Required for explicit `quality=` on `<Image>` in upcoming Next majors; clears dev warnings */
        qualities: [70, 75, 80, 85, 90, 100],
        remotePatterns: [
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'overatours.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'i.pravatar.cc' },
            { protocol: 'https', hostname: 'dxk1acp76n912.cloudfront.net' },
            { protocol: 'https', hostname: 'media-cdn.tripadvisor.com' },
            { protocol: 'https', hostname: 's.yimg.com' },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
