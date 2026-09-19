const inputEquipo1 = document.querySelector("#Seleccionar1");
const inputEquipo2 = document.querySelector("#Seleccionar2");

const formularios = document.querySelectorAll("form");
formularios.forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const equipo1 = inputEquipo1.value;
    const equipo2 = inputEquipo2.value;

    console.log("Equipo 1 Elegido", equipo1);
    console.log("Equipo 2 Elegido", equipo2);
  });
});
