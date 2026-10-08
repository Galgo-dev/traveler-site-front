// Configuration de prévisualisation locale (session Claude) : proxy /api pour contourner le CORS limité au port 5173.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: process.cwd(),
  plugins: [react()],
  server: { port: 5180, proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } } },
})
