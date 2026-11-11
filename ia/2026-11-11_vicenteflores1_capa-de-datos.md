# Capa de datos, historial dinámico y modales de edición/eliminación

- **Fecha:** 2026-11-11
- **Integrante:** Vicente Flores (@VicenteFlores1)
- **Herramienta y modelo:** Claude (Anthropic)
- **Archivos afectados:** `api.js`, `historial.html`, `historial.js`

## Objetivo
Implementar la simulación de errores y la persistencia en la capa de datos (`api.js`), la estructuración dinámica de actas con modales nativos `<dialog>` en `historial.html`, y las funciones de sanitización, filtrado y renderizado dinámico en `historial.js`.

## Conversación (texto completo, sin editar)

### Prompt 1
con los archivos que te envié de mi proyecto (api.js, historial.html e historial.js)necesito que me ayudes con lo siguiente paso a paso:

1. En api.js: agregar la simulación de errores por URL y guardar las actualizaciones de partidos en localStorage.
2. En historial.html: agregar la sección para el contenedor de tarjetas, los modales dialog para editar/eliminar y la zona para toasts.
3. En historial.js: sanitizar los datos, renderizar las tarjetas dinámicas, manejar la búsqueda, filtros, ordenamiento y la lógica de abrir y guardar cambios en los modales.

dame la explicación paso a paso y los bloques de código listos para copiar y pegar, y recuerda agregar los comentarios de marcado de IA ([IA] inicio y [IA] fin) en el código según lo que pide la rúbrica.


### Respuesta 1
¡Hola! Con gusto. A continuación te entrego la guía completa paso a paso con los bloques de código exactos que debes integrar en cada archivo para cumplir con todos los requerimientos de la entrega:

#### Paso 1: Actualización de la capa de servicios (`api.js`)
Agregamos el soporte para simulación de errores en servidor, siembra de partidos iniciales desde los datos de prueba (`/mocks/partidos.json`) y la función asíncrona para actualizar actas en `localStorage`.

```javascript
// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
function fallaForzada() {
    const porUrl = new URLSearchParams(window.location.search).get('error') === '1';
    return porUrl || localStorage.getItem('forzarError') === '1';
}

async function sembrarPartidos() {
    if (localStorage.getItem(CLAVE_SEMBRADO)) return;

    const respuesta = await fetch('/mocks/partidos.json');
    if (!respuesta.ok) throw new Error('No se pudo leer partidos.json');

    const ejemplos = await respuesta.json();
    escribirPartidos([...ejemplos, ...leerPartidos()]);
    localStorage.setItem(CLAVE_SEMBRADO, '1');
}

export async function actualizarPartido(id, cambios) {
    await simularLatencia();

    if (fallaForzada()) {
        return { ok: false, status: 500, error: 'Error simulado del servidor' };
    }

    const partidos = leerPartidos();
    const indice = partidos.findIndex((p) => String(p.id) === String(id));

    if (indice === -1) {
        return { ok: false, status: 404, error: 'El partido no existe' };
    }

    partidos[indice] = { ...partidos[indice], ...cambios };
    escribirPartidos(partidos);
    return { ok: true, status: 200, data: partidos[indice] };
}
// [IA] fin
Paso 2: Estructuración accesible de la vista (historial.html)Agregamos los scripts de las librerías CDN, el área donde se inyectan dinámicamente las tarjetas, los dos componentes modales nativos <dialog> para edición y confirmación de borrado, y el contenedor de notificaciones toast.HTML<!-- [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md -->
  <script src="[https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4](https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4)"></script>
  <script defer src="[https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js](https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js)"></script>
<!-- [IA] fin -->

<!-- [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md -->
  <!-- El contenido de las tarjetas se genera dinámicamente mediante JavaScript -->
  <section id="contenedor-historial" class="mt-6 grid gap-6 md:grid-cols-2"></section>

  <!-- Modal para confirmar la eliminación de un acta -->
  <dialog id="modal-eliminar" aria-labelledby="titulo-eliminar"
          class="m-auto w-[90%] max-w-md rounded-xl p-0 shadow-xl backdrop:bg-black/50">
    <div class="p-6">
      <h2 id="titulo-eliminar" class="text-xl font-bold text-emerald-900">¿Eliminar acta?</h2>
      <p id="texto-eliminar" class="mt-2 text-slate-600"></p>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" id="cancelar-eliminar"
                class="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">Cancelar</button>

        <button type="button" id="confirmar-eliminar"
                class="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Eliminar</button>
      </div>
    </div>
  </dialog>

  <!-- Modal para editar un acta -->
  <dialog id="modal-editar" aria-labelledby="titulo-editar"
          class="m-auto w-[90%] max-w-lg rounded-xl p-0 shadow-xl backdrop:bg-black/50">
    <form id="form-editar" novalidate class="p-6">
      <h2 id="titulo-editar" class="text-xl font-bold text-emerald-900">Editar acta</h2>
      <p id="subtitulo-editar" class="mt-1 text-slate-600"></p>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label for="editar-goles-local" class="mb-1 block text-sm font-semibold">Goles local</label>
          <input type="number" id="editar-goles-local" min="0" inputmode="numeric"
                 class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          <p id="error-goles-local" class="mt-1 hidden text-sm text-red-700" role="alert"></p>
        </div>

        <div>
          <label for="editar-goles-visitante" class="mb-1 block text-sm font-semibold">Goles visitante</label>
          <input type="number" id="editar-goles-visitante" min="0" inputmode="numeric"
                 class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          <p id="error-goles-visitante" class="mt-1 hidden text-sm text-red-700" role="alert"></p>
        </div>
      </div>

      <div class="mt-4">
        <label for="editar-incidencias" class="mb-1 block text-sm font-semibold">Incidencias</label>
        <textarea id="editar-incidencias" rows="3"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"></textarea>
        <p id="error-incidencias" class="mt-1 hidden text-sm text-red-700" role="alert"></p>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" id="cancelar-editar"
                class="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">Cancelar</button>

        <button type="submit" id="guardar-editar"
                class="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Guardar cambios</button>
      </div>
    </form>
  </dialog>

  <!-- Zona donde aparecen las notificaciones temporales -->
  <div id="toasts" class="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite"></div>

  <script type="module" src="/src/historial.js"></script>
<!-- [IA] fin -->
Paso 3: Lógica dinámica e interactividad (historial.js)Agregamos la función para sanitizar cadenas HTML, el generador de la interfaz de cada partido, la búsqueda reactiva y los controladores para abrir, validar y procesar los cambios a través de la API simulada.JavaScript// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
function escapar(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function crearTarjeta(partido) {
    const id = escapar(partido.id);
    return `
        <article class="rounded-xl bg-white p-6 shadow transition hover:shadow-md">
            <header class="flex flex-wrap items-start justify-between gap-2">
                <h2 class="text-lg font-bold text-emerald-900">
                    ${escapar(partido.equipoLocal)} vs ${escapar(partido.equipoVisitante)}
                </h2>
                <p class="text-sm text-slate-500">${escapar(formatearFecha(partido.fecha))}</p>
            </header>

            <p class="mt-4 rounded-lg bg-emerald-50 py-3 text-center text-3xl font-bold text-emerald-900">
                ${escapar(numero(partido.goles?.local))} - ${escapar(numero(partido.goles?.visitante))}
            </p>

            <dl class="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <dt class="font-semibold text-slate-700">Amarillas (L / V)</dt>
                    <dd>${escapar(numero(partido.tarjetasAmarillas?.local))} - ${escapar(numero(partido.tarjetasAmarillas?.visitante))}</dd>
                </div>
                <div>
                    <dt class="font-semibold text-slate-700">Rojas (L / V)</dt>
                    <dd>${escapar(numero(partido.tarjetasRojas?.local))} - ${escapar(numero(partido.tarjetasRojas?.visitante))}</dd>
                </div>
            </dl>

            <p class="mt-4 text-sm">
                <span class="font-semibold text-slate-700">Incidencias:</span>
                ${escapar(partido.incidencias)}
            </p>

            <footer class="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                <button type="button" data-accion="editar" data-id="${id}"
                        class="rounded-lg border border-emerald-700 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">Editar</button>
                <button type="button" data-accion="eliminar" data-id="${id}"
                        class="rounded-lg border border-red-600 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">Eliminar</button>
            </footer>
        </article>
    `;
}

function obtenerVisibles() {
    const texto = normalizar(inputBuscar.value.trim());
    const filtro = selectFiltro.value;
    const orden = selectOrden.value;

    const lista = partidos.filter((p) => {
        const equipos = normalizar(`${p.equipoLocal} ${p.equipoVisitante}`);
        if (!equipos.includes(texto)) return false;
        if (filtro === 'rojas') return totalRojas(p) > 0;
        if (filtro === 'empate') return numero(p.goles?.local) === numero(p.goles?.visitante);
        return true;
    });

    lista.sort((a, b) => {
        if (orden === 'antiguos') return tiempo(a) - tiempo(b);
        if (orden === 'goles') return totalGoles(b) - totalGoles(a);
        return tiempo(b) - tiempo(a);
    });

    return lista;
}

function pintarLista() {
    if (!cargado) return;

    if (partidos.length === 0) {
        resumen.textContent = '';
        mostrarVacio();
        return;
    }

    const visibles = obtenerVisibles();
    resumen.textContent = `Mostrando ${visibles.length} de ${partidos.length} actas.`;

    if (visibles.length === 0) {
        mostrarSinResultados();
        return;
    }

    contenedor.innerHTML = visibles.map(crearTarjeta).join('');
}

async function cargarHistorial() {
    cargado = false;
    resumen.textContent = '';
    mostrarCargando();

    const respuesta = await obtenerPartidos();

    if (!respuesta.ok) {
        mostrarError(respuesta.error);
        return;
    }

    partidos = respuesta.data;
    cargado = true;
    pintarLista();
}

function abrirEliminar(id) {
    const partido = partidos.find((p) => String(p.id) === String(id));
    if (!partido) return;

    idPendiente = partido.id;
    document.querySelector('#texto-eliminar').textContent =
        `Se eliminará el acta ${partido.equipoLocal} vs ${partido.equipoVisitante}. Esta acción no se puede deshacer.`;
    modalEliminar.showModal();
}

async function confirmarEliminar() {
    const boton = document.querySelector('#confirmar-eliminar');
    boton.disabled = true;
    boton.textContent = 'Eliminando...';

    const respuesta = await eliminarPartido(idPendiente);

    boton.disabled = false;
    boton.textContent = 'Eliminar';
    modalEliminar.close();

    if (respuesta.ok) {
        partidos = partidos.filter((p) => String(p.id) !== String(idPendiente));
        pintarLista();
        mostrarToast('Acta eliminada correctamente');
    } else {
        mostrarToast(respuesta.error, 'error');
    }
}

function validarEdicion() {
    let valido = true;

    ['goles-local', 'goles-visitante'].forEach((campo) => {
        const valor = document.querySelector(`#editar-${campo}`).value.trim();
        if (valor === '') {
            ponerError(campo, 'Este campo es obligatorio.');
            valido = false;
        } else if (!/^\d+$/.test(valor)) {
            ponerError(campo, 'Ingresa un número entero mayor o igual a 0.');
            valido = false;
        } else {
            ponerError(campo, '');
        }
    });

    if (document.querySelector('#editar-incidencias').value.trim() === '') {
        ponerError('incidencias', 'Escribe las incidencias del partido.');
        valido = false;
    } else {
        ponerError('incidencias', '');
    }

    return valido;
}

async function guardarEdicion(e) {
    e.preventDefault();
    if (!validarEdicion()) return;

    const boton = document.querySelector('#guardar-editar');
    boton.disabled = true;
    boton.textContent = 'Guardando...';

    const respuesta = await actualizarPartido(idPendiente, {
        goles: {
            local: Number(document.querySelector('#editar-goles-local').value),
            visitante: Number(document.querySelector('#editar-goles-visitante').value)
        },
        incidencias: document.querySelector('#editar-incidencias').value.trim()
    });

    boton.disabled = false;
    boton.textContent = 'Guardar cambios';
    modalEditar.close();

    if (respuesta.ok) {
        partidos = partidos.map((p) => (String(p.id) === String(idPendiente) ? respuesta.data : p));
        pintarLista();
        mostrarToast('Acta actualizada correctamente');
    } else {
        mostrarToast(respuesta.error, 'error');
    }
}
// [IA] fin
Qué se incorporó al proyecto
Las funciones de latencia, lectura de mocks y simulación de errores en api.js.  
La estructura de la interfaz responsiva, notificaciones toast y modales nativos <dialog> en historial.html.  
 La renderización segura (con escapar()), filtrado reactivo en tiempo real y controladores de modales en historial.js.  
 Verificación
Se probaron los filtros de búsqueda por nombre de equipo, empates y tarjetas rojas en el historial, verificando la reactividad en tiempo real.   
Se editaron y eliminaron actas a través de los modales <dialog>, confirmando la persistencia en localStorage.  Se verificó que al forzar un error mediante el parámetro ?error=1 en la URL se muestre el estado de error correctamente.   