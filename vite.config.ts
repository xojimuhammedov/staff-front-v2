import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

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
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      'tailwind-config': path.resolve(__dirname, './tailwind.config.js')
    }
  },
  server: {
    host: true
  }
});
