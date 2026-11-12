import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        registro: resolve(__dirname, 'registro.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        partido: resolve(__dirname, 'partido.html'),
        partidos: resolve(__dirname, 'partidos.html'),
        historial: resolve(__dirname, 'historial.html'),
        error404: resolve(__dirname, '404.html')
      }
    }
  }
});