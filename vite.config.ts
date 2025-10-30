import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**']
    }
  },
  optimizeDeps: {
    include: ['tailwind-config']
  },
  plugins: [react(), tsconfigPaths(),

  VitePWA({
    registerType: 'autoUpdate', // yangi versiyalarni avtomatik yangilaydi
    devOptions: { enabled: true },
    includeAssets: ['sector.svg'],
    manifest: {
      name: 'My React App',
      short_name: 'MyApp',
      description: 'My awesome Progressive Web App built with React and Vite',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'sector.svg',
          sizes: '192x192',
          type: 'image/svg+xml'
        },
        {
          src: 'sector.svg',
          sizes: '512x512',
          type: 'image/svg+xml'
        },
        {
          src: 'sector.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any maskable'
        }
      ]
    }
  })
  ],
  resolve: {
    alias: {
      'tailwind-config': path.resolve(__dirname, './tailwind.config.js')
    }
  },
  server: {
    host: true
  },

});
