import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'FourLakes',
  base: '/FourLakes/',
  build: {
    outDir: '../dist/FourLakes',
    emptyOutDir: true
  },
  plugins: [react(), tailwindcss()],
});