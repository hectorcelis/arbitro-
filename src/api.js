const simularLatencia = () => {
    const tiempo = Math.floor(Math.random() * 500) + 300;
    return new Promise((resolve) => setTimeout(resolve, tiempo));
};

export async function obtenerEquipos() {
    await simularLatencia();

    try {
        const respuesta = await fetch('/mocks/equipos.json');
        
        if (!respuesta.ok) {
            return {
                ok: false,
                status: respuesta.status,
                error: 'No se pudo cargar la lista de equipos'
            };
        }

        const equipos = await respuesta.json();
        return {
            ok: true,
            status: 200,
            data: equipos
        };
    } catch (error) {
        return {
            ok: false,
            status: 500,
            error: 'Error de conexión simulado'
        };
    }
}

export async function iniciarSesion(correo, contrasena) {
    await simularLatencia();

    try {
        const respuesta = await fetch('/mocks/usuarios.json');
        const usuariosMock = await respuesta.json();

        const usuariosLocales = JSON.parse(localStorage.getItem('usuarios')) || [];
        const todosLosUsuarios = [...usuariosMock, ...usuariosLocales];

        const usuarioEncontrado = todosLosUsuarios.find(
            (u) => u.correo === correo && u.contrasena === contrasena
        );

        if (usuarioEncontrado) {
            return {
                ok: true,
                status: 200,
                data: {
                    id: usuarioEncontrado.id,
                    nombre: usuarioEncontrado.nombre,
                    correo: usuarioEncontrado.correo
                }
            };
        }

        return {
            ok: false,
            status: 401,
            error: 'Correo o contraseña incorrectos'
        };
    } catch (error) {
        return {
            ok: false,
            status: 500,
            error: 'Error al intentar iniciar sesión'
        };
    }
}

export async function registrarUsuario(nuevoUsuario) {
    await simularLatencia();

    try {
        const usuariosLocales = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        const usuarioGuardado = {
            id: Date.now(),
            ...nuevoUsuario
        };

        usuariosLocales.push(usuarioGuardado);
        localStorage.setItem('usuarios', JSON.stringify(usuariosLocales));

        return {
            ok: true,
            status: 201,
            data: usuarioGuardado
        };
    } catch (error) {
        return {
            ok: false,
            status: 500,
            error: 'Error al guardar el usuario'
        };
    }
}

const CLAVE_PARTIDOS = 'historialPartidos';
const CLAVE_SEMBRADO = 'historialSembrado';

// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
function fallaForzada() {
    const porUrl = new URLSearchParams(window.location.search).get('error') === '1';
    return porUrl || localStorage.getItem('forzarError') === '1';
}
// [IA] fin
function leerPartidos() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_PARTIDOS)) || [];
    } catch (error) {
        return [];
    }
}

function escribirPartidos(lista) {
    localStorage.setItem(CLAVE_PARTIDOS, JSON.stringify(lista));
}

// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
async function sembrarPartidos() {
    if (localStorage.getItem(CLAVE_SEMBRADO)) return;

    const respuesta = await fetch('/mocks/partidos.json');
    if (!respuesta.ok) throw new Error('No se pudo leer partidos.json');

    const ejemplos = await respuesta.json();
    escribirPartidos([...ejemplos, ...leerPartidos()]);
    localStorage.setItem(CLAVE_SEMBRADO, '1');
}
// [IA] fin
export async function obtenerPartidos() {
    await simularLatencia();

    if (fallaForzada()) {
        return { ok: false, status: 500, error: 'Error simulado del servidor' };
    }

    try {
        await sembrarPartidos();
        return { ok: true, status: 200, data: leerPartidos() };
    } catch (error) {
        return { ok: false, status: 500, error: 'No se pudo cargar el historial de partidos' };
    }
}

export async function eliminarPartido(id) {
    await simularLatencia();

    if (fallaForzada()) {
        return { ok: false, status: 500, error: 'Error simulado del servidor' };
    }

    const partidos = leerPartidos();
    if (!partidos.some((p) => String(p.id) === String(id))) {
        return { ok: false, status: 404, error: 'El partido no existe' };
    }

    escribirPartidos(partidos.filter((p) => String(p.id) !== String(id)));
    return { ok: true, status: 200, data: { id } };
}
// [IA] inicio · ia/2026-11-11_vicenteflores1_capa-de-datos.md
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
export async function guardarPartido(datosPartido) {
    await simularLatencia();

    if (fallaForzada()) {
        return { ok: false, status: 500, error: 'Error simulado del servidor' };
    }

    try {
        const nuevoPartido = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            ...datosPartido
        };
        escribirPartidos([...leerPartidos(), nuevoPartido]);
        return { ok: true, status: 201, data: nuevoPartido };
    } catch (error) {
        return { ok: false, status: 500, error: 'Error al guardar el acta.' };
    }
}
