# Corrección de fallback al cargar datos simulados en main.js (Entrega 2)

**Fecha:** 2026-10-28
**Integrante:** Héctor Celis (hectorcelis)
**Herramienta y modelo:** Gemini
**Archivos afectados:** `src/main.js`

## Objetivo
Solucionar un error en la función de carga de equipos que impedía inyectar los datos desde la capa de servicios (API simulada), para cumplir con la regla de la Entrega 2 de generar todo el contenido desde los mocks y no tener datos escritos a mano en el HTML[cite: 10].

## Conversación (texto completo, sin editar)

### Prompt 1
oye según la rúbrica de la entrega 2 no podemos tener datos a mano en el html y todo se debe generar desde los mocks. el problema es que la función cargarEquipos a veces se cae y no carga nada porque el id en el html cambia (a veces es opciones y otras equipos-lista). ¿qué le corrijo a esa línea del document.querySelector para que no se caiga más y me inyecte los datos de la api simulada siempre sin importar en qué vista esté? pásame la corrección con las etiquetas de ia pero manteniendo hectorcelis.

### Respuesta 1
El problema es que tu código actual asume que el ID siempre es idéntico, y cuando no lo encuentra, lanza un error de "null" y detiene la inyección de los datos, lo que te penalizaría en la evaluación por no renderizar desde los mocks[cite: 10].

Para corregirlo, debes agregar un "fallback" usando el operador lógico `||`. Cambia esa línea de tu función por esta:

```javascript
    // [IA] inicio ia/2026-10-28_tuusuario_integracion-y-rutas.md
    const datalist = document.querySelector('#opciones') || document.querySelector('#equipos-lista');
    // [IA] fin
```

## Qué se incorporó al proyecto
- Se corrigió el selector del `datalist` añadiendo una alternativa (`|| document.querySelector('#equipos-lista')`). Esto repara el bug visual y garantiza que los options siempre se generen dinámicamente desde el archivo JSON de la capa de servicios[cite: 10].

## Verificación
Se recargaron todas las vistas que incluyen selección de equipos. Se comprobó en la consola que el error desapareció y que los datos simulados ahora se inyectan correctamente en el HTML sin importar el ID utilizado por la vista.

