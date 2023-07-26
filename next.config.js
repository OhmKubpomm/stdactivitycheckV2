/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['https://icons8.com/'],
},
experimental: {
    serverActions: true,
}, 
};

module.exports = nextConfig;
