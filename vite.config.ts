import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig, Plugin} from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 루트의 /assets 폴더에 있는 정적 파일(GIF 등)도 브라우저에서 바로 서빙될 수 있도록 지원하는 플러그인
function serveRootAssets(): Plugin {
  return {
    name: 'serve-root-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/assets/')) {
          return next();
        }
        const cleanUrl = req.url.split('?')[0];
        const filePath = path.join(__dirname, cleanUrl);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.gif': 'image/gif',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
          };
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
          return fs.createReadStream(filePath).pipe(res);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serveRootAssets()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          loading: path.resolve(__dirname, 'index.html'),
          main: path.resolve(__dirname, 'main.html'),
          state: path.resolve(__dirname, 'pages/state.html'),
          expression: path.resolve(__dirname, 'pages/expression.html'),
          light: path.resolve(__dirname, 'pages/light.html'),
          objectSound: path.resolve(__dirname, 'pages/object-sound.html'),
          personSound: path.resolve(__dirname, 'pages/person-sound.html'),
          shape: path.resolve(__dirname, 'pages/shape.html'),
          nature: path.resolve(__dirname, 'pages/nature.html'),
          ranking: path.resolve(__dirname, 'pages/ranking.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
