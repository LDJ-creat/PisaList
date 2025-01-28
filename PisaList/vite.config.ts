import { defineConfig } from 'vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server:{
//     host:'0.0.0.0',
//     port:5173,
//     proxy: {
//       '/todolist': {
//           target: 'http://pizzalist.ncuhome.club',
//           changeOrigin: true,
//           rewrite: (path) => path.replace(/^\/todolist/, '')
//       }
//   }
//   },
// })

// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.pisalist.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
});
