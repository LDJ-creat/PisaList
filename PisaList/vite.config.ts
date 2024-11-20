import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host:'0.0.0.0',
    port:5173,
    proxy: {
      '/todolist': {
          target: 'http://pizzalist.ncuhome.club',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/todolist/, '')
      }
  }
  },
})
