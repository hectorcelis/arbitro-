# Refactorización del acta: estilos con Tailwind, semántica y reemplazo de alertas nativas

**Fecha:** 2026-11-11
**Integrante:** Daniel Ayala (@daniev29)
**Herramienta y modelo:** Gemini
**Archivos afectados:** `partidos.html`, `src/partidos.js`

## Objetivo
El profesor indicó en la pre-entrega que debíamos eliminar los `alert()` y `confirm()` nativos en la creación del acta, y también aplicar diseño responsivo. Consulté a la IA para que me guiara en cómo integrar un `<dialog>` nativo de HTML y cómo estructurar el formulario de manera semántica con Tailwind, ya que al quitar nuestro CSS base el formulario había perdido todo su formato.

## Conversación (texto completo, sin editar)

### Prompt 1
Gemini, estoy arreglando la vista `partidos.html` de mi proyecto de la universidad. Quité nuestro CSS antiguo para usar solo Tailwind, pero ahora el formulario de registro del partido se ve súper crudo y sin formato porque Tailwind resetea los estilos. 
Quiero estructurarlo de forma semántica usando `<fieldset>`, `<legend>` y que se vea en dos columnas en PC y una en celular. ¿Cómo aplico las clases de Tailwind a esta estructura base para los Goles, Tarjetas y Cambios?

### Respuesta 1
Es completamente normal. Tailwind CSS aplica un "preflight" que elimina todos los márgenes, bordes y tamaños de fuente por defecto de las etiquetas HTML para darte una pizarra en blanco. 

Para estructurar tu formulario de manera semántica y responsiva, debes combinar tus `<fieldset>` con un sistema de `grid`. Aquí tienes la estructura base aplicando clases utilitarias para que se vea como tarjetas en dos columnas desde pantallas medianas (`sm:` o `md:`):

```html
<form id="formulario-partido" aria-label="Formulario de registro de acta" class="mt-6 space-y-8 rounded-xl bg-white p-6 shadow sm:p-8">
  
  <!-- Ejemplo con Goles -->
  <fieldset>
    <legend class="mb-4 w-full border-b border-slate-200 pb-2 text-xl font-bold text-emerald-900">Goles</legend>
    <div class="grid gap-5 sm:grid-cols-2">
      <div class="flex flex-col">
        <label for="goles-eq1" class="mb-1 text-sm font-semibold">Equipo 1 (Local)</label>
        <input type="number" id="goles-eq1" min="0" placeholder="0" class="rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-600 focus:outline-none">
      </div>
      <div class="flex flex-col">
        <label for="goles-eq2" class="mb-1 text-sm font-semibold">Equipo 2 (Visitante)</label>
        <input type="number" id="goles-eq2" min="0" placeholder="0" class="rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-600 focus:outline-none">
      </div>
    </div>
  </fieldset>
  <!-- Repites la misma lógica de "grid gap-5 sm:grid-cols-2" para las tarjetas -->
</form>

Prompt 2
Me sirve la estructura, la voy a replicar para las amarillas y los cambios.
Ahora, el otro problema grave que tenemos es que en src/partidos.js estamos usando confirm('¿Guardar acta?') y alert('Rellena los campos'). La rúbrica nos penaliza por usar ventanas nativas. Ya tengo una función mostrarToast() para los errores, pero ¿cómo reemplazo el confirm por un modal moderno usando HTML y JavaScript sin meter librerías pesadas?

Respuesta 2
La mejor forma de hacerlo de forma nativa, accesible y moderna es usando la etiqueta <dialog> de HTML5 junto con sus métodos en JavaScript (showModal() y close()).

Primero, agrega este HTML al final de tu vista partidos.html, fuera del <main>:

<dialog id="modal-confirmar" aria-labelledby="titulo-confirmar" class="m-auto w-[90%] max-w-md rounded-xl p-0 shadow-xl backdrop:bg-black/50">
  <article class="p-6">
    <header>
      <h2 id="titulo-confirmar" class="text-xl font-bold text-emerald-900">¿Guardar acta del partido?</h2>
    </header>
    <p id="resumen-acta" class="mt-4 whitespace-pre-line text-slate-600"></p>
    
    <footer class="mt-6 flex justify-end gap-3">
      <button type="button" id="btn-cancelar" class="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700">Cancelar</button>
      <button type="button" id="btn-guardar-final" class="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50">Confirmar y Guardar</button>
    </footer>
  </article>
</dialog>

Luego, en tu src/partidos.js, en lugar de usar confirm(), capturas los datos, abres el modal y esperas el clic en el botón de confirmar final:

// Capturas el formulario y el modal
const formulario = document.querySelector('#formulario-partido');
const modal = document.querySelector('#modal-confirmar');
const btnCancelar = document.querySelector('#btn-cancelar');
const btnGuardarFinal = document.querySelector('#btn-guardar-final');

let datosPendientes = null;

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Aquí haces tus validaciones. Si falla, usas tu mostrarToast()
    // Si todo está bien, guardas temporalmente los datos:
    datosPendientes = { /* tus datos recolectados */ };
    
    // Muestras el resumen y abres el modal
    document.querySelector('#resumen-acta').textContent = "Resumen del acta...";
    modal.showModal();
});

btnCancelar.addEventListener('click', () => modal.close());

btnGuardarFinal.addEventListener('click', async () => {
    // Aquí llamas a tu API para guardar
    const respuesta = await guardarPartido(datosPendientes);
    modal.close();
    // Manejas el éxito con tu Toast
});

Prompt 3
Perfecto. Para la validación antes de abrir el modal, quiero asegurarme de que los campos de los goles y las tarjetas no estén vacíos. Si están vacíos quiero lanzar el toast de error y cortar la ejecución. ¿Cómo valido todos esos inputs numéricos de forma rápida en el submit?

Respuesta 3
Puedes recolectar los valores, hacerles .trim() y luego usar una condición simple antes de crear el objeto datosPendientes.

const goles1 = document.querySelector('#goles-eq1').value.trim();
const goles2 = document.querySelector('#goles-eq2').value.trim();
const amarillas1 = document.querySelector('#amarillas-eq1').value.trim();
const amarillas2 = document.querySelector('#amarillas-eq2').value.trim();
const rojas1 = document.querySelector('#rojas-eq1').value.trim();
const rojas2 = document.querySelector('#rojas-eq2').value.trim();

if (!goles1 || !goles2 || !amarillas1 || !amarillas2 || !rojas1 || !rojas2) {
    mostrarToast('Por favor, rellena todos los campos numéricos de goles y tarjetas.', 'error');
    return; // Corta la ejecución para que no abra el modal
}