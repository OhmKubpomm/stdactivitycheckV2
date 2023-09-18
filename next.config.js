/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['https://icons8.com/','res.cloudinary.com'],
        formats: ['image/avif', 'image/webp'],

},
experimental: {
    serverActions: true,
}, 
};

module.exports = nextConfig;
