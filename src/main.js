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

            const equipo1 = document.querySelector('#seleccionar1').value.trim();
            const equipo2 = document.querySelector('#seleccionar2').value.trim();

            if (equipo1 === equipo2 && equipo1 !== '') {
                alert('Error: Un equipo no puede jugar contra sí mismo.');
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