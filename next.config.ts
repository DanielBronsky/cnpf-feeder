// next.config.ts
// Конфигурация Next.js (включая reactCompiler и фикс корня для Turbopack).
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    // Явно задаём корень проекта, чтобы Next не пытался угадать его по lock-файлам вне репо.
    root: __dirname,
  },
};

export default nextConfig;
