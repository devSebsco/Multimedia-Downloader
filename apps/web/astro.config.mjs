import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: process.env.SITE_URL || 'https://linkfetch.vercel.app',
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  output: 'static',
  devToolbar: {
    enabled: false
  },
  vite: {
    optimizeDeps: {
      include: ['react-dom/client']
    },
    server: {
      proxy: {
        '/analyze': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err, _req, res) => {
              if (res && 'writeHead' in res) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: {
                    code: 'BACKEND_DOWN',
                    message: 'El servicio no está disponible en este momento. Intenta de nuevo más tarde.'
                  }
                }));
              }
            });
          }
        },
        '/download': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err, _req, res) => {
              if (res && 'writeHead' in res) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: {
                    code: 'BACKEND_DOWN',
                    message: 'El servicio no está disponible en este momento. Intenta de nuevo más tarde.'
                  }
                }));
              }
            });
          }
        }
      }
    }
  }
});

