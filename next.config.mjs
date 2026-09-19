/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permitir la lectura de archivos locales si fuera necesario o configuración de imágenes externas
  allowedDevOrigins: ['192.168.1.248'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
    ],
  },
};

export default nextConfig;
