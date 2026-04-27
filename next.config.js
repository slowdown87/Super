/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: 'export',
  basePath: '/Super',
  assetPrefix: '/Super',
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/courses': { page: '/courses' },
      '/simulation': { page: '/simulation' },
      '/portfolio': { page: '/portfolio' },
    }
  },
}

module.exports = nextConfig