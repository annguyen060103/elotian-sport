import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['gym-crm-fe.lehaitien.site'],
    proxy: {
      '/auth': {
        target: 'https://gym-crm.lehaitien.site',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
