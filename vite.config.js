import path, { dirname } from 'path';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default ({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    // server: {
    //   proxy: {
    //     '/riot': {
    //       target: 'https://kr.api.riotgames.com',
    //       changeOrigin: true,
    //       rewrite: (p) => p.replace(/^\/riot/, ''),
    //       headers: {
    //         'X-Riot-Token': env.VITE_RIOT_API_KEY, // ← 여기서 키 주입
    //       },
    //     },
    //     '/asia': {
    //       target: 'https://asia.api.riotgames.com',
    //       changeOrigin: true,
    //       rewrite: (p) => p.replace(/^\/asia/, ''),
    //       headers: {
    //         'X-Riot-Token': env.VITE_RIOT_API_KEY,
    //       },
    //     },
    //   },
    // },
  });
};
