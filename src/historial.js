document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = localStorage.getItem('usuarioLogueado');

    if (!usuarioActivo) {
        alert('Acceso denegado: Debes iniciar sesión para ver el historial.');
        window.location.href = 'login.html';
        return;
    }

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