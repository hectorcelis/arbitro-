import { iniciarSesion, registrarUsuario, obtenerEquipos } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const formLogin = document.querySelector('#form-login');
    const formRegistro = document.querySelector('#form-registro');
    const formEquipos = document.querySelector('#form-equipos');

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

            const nuevoUsuario = {
                correo,
                contrasena
            };

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
                
                // Reseteamos las selecciones para que pueda elegir de nuevo
                select1.value = '';
                select2.value = '';
                select1.focus(); // Coloca el cursor/foco de nuevo en el primer selector
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
});

async function cargarEquipos() {
    const datalist = document.querySelector('#equipos-lista');
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