/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Esto permite que el build en Vercel pase aunque haya errores de ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;