import path, { dirname } from 'path';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite'; // ← loadEnv 추가
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default ({ mode }) => {
  // .env에서 VITE_RIOT_API_KEY 읽어오기 (dev server에서 프록시 헤더로 붙임)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        // KR 플랫폼 도메인 → /riot/* 로 우회
        '/riot': {
          target: 'https://kr.api.riotgames.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/riot/, ''),
          headers: {
            'X-Riot-Token': env.VITE_RIOT_API_KEY, // ← 여기서 키 주입
          },
        },
        // ASIA 리전 도메인 → /asia/* 로 우회 (match/account)
        '/asia': {
          target: 'https://asia.api.riotgames.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/asia/, ''),
          headers: {
            'X-Riot-Token': env.VITE_RIOT_API_KEY,
          },
        },
      },
    },
  });
};
