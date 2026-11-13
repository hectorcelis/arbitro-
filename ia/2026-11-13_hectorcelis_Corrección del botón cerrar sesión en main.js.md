# Corrección del botón cerrar sesión en main.js (Entrega 2)

**Fecha:** 2026-10-28
**Integrante:** Héctor Celis (@hectorcelis)
**Herramienta y modelo:** Gemini
**Archivos afectados:** `src/main.js`

## Objetivo
Arreglar el evento del botón de cerrar sesión para que cumpla con la rúbrica de la Entrega 2, la cual exige que al salir se limpie el estado del usuario en el `localStorage`[cite: 10].

## Conversación (texto completo, sin editar)

### Prompt 1
oye para seguir corrigiendo el main por la entrega 2, la rúbrica pide explícitamente que el cierre de sesión "limpie el estado". el botón que tenemos en el html no está haciendo eso, ¿qué le debo corregir al código de ese botón para que borre de verdad el usuario del localstorage y te mande al index sin dejarte volver atrás? pásame la corrección con las etiquetas de ia pero en la ruta déjalo con hectorcelis.

### Respuesta 1
¡Claro! El problema es que probablemente tu botón solo estaba redirigiendo sin destruir los datos. Para corregir eso y cumplir con la rúbrica, debes incluir `localStorage.removeItem` antes de hacer el `replace`[cite: 10].

Aquí tienes el código corregido para ese botón, pégalo dentro de tu `DOMContentLoaded`:

```javascript
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
```

## Qué se incorporó al proyecto
- Se corrigió el `addEventListener` del botón `#btn-cerrar-sesion`, agregando la limpieza del `localStorage` requerida por la evaluación para asegurar que el estado simulado se cierre completamente[cite: 10].

## Verificación
Se probó darle clic a "Cerrar sesión" en el dashboard. Se inspeccionó la pestaña Application/Storage en el navegador y se comprobó que el usuario efectivamente desaparece, arreglando el problema de estado fantasma.