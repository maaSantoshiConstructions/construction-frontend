import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Load environment variables from .env
process.env = { ...process.env, ...loadEnv('', process.cwd(), '') }

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://construction-backend-96b8.onrender.com',
        changeOrigin: true
      },
      '/uploads': {
        target: process.env.VITE_API_URL || 'https://construction-backend-96b8.onrender.com',
        changeOrigin: true
      }
    }
  }
})

