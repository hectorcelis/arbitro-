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

document.addEventListener('DOMContentLoaded', () => {
    const contenedorHistorial = document.querySelector('#contenedor-historial');

    if (contenedorHistorial) {
        const historialText = localStorage.getItem('historialPartidos');
        const partidos = JSON.parse(historialText) || [];
        
        if (partidos.length === 0) {
            contenedorHistorial.innerHTML = '<p>No hay partidos registrados aún.</p>';
            return;
        }
        
        const contenidoHTML = partidos.map((partido) => `
            <article class="acta-guardada">
                <header>
                    <h2>${partido.equipoLocal} vs ${partido.equipoVisitante}</h2>
                </header>
                <section>
                    <p>Fecha: ${partido.fecha}</p>
                    <p>Resultado final: ${partido.goles.local} - ${partido.goles.visitante}</p>
                    <p>Amarillas (L / V): ${partido.tarjetasAmarillas.local} - ${partido.tarjetasAmarillas.visitante}</p>
                    <p>Rojas (L / V): ${partido.tarjetasRojas.local} - ${partido.tarjetasRojas.visitante}</p>
                    <p>Incidencias: ${partido.incidencias}</p>
                </section>
            </article>
        `).join('');
        
        contenedorHistorial.innerHTML = contenidoHTML;
    }
});