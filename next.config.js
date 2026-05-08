/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/generate',
        destination: process.env.BACKEND_URL 
          ? `${process.env.BACKEND_URL}/generate`
          : 'http://localhost:8000/generate',
      },
      {
        source: '/api/health',
        destination: process.env.BACKEND_URL 
          ? `${process.env.BACKEND_URL}/health`
          : 'http://localhost:8000/health',
      },
    ]
  },
}

module.exports = nextConfig
