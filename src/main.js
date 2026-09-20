const inputEquipo1 = document.querySelector("#seleccionar1");
const inputEquipo2 = document.querySelector("#seleccionar2");

const formularios = document.querySelectorAll("form");
formularios.forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const equipo1 = inputEquipo1.value;
    const equipo2 = inputEquipo2.value;

  
  if(equipo1 == equipo2 && equipo1!== ""){
   console.error(" error usted no puede jugar contra su mismo equipo")
   return;
  }

    console.log("partido valido")
    console.log("Equipo 1 Elegido", equipo1);
    console.log("Equipo 2 Elegido", equipo2);  
  
  
  });
});
