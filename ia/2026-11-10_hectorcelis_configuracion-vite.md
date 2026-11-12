- **Fecha:** 2026-11-10
- **Integrante:** Héctor Celis (@hectorcelis)
- **Herramienta y modelo:** Gemini
- **Archivos afectados:** `vite.config.js`

## Objetivo
Configurar el empaquetador Vite para que al compilar el proyecto no genere solo el `index.html`, sino todas las vistas del sistema, y asegurar que el entorno de desarrollo utilice el puerto 5173.

## Conversación (texto completo, sin editar)

### Prompt 1
Gemini, en mi proyecto estoy usando Vite. Cuando hago `npm run build`, solo me compila el archivo `index.html` y me ignora el resto de las vistas. ¿Cómo puedo hacer un archivo `vite.config.js` para que reconozca mis otras páginas (login.html, registro.html, dashboard.html, partido.html, partidos.html, historial.html y 404.html) y para que al hacer `npm run dev` se levante obligatoriamente en el puerto 5173?

dame la explicación paso a paso y el bloque de código listo para copiar y pegar, y recuerda agregar los comentarios de marcado de IA ([IA] inicio y [IA] fin) en el código según lo que pide la rúbrica.

### Respuesta 1
¡Hola! Con gusto. El problema ocurre porque Vite, por defecto, asume que tu aplicación es de una sola página (SPA) y solo busca el `index.html`. Para solucionarlo, debemos indicarle explícitamente cuáles son las múltiples entradas (Multi-Page Application) en su configuración.

A continuación te entrego el paso a paso y el código exacto:

#### Paso 1: Crear el archivo de configuración
En la raíz de tu proyecto (al mismo nivel que tu `package.json`), crea un archivo llamado exactamente `vite.config.js`.

#### Paso 2: Pegar la configuración de Vite
Copia y pega el siguiente bloque de código dentro de ese archivo. Esto le dirá a Vite que obligue el puerto 5173 en desarrollo, que tu carpeta pública se llama `public` y, lo más importante, las rutas de todas tus vistas HTML para el proceso de compilación (`build`):

```javascript
// [IA] inicio ia/2026-11-10_hectorcelis_configuracion-vite.md
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
// [IA] fin