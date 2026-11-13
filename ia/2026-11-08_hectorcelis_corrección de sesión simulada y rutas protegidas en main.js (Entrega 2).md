# Corrección de sesión simulada y rutas protegidas en main.js (Entrega 2)

**Fecha:** 2026-10-28
**Integrante:** Héctor Celis (@hectorcelis)
**Herramienta y modelo:** Gemini
**Archivos afectados:** `src/main.js`

## Objetivo
Corregir el código de navegación inicial en `src/main.js` para cumplir con el requerimiento de la Entrega 2 ("Sesión simulada y rutas protegidas"), arreglando el acceso para que valide el `localStorage` y bloquee correctamente las vistas privadas[cite: 10].

## Conversación (texto completo, sin editar)

### Prompt 1
oye revisando la rúbrica de la entrega 2 caché que nos piden sesión simulada y rutas protegidas usando localStorage. el main.js que tenemos no está haciendo eso bien porque deja entrar por url directa. ¿qué le debo corregir al código del principio para que bloquee las vistas privadas (dashboard, partido, historial) y exija que haya un usuarioLogueado? onda que tire alerta, mande al login usando replace para bloquear el botón atrás, y que también revise la caché con pageshow. pásame el arreglo con los comentarios de ia pero en la ruta déjalo con hectorcelis.

### Respuesta 1
¡Entendido! Para que tu código cumpla con ese punto de la rúbrica, tienes que corregir la validación inicial para que evalúe si la URL es pública o privada, y luego inyectar la verificación del `localStorage`[cite: 10]. 

Reemplaza tu código inicial del `src/main.js` con esta versión corregida:

```javascript
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
```

## Qué se incorporó al proyecto
- Se reemplazó el control de acceso antiguo por la función corregida `protegerRuta()` y el evento `pageshow`, solucionando la vulnerabilidad de las rutas y cumpliendo con la exigencia de usar el `localStorage` como sesión simulada[cite: 10].

## Verificación
Se intentó vulnerar el código corregido entrando directo a `dashboard.html` sin sesión activa, comprobando que ahora sí bloquea el acceso, lanza la alerta y te devuelve al login de forma segura.