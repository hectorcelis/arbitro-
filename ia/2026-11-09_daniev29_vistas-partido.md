# Menú interno y vista de selección de equipos

- **Fecha:** 2026-11-09
- **Integrante:** Daniel Ayala (@Deav.ayalaviadal2907@gmail.com)
- **Herramienta y modelo:** Claude (Anthropic)
*Archivos afectados:** partido.html

## Objetivo
Rediseñar partido.html con Tailwind y Alpine y agregar el menú interno común.

Prompt 1
"Tengo este HTML básico con un formulario de selección de equipos de fútbol chileno. Quiero agregarle una barra de navegación arriba que tenga un menú hamburguesa responsivo para móviles sin tener que escribir JavaScript complejo a mano. También quiero cargar los estilos directo desde CDN con Tailwind CSS. ¿Cómo puedo modificar el header?"

Respuesta 1
*"Puedes usar Alpine.js junto a Tailwind CSS. Con Alpine declaras el estado directamente en el HTML usando x-data="{ abierto: false }".

Aquí tienes el código para el <head> y el <header> interactivo:*

<!-- Librerías -->
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- Header responsivo -->
<header class="sticky top-0 z-10 bg-emerald-800 text-white shadow"
        x-data="{ abierto: false }"
        @keydown.escape.window="abierto = false">
  <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between px-4 py-3">
    <a href="dashboard.html" class="text-lg font-bold">⚽ Acta Digital</a>
    <button type="button" @click="abierto = !abierto" class="md:hidden">☰</button>
    <nav id="menu-principal" x-cloak :class="abierto ? '' : 'max-md:hidden'" class="flex w-full flex-col md:w-auto md:flex-row">
      <a href="dashboard.html">Dashboard</a>
      <a href="partido.html" aria-current="page">Nuevo partido</a>
      <a href="historial.html">Historial</a>
    </nav>
  </div>
</header>


Prompt 2 (Usuario)
"Tengo la lista de equipos metida directamente en el HTML en un <datalist>. Quiero leerla desde un archivo equipos.json con JavaScript. ¿Qué cambio tengo que hacer en el marcado HTML?"

Respuesta 2 (IA)
*"En el HTML solo debes vaciar la etiqueta <datalist id="opciones"></datalist> y dejar que tu script main.js inserte los elementos <option> al cargar la página.

Mantén los <input> apuntando a list="opciones". Así el marcado queda limpio y desligado de los datos estáticos."*