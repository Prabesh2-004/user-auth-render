import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),tailwindcss()
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://user-auth-render-backend.onrender.com",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
