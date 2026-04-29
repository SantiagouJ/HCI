import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, resolve, relative } from 'path';

const MIME: Record<string, string> = {
  '.js': 'application/javascript',
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream',
  '.binarypb': 'application/octet-stream',
};

function serveWebgazer(middlewares: { use: Function }, dist: string) {
  middlewares.use((req: any, res: any, next: Function) => {
    const pathname = (req.url ?? '').split('?')[0];
    let file: string | null = null;

    if (pathname === '/webgazer.js') {
      file = join(dist, 'webgazer.js');
    } else if (pathname.startsWith('/mediapipe/')) {
      file = join(dist, pathname.slice(1));
    }

    if (!file || !existsSync(file)) return next();

    res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    createReadStream(file).pipe(res as never);
  });
}

function* walkFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkFiles(full);
    else yield full;
  }
}

// Serves webgazer.js and its mediapipe model assets from node_modules,
// both at dev/preview time and as emitted assets in the production build.
function webgazerServePlugin(): Plugin {
  const dist = resolve('node_modules/webgazer/dist');
  return {
    name: 'webgazer-serve',
    configureServer(server) {
      serveWebgazer(server.middlewares, dist);
    },
    configurePreviewServer(server) {
      serveWebgazer(server.middlewares, dist);
    },
    generateBundle() {
      const webgazerFile = join(dist, 'webgazer.js');
      if (existsSync(webgazerFile)) {
        this.emitFile({ type: 'asset', fileName: 'webgazer.js', source: readFileSync(webgazerFile) });
      }
      const mediapipeDir = join(dist, 'mediapipe');
      if (existsSync(mediapipeDir)) {
        for (const filePath of walkFiles(mediapipeDir)) {
          this.emitFile({
            type: 'asset',
            fileName: relative(dist, filePath).replace(/\\/g, '/'),
            source: readFileSync(filePath),
          });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), webgazerServePlugin()],
});
