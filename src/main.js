import { iniciarSesion, registrarUsuario, obtenerEquipos, guardarPartido } from './api.js';

// [IA] inicio ia/2026-10-28_tuusuario_integracion-y-rutas.md
const urlActual = window.location.href.toLowerCase();
const esPaginaPublica = 
    urlActual.includes('login.html') || 
    urlActual.includes('registro.html') || 
    urlActual.includes('index.html') || 
    window.location.pathname === '/' || 
    window.location.pathname === '';

function protegerRuta() {
    const usuarioActivo = localStorage.getItem('usuarioLogueado');
    if (!usuarioActivo && !esPaginaPublica) {
        alert('Acceso denegado: Debes iniciar sesión para acceder.');
        window.location.replace('login.html'); 
    }
}

protegerRuta();

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        protegerRuta();
    }
});
// [IA] fin

document.addEventListener('DOMContentLoaded', async () => {
    const formLogin = document.querySelector('#form-login');
    const formRegistro = document.querySelector('#form-registro');
    const formEquipos = document.querySelector('#form-equipos');
    
    // [IA] inicio ia/2026-10-28_tuusuario_integracion-y-rutas.md
    const formPartido = document.querySelector('#formulario-partido') || document.querySelector('#form-partido');
    
    // Funcionalidad para cerrar sesión
    const btnCerrarSesion = document.querySelector('#btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            // Borramos al usuario de la memoria
            localStorage.removeItem('usuarioLogueado');
            // Redirigimos bloqueando el botón "Atrás"
            window.location.replace('index.html');
        });
    }
    // [IA] fin

    await cargarEquipos();

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const correo = document.querySelector('#correo').value.trim();
            const contrasena = document.querySelector('#contrasena').value;

            const respuesta = await iniciarSesion(correo, contrasena);

            if (respuesta.ok) {
                localStorage.setItem('usuarioLogueado', JSON.stringify(respuesta.data));
                window.location.href = 'dashboard.html';
            } else {
                alert(respuesta.error);
            }
        });
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const correo = document.querySelector('#correo').value.trim();
            const contrasena = document.querySelector('#contrasena').value;

            const nuevoUsuario = { correo, contrasena };
            const respuesta = await registrarUsuario(nuevoUsuario);

            if (respuesta.ok) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                window.location.href = 'login.html';
            } else {
                alert(respuesta.error);
            }
        });
    }

    if (formEquipos) {
        formEquipos.addEventListener('submit', (e) => {
            e.preventDefault();

            const select1 = document.querySelector('#seleccionar1');
            const select2 = document.querySelector('#seleccionar2');

            const equipo1 = select1.value.trim();
            const equipo2 = select2.value.trim();

            if (equipo1 === equipo2 && equipo1 !== '') {
                alert('Error: Un equipo no puede jugar contra sí mismo.');
                select1.value = '';
                select2.value = '';
                select1.focus();
                return;
            }

            if (!equipo1 || !equipo2) {
                alert('Por favor, selecciona ambos equipos.');
                return;
            }

            localStorage.setItem('Equipo Local', equipo1);
            localStorage.setItem('Equipo Visitante', equipo2);

            window.location.href = 'partidos.html';
        });
    }

    if (formPartido) {
        // [IA] inicio ia/2026-10-28_tuusuario_validacion-nombres.md
        const camposNombres = ['#entra-eq1', '#sale-eq1', '#entra-eq2', '#sale-eq2'];
        camposNombres.forEach(selector => {
            const input = document.querySelector(selector);
            if (input) {
                input.addEventListener('input', function() {
                    // Expresión regular: permite solo letras (mayúsculas, minúsculas), acentos, la ñ y espacios.
                    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                });
            }
        });
        // [IA] fin

        formPartido.addEventListener('submit', async (e) => {
            e.preventDefault();

            const goles1 = document.querySelector('#goles-eq1');
            const goles2 = document.querySelector('#goles-eq2');
            const amarillas1 = document.querySelector('#amarillas-eq1');
            const amarillas2 = document.querySelector('#amarillas-eq2');
            const rojas1 = document.querySelector('#rojas-eq1');
            const rojas2 = document.querySelector('#rojas-eq2');
            const entra1 = document.querySelector('#entra-eq1');
            const sale1 = document.querySelector('#sale-eq1');
            const entra2 = document.querySelector('#entra-eq2');
            const sale2 = document.querySelector('#sale-eq2');
            const incidencias = document.querySelector('#incidencias');

            const campos = [
                goles1, goles2,
                amarillas1, amarillas2,
                rojas1, rojas2,
                entra1, sale1,
                entra2, sale2,
                incidencias
            ];

            const campoVacio = campos.find(campo => !campo || campo.value.trim() === '');

            if (campoVacio) {
                alert('⚠️ ¡Atención! Es obligatorio rellenar TODOS los campos del acta antes de guardar.');
                campoVacio.focus();
                return;
            }

            const mensaje = `¿Guardar acta?\n\nEquipo 1: ${goles1.value.trim()}\nEquipo 2: ${goles2.value.trim()}\nIncidencias: ${incidencias.value.trim()}`;

            if (confirm(mensaje)) {
                const equipoLocal = localStorage.getItem('Equipo Local') || 'Equipo Local';
                const equipoVisitante = localStorage.getItem('Equipo Visitante') || 'Equipo Visitante';

                const datosPartido = {
                    equipoLocal,
                    equipoVisitante,
                    goles: {
                        local: Number(goles1.value.trim()),
                        visitante: Number(goles2.value.trim())
                    },
                    tarjetasAmarillas: {
                        local: Number(amarillas1.value.trim()),
                        visitante: Number(amarillas2.value.trim())
                    },
                    tarjetasRojas: {
                        local: Number(rojas1.value.trim()),
                        visitante: Number(rojas2.value.trim())
                    },
                    cambios: {
                        local: {
                            entra: entra1.value.trim(),
                            sale: sale1.value.trim()
                        },
                        visitante: {
                            entra: entra2.value.trim(),
                            sale: sale2.value.trim()
                        }
                    },
                    incidencias: incidencias.value.trim()
                };

                const respuesta = await guardarPartido(datosPartido);

                if (respuesta.ok) {
                    alert('¡Acta de partido guardada con éxito!');
                    window.location.href = 'dashboard.html';
                } else {
                    alert(respuesta.error);
                }
            }
        });
    }
});

async function cargarEquipos() {
    // [IA] inicio ia/2026-10-28_tuusuario_integracion-y-rutas.md
    const datalist = document.querySelector('#opciones') || document.querySelector('#equipos-lista');
    // [IA] fin
    if (!datalist) return;

    const respuesta = await obtenerEquipos();

    if (respuesta.ok) {
        datalist.innerHTML = '';
        respuesta.data.forEach((equipo) => {
            const option = document.createElement('option');
            option.value = equipo.nombre;
            datalist.appendChild(option);
        });
    }
}