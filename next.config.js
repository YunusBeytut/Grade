/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
        formats: ['image/avif', 'image/webp'],
    },
    // src klasörü kullandığınız için
    experimental: {
        appDir: true
    },
    // Path mapping için
    webpack: (config) => {
        config.resolve.alias['@'] = path.join(__dirname, 'src')
        return config
    }
}

const path = require('path')
module.exports = nextConfig