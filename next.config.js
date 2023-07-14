/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['https://merakiui.com/images/full-logo.svg'],
},
experimental: {
    serverActions: true,
}, 
};

module.exports = nextConfig;
