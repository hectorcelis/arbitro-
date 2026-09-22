const btnTerminar = document.querySelector( "#btn-terminar");
btnTerminar.addEventListener("click", () => {
const golesEq1 = document.querySelector("#goles-eq1").value || 0;
const golesEq2 = document.querySelector("#goles-eq2").value || 0;

const amarillasEq1 = document.querySelector("#amarillas-eq1").value || 0;
const amarillasEq2 = document.querySelector("#amarillas-eq2").value || 0;

const rojasEq1 = document.querySelector("#rojas-eq1").value || 0;
const rojasEq2 = document.querySelector("#rojas-eq2").value || 0;
const incidencias = document.querySelector("#incidencias").value;
const mensaje = `¿Guardar acta?\n\nEquipo 1: ${golesEq1}\nEquipo 2: ${golesEq2}\nIncidencias: ${incidencias || 'Ninguna'}`;
if(confirm(mensaje)){
  localStorage.clear();
  window.location.replace("./index.html");
}
});