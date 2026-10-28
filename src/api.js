const simularLatencia = () => {
    const tiempo = Math.floor(Math.random() * 500) + 300;
    return new Promise((resolve) => setTimeout(resolve, tiempo));
};

export async function obtenerEquipos() {
    await simularLatencia();

    try {
        const respuesta = await fetch('/Mocks/equipos.json');
        
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
        const respuesta = await fetch('/Mocks/usuarios.json');
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

export async function guardarPartido(datosPartido) {
    try {
        const historialText = localStorage.getItem('historialPartidos');
        const historialPartidos = JSON.parse(historialText) || [];
        const nuevoPartido = {
            id: Date.now(),
            fecha: new Date().toLocaleString(),
            ...datosPartido
        };
        historialPartidos.push(nuevoPartido);
        localStorage.setItem('historialPartidos', JSON.stringify(historialPartidos));
        return { ok: true };
    } catch (error) {
        return { ok: false, error: 'Error al guardar el acta.' };
    }
}
    await simularLatencia();

    try {
        const partidosGuardados = JSON.parse(localStorage.getItem('partidos')) || [];
        
        const nuevoPartido = {
            id: Date.now(),
            fechaCreacion: new Date().toISOString(),
            ...datosPartido
        };

        partidosGuardados.push(nuevoPartido);
        localStorage.setItem('partidos', JSON.stringify(partidosGuardados));

        return {
            ok: true,
            status: 201,
            data: nuevoPartido
        };
    } catch (error) {
        return {
            ok: false,
            status: 500,
            error: 'Error al guardar el partido'
        };
    }
