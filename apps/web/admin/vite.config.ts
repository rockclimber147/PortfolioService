import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Allow serving files from one level up (the apps/web/ folder)
      // so it can access the shared folder
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      // Optional: This makes imports even cleaner
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
})