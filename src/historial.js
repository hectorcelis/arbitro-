import { obtenerPartidos, eliminarPartido, actualizarPartido } from './api.js';

// [IA] inicio ia/2026-10-28_hectorcelis_integracion-y-rutas.md
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

// ---------- Utilidades ----------
// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
function escapar(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
// [IA] fin
}

function normalizar(texto) {
    return String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function formatearFecha(valor) {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return valor;
    return fecha.toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
}

function tiempo(partido) {
    const t = new Date(partido.fecha).getTime();
    return Number.isNaN(t) ? 0 : t;
}

const numero = (valor) => Number(valor) || 0;
const totalGoles = (p) => numero(p.goles?.local) + numero(p.goles?.visitante);
const totalRojas = (p) => numero(p.tarjetasRojas?.local) + numero(p.tarjetasRojas?.visitante);

let partidos = [];          
let cargado = false;        
let idPendiente = null;     
let contenedor, resumen, inputBuscar, selectFiltro, selectOrden, modalEliminar, modalEditar;

// ---------- Toasts ---------
function mostrarToast(mensaje, tipo = 'ok') {
    const zona = document.querySelector('#toasts');
    if (!zona) return;

    const toast = document.createElement('div');
    toast.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    toast.className = `rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${tipo === 'error' ? 'bg-red-700' : 'bg-emerald-700'}`;
    toast.textContent = mensaje;
    zona.appendChild(toast);

    setTimeout(() => toast.remove(), 3500);
}

// ---------- Tarjetas y estados ----------
// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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
// [IA] fin
}

function mostrarCargando() {
    contenedor.innerHTML = `
        <div role="status" class="flex items-center justify-center gap-3 rounded-xl bg-white p-8 shadow md:col-span-2">
            <span class="h-6 w-6 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700"></span>
            <span class="text-slate-600">Cargando partidos...</span>
        </div>
    `;
}

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

function mostrarSinResultados() {
    contenedor.innerHTML = `
        <div class="rounded-xl bg-white p-8 text-center shadow md:col-span-2">
            <p class="text-lg font-semibold text-slate-700">Ningún partido coincide con la búsqueda.</p>
            <p class="mt-1 text-slate-500">Prueba con otro nombre o cambia el filtro.</p>
        </div>
    `;
}

// ---------- Búsqueda, filtro y orden ----------
// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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
// [IA] fin
}

// Dibuja la lista según la búsqueda, el filtro y el orden actuales (sin recargar la página)
// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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
// [IA] fin
}

// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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
// [IA] fin
}

// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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
// [IA] fin


function ponerError(campo, mensaje) {
    const error = document.querySelector(`#error-${campo}`);
    const input = document.querySelector(`#editar-${campo}`);
    error.textContent = mensaje;
    error.classList.toggle('hidden', !mensaje);
    input.classList.toggle('border-red-500', Boolean(mensaje));
    input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
}

// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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
// [IA] fin

function abrirEditar(id) {
    const partido = partidos.find((p) => String(p.id) === String(id));
    if (!partido) return;

    idPendiente = partido.id;
    document.querySelector('#subtitulo-editar').textContent = `${partido.equipoLocal} vs ${partido.equipoVisitante}`;
    document.querySelector('#editar-goles-local').value = numero(partido.goles?.local);
    document.querySelector('#editar-goles-visitante').value = numero(partido.goles?.visitante);
    document.querySelector('#editar-incidencias').value = partido.incidencias ?? '';

    ['goles-local', 'goles-visitante', 'incidencias'].forEach((campo) => ponerError(campo, ''));
    modalEditar.showModal();
}

// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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

// ---------- Inicio ----------
document.addEventListener('DOMContentLoaded', () => {
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

    resumen = document.querySelector('#resumen');
    inputBuscar = document.querySelector('#buscar');
    selectFiltro = document.querySelector('#filtro');
    selectOrden = document.querySelector('#orden');
    modalEliminar = document.querySelector('#modal-eliminar');
    modalEditar = document.querySelector('#modal-editar');

    
    inputBuscar.addEventListener('input', pintarLista);
    selectFiltro.addEventListener('change', pintarLista);
    selectOrden.addEventListener('change', pintarLista);

    
    contenedor.addEventListener('click', (e) => {
        const boton = e.target.closest('button[data-accion]');
        if (!boton) return;
        if (boton.dataset.accion === 'eliminar') abrirEliminar(boton.dataset.id);
        if (boton.dataset.accion === 'editar') abrirEditar(boton.dataset.id);
    });

  
    document.querySelector('#cancelar-eliminar').addEventListener('click', () => modalEliminar.close());
    document.querySelector('#confirmar-eliminar').addEventListener('click', confirmarEliminar);
    document.querySelector('#cancelar-editar').addEventListener('click', () => modalEditar.close());
    document.querySelector('#form-editar').addEventListener('submit', guardarEdicion);

    [modalEliminar, modalEditar].forEach((modal) => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.close();
        });
    });

    cargarHistorial();
});