/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    transpilePackages: [
        'ui',
    ],
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default config;
