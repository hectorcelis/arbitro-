import { guardarPartido } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = localStorage.getItem('usuarioLogueado');

    if (!usuarioActivo) {
        alert('Acceso denegado: Debes registrarte e iniciar sesión para iniciar un partido.');
        window.location.href = 'login.html';
        return;
    }

    const btnTerminar = document.querySelector('#btn-terminar');

    if (btnTerminar) {
        btnTerminar.addEventListener('click', async (e) => {
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