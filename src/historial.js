import { obtenerPartidos } from './api.js';

// [IA] inicio ia/2026-10-28_tuusuario_integracion-y-rutas.md
function protegerHistorial() {
    const usuarioActivo = localStorage.getItem('usuarioLogueado');
    if (!usuarioActivo) {
        alert('Acceso denegado: Debes iniciar sesión para ver el historial.');
        // Usamos replace() para que no puedan volver con el botón "Atrás"
        window.location.replace('login.html');
    }
}

// 1. Ejecutar inmediatamente al cargar el script
protegerHistorial();

// 2. Ejecutar si el usuario usa el botón "Atrás" y carga desde la caché (Bfcache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        protegerHistorial();
    }
});
// [IA] fin

// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
// Convierte caracteres especiales en texto inofensivo antes de meterlos en el HTML
function escapar(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatearFecha(valor) {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return valor;
    return fecha.toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
}

// Número para ordenar por fecha (si la fecha no se puede leer, queda al final)
function tiempo(partido) {
    const t = new Date(partido.fecha).getTime();
    return Number.isNaN(t) ? 0 : t;
}

function crearTarjeta(partido) {
    return `
        <article class="rounded-xl bg-white p-6 shadow transition hover:shadow-md">
            <header class="flex flex-wrap items-start justify-between gap-2">
                <h2 class="text-lg font-bold text-emerald-900">
                    ${escapar(partido.equipoLocal)} vs ${escapar(partido.equipoVisitante)}
                </h2>
                <p class="text-sm text-slate-500">${escapar(formatearFecha(partido.fecha))}</p>
            </header>

            <p class="mt-4 rounded-lg bg-emerald-50 py-3 text-center text-3xl font-bold text-emerald-900">
                ${escapar(partido.goles?.local ?? 0)} - ${escapar(partido.goles?.visitante ?? 0)}
            </p>

            <dl class="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <dt class="font-semibold text-slate-700">Amarillas (L / V)</dt>
                    <dd>${escapar(partido.tarjetasAmarillas?.local ?? 0)} - ${escapar(partido.tarjetasAmarillas?.visitante ?? 0)}</dd>
                </div>
                <div>
                    <dt class="font-semibold text-slate-700">Rojas (L / V)</dt>
                    <dd>${escapar(partido.tarjetasRojas?.local ?? 0)} - ${escapar(partido.tarjetasRojas?.visitante ?? 0)}</dd>
                </div>
            </dl>

            <p class="mt-4 text-sm">
                <span class="font-semibold text-slate-700">Incidencias:</span>
                ${escapar(partido.incidencias)}
            </p>
        </article>
    `;
}

let contenedor;

// Estado: cargando
function mostrarCargando() {
    contenedor.innerHTML = `
        <div role="status" class="flex items-center justify-center gap-3 rounded-xl bg-white p-8 shadow md:col-span-2">
            <span class="h-6 w-6 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700"></span>
            <span class="text-slate-600">Cargando partidos...</span>
        </div>
    `;
}

// Estado: error, con botón para reintentar
function mostrarError(mensaje) {
    contenedor.innerHTML = `
        <div role="alert" class="rounded-xl border border-red-200 bg-red-50 p-8 text-center md:col-span-2">
            <p class="font-semibold text-red-700">${escapar(mensaje)}</p>
            <button type="button" id="btn-reintentar"
                    class="mt-4 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Reintentar
            </button>
        </div>
    `;
    document.querySelector('#btn-reintentar').addEventListener('click', cargarHistorial);
}

// Estado: vacío
function mostrarVacio() {
    contenedor.innerHTML = `
        <div class="rounded-xl bg-white p-8 text-center shadow md:col-span-2">
            <p class="text-lg font-semibold text-slate-700">No hay partidos registrados aún.</p>
            <p class="mt-1 text-slate-500">Cuando guardes un acta, aparecerá aquí.</p>
            <a href="partido.html"
               class="mt-5 inline-block rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Crear partido
            </a>
        </div>
    `;
}

async function cargarHistorial() {
    mostrarCargando();

    const respuesta = await obtenerPartidos();

    if (!respuesta.ok) {
        mostrarError(respuesta.error);
        return;
    }

    if (respuesta.data.length === 0) {
        mostrarVacio();
        return;
    }

    // Las más recientes primero (.slice() copia el arreglo para no modificar el original)
    const ordenados = respuesta.data.slice().sort((a, b) => tiempo(b) - tiempo(a));
    contenedor.innerHTML = ordenados.map(crearTarjeta).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // Cerrar sesión (esta página no carga main.js, así que se maneja aquí)
    const btnCerrarSesion = document.querySelector('#btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            window.location.replace('index.html');
        });
    }

    contenedor = document.querySelector('#contenedor-historial');
    if (!contenedor) return;

    cargarHistorial();
});
// [IA] fin