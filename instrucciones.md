# ⚽ Sistema de Acta Digital para Árbitros de Fútbol

Plataforma web diseñada para que los árbitros puedan registrar de manera digital y eficiente los acontecimientos de un partido de fútbol (goles, tarjetas, cambios e incidencias), generando un acta oficial.

## 🛠️ Tecnologías utilizadas

- **HTML5 & CSS3**
- **JavaScript (Vanilla)**: Lógica de negocio y manejo de datos en `localStorage`.
- **Vite**: Entorno de desarrollo y empaquetador (configurado como Multi-Page Application).
- **Tailwind CSS**: Framework de estilos (cargado vía CDN).
- **Alpine.js**: Interactividad ligera para componentes de la interfaz (cargado vía CDN).

## 📂 Estructura del Proyecto

- `/public/mocks/` - Archivos JSON estáticos simulando la base de datos (equipos, historial, usuarios).
- `/src/` - Archivos de lógica JavaScript (`api.js`, `main.js`, `partidos.js`) y estilos (`style.css`).
- `/ia/` - Registro individual y grupal del uso de Inteligencia Artificial.
- `*.html` - Vistas del sistema (index, login, registro, dashboard, partido, partidos, historial, 404).
- `vite.config.js` - Configuración de Vite para múltiples entradas y asignación del puerto 5173.

## 🚀 Instrucciones de Instalación y Ejecución

### Requisitos previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu computadora.

### Pasos para ejecutar en entorno de desarrollo
1. Clona este repositorio o descarga el código fuente.
2. Abre una terminal en la carpeta raíz del proyecto.
3. Instala las dependencias necesarias ejecutando:
   ```bash
   npm install
   ```
4. Levanta el servidor local de Vite con el siguiente comando:
   ```bash
   npm run dev
   ```
5. Abre tu navegador e ingresa a `http://localhost:5173` (Vite está configurado para usar estrictamente este puerto).

### Pasos para compilar (Producción)
Para generar la versión optimizada del proyecto con todas las vistas empaquetadas:
```bash
npm run build
```
Los archivos finales se generarán en la carpeta `/dist/`.

## 📖 Uso del sistema

1. **Registro e Inicio de sesión:** Crea una cuenta nueva o inicia sesión para acceder al panel.
2. **Dashboard:** Menú principal del árbitro.
3. **Nuevo Partido:** Selecciona el equipo local y visitante. Al comenzar, podrás registrar goles, tarjetas, cambios y el detalle de las incidencias.
4. **Historial:** Revisa las actas guardadas de los partidos anteriores.


