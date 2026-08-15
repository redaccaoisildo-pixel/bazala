/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fase 0 não tem imagens remotas — as fotos vivem em /public/listings.
  // Formatos modernos primeiro: a largura de banda é o constrangimento (blueprint §7.4).
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 828, 1080, 1200],
  },

  // Sem cabeçalho X-Powered-By: bytes desnecessários em cada resposta.
  poweredByHeader: false,
};

export default nextConfig;
