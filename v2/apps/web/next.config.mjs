/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    transpilePackages: [
        'ui',
    ],
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default config;
