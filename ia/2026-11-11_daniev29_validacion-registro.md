# Validación por campo en Registro y eliminación de alerts nativos

**Fecha:** 2026-11-11
**Integrante:** Daniel Ayala (@daniev29)
**Herramienta y modelo:** Gemini
**Archivos afectados:** `registro.html`, `src/main.js`

## Objetivo
La rúbrica nos castiga por usar `alert()` y depender solo de la validación nativa de HTML (`required`). Ya tenía implementado el evento `submit` del formulario y la recolección de datos, pero necesitaba saber cómo cortar la ejecución en JS si la contraseña tiene menos de 6 caracteres, y cómo mostrar un mensaje de error rojo debajo del input usando mis clases de Tailwind en lugar de una ventana emergente.

## Conversación (texto completo, sin editar)

### Prompt 1
En mi formulario de registro (`registro.html`) tengo este campo para la contraseña:
`<input type="password" id="contrasena" name="contrasena" required>`
Ya estoy capturando el `submit` en `main.js`. ¿Cómo puedo hacer para que, mediante JavaScript, verifique que la contraseña tenga mínimo 6 caracteres? Si tiene menos, quiero detener el envío, pintar el borde del input de rojo y mostrar un texto de error debajo sin usar `alert()`.

### Respuesta 1
Para lograr esto, necesitas dos cosas: un elemento en tu HTML para mostrar el error, y un bloque de validación en tu JavaScript que intercepte los datos antes de enviarlos.

1. En tu HTML, agrega un párrafo oculto debajo del input. Usaremos las clases `hidden` y `text-red-700` de Tailwind:
```html
<p id="error-contrasena" class="mt-1 hidden text-sm font-semibold text-red-700" role="alert"></p>
En tu main.js, captura ese párrafo y usa la propiedad .length del string de la contraseña. Usa classList para mostrar u ocultar el error, y el comando return para abortar la función si la validación falla:
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que se recargue la página
    
    const inputPass = document.querySelector('#contrasena');
    const errorPass = document.querySelector('#error-contrasena');
    const contrasena = inputPass.value;

    // Validación
    if (contrasena.length < 6) {
        errorPass.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        errorPass.classList.remove('hidden');
        inputPass.classList.add('border-red-500'); // Borde rojo
        return; // Detiene el código aquí
    } else {
        // Limpia el error si el usuario corrigió
        errorPass.classList.add('hidden');
        inputPass.classList.remove('border-red-500');
    }
    
    // ...resto de tu código para guardar el usuario...
});

Prompt 2
Quedó perfecto. Una última cosa: cuando el registro es exitoso o falla, en main.js estábamos haciendo alert('¡Registro exitoso!') y luego window.location.href = 'login.html'. Como ya tengo un sistema de Toasts que hice en otro archivo, quiero cambiarlo. Si reemplazo el alert por mostrarToast('Registro exitoso'), la redirección al login es tan rápida que el usuario no alcanza a leer el toast. ¿Cómo lo retraso?

Respuesta 2
Puedes envolver tu redirección (window.location.href) dentro de un setTimeout. Esto le dirá al navegador que espere una cantidad de milisegundos específica antes de ejecutar el cambio de página, dándole tiempo al Toast para mostrarse.

if (respuesta.ok) {
    mostrarToast('¡Registro exitoso! Redirigiendo...', 'ok');
    // Espera 1.5 segundos (1500 ms) antes de cambiar de página
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

Agregué el <p id="error-contrasena"> en el HTML.

Implementé el bloque if (contrasena.length < 6) propuesto por la IA para detener el submit.

Reemplacé mis viejos alert() por la función mostrarToast() que ya teníamos en el proyecto, y agregué el setTimeout para que la transición al login sea visible.