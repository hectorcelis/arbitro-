# Revisión general de rutas y protección del Historial (Entrega 2)

**Fecha:** 2026-10-28
**Integrante:** Héctor Celis (@hectocelis)
**Herramienta y modelo:** Gemini
**Archivos afectados:** `src/historial.js` 

## Objetivo
Solicitar a la IA una revisión general del código implementado previamente para la Entrega 2, con el fin de auditar el proyecto y detectar si faltaba cumplir algún punto de la rúbrica o si alguna vista quedó desprotegida.

## Conversación (texto completo, sin editar)

### Prompt 1
oye revisa a ver si me faltó algo de lo que hicimos antes para cumplir con la rúbrica de la entrega 2. haz una revisión general de lo que llevamos y avísame si me pillas alguna vista privada que haya quedado desprotegida o algo que se nos haya pasado. si pillas algo pásame el arreglo con las etiquetas de ia dejando el hectorcelis en la ruta.

### Respuesta 1
¡Qué bueno que preguntaste! Haciendo una revisión de las vistas de tu proyecto contra la rúbrica de la Entrega 2, te pillé un detalle importante: **se nos quedó sin proteger la página del historial**. 

Según la rúbrica, el subcriterio de "Sesión, rutas protegidas y persistencia" exige que *todas* las vistas privadas validen que exista un usuario guardado en el `localStorage` y bloqueen el acceso si no hay sesión activa. Si el profesor entra directo a la URL del historial, ahora mismo podría verlo sin estar logueado.

Aquí tienes el código que te falta para proteger esa vista usando la sesión simulada. Pégalo al inicio de tu archivo:

```javascript
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
```

## Qué se incorporó al proyecto
- Tras solicitar una revisión general a la IA, esta detectó una vulnerabilidad en la página del historial y se incorporó la función `protegerHistorial()` para asegurar que todas las rutas cumplan con el requerimiento de sesión simulada que exige la rúbrica de la Entrega 2[cite: 10].

## Verificación
Se probó escribir manualmente la URL del historial en el navegador sin tener una sesión iniciada. Se comprobó que el script intercepta correctamente la carga, lanza el mensaje de alerta y redirige al login, impidiendo volver atrás con la caché.