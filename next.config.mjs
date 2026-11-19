/** @type {import('next').NextConfig} */
const nextConfig = {
    // The share-preview image route reads these fonts from disk at runtime.
    outputFileTracingIncludes: {
        '/og': ['./assets/fonts/**'],
    },
};

export default nextConfig;
