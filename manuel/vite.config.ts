import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync } from 'fs';
import { join, extname, resolve } from 'path';

const MIME: Record<string, string> = {
  '.js': 'application/javascript',
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream',
  '.binarypb': 'application/octet-stream',
};

// Serves webgazer.js and its mediapipe model assets directly from
// node_modules at dev time, bypassing esbuild entirely.
function webgazerServePlugin(): Plugin {
  const dist = resolve('node_modules/webgazer/dist');
  return {
    name: 'webgazer-serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? '').split('?')[0];
        let file: string | null = null;

        if (pathname === '/webgazer.js') {
          file = join(dist, 'webgazer.js');
        } else if (pathname.startsWith('/mediapipe/')) {
          file = join(dist, pathname.slice(1)); // mediapipe/face_mesh/...
        }

        if (!file || !existsSync(file)) return next();

        res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        createReadStream(file).pipe(res as never);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), webgazerServePlugin()],
});
