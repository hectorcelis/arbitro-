const inputEquipo1 = document.querySelector("#seleccionar1");
const inputEquipo2 = document.querySelector("#seleccionar2");

const formularios = document.querySelectorAll("form");
formularios.forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const equipo1 = inputEquipo1.value;
    const equipo2 = inputEquipo2.value;

  
  if(equipo1 == equipo2 && equipo1!== ""){
   alert(" error usted no puede jugar contra su mismo equipo")
   return;
  }

    console.log("partido valido")
    console.log("Equipo 1 Elegido", equipo1);
    console.log("Equipo 2 Elegido", equipo2);  
  localStorage.setItem("Equipo Local" , equipo1)
  localStorage.setItem("Equipo Visitante" , equipo2)
  console.log("Equipos listos")
  
  window.location.href = "partido.html";

  });
});

const nombrelocal = localStorage.getItem("Equipo Local");
const nombrevisitante = localStorage.getItem("Equipo Visitante");

const titulolocal = document.querySelector("#nombre-local");
const titulovisitante = document.querySelector("#nombre-visitante");
      if( nombrelocal && nombrevisitante){
        titulolocal.textContent = nombrelocal;
        titulovisitante.textContent = nombrevisitante;
      }
      else{
        alert("No hay equipos seleccionados volviendo al inicio");
        window.location.href = "index.html";
      }

        let contadorLocal = 0;
        let contadorVisita = 0;

        const MarcadorGolesLocal = document.querySelector("#goles-local");
        const BotonGolLocal = document.querySelector("#btn-gol-local");

         const MarcadorGolesVisitante = document.querySelector("#goles-visita");
         const BotonGolVisitante = document.querySelector("#btn-gol-visita");
         
        BotonGolLocal.addEventListener("click", () =>{
        contadorLocal++;
        MarcadorGolesLocal.textContent = contadorLocal;
        });
         
          
        BotonGolVisitante.addEventListener("click", () =>{
        contadorVisita++;
        MarcadorGolesVisitante.textContent = contadorVisita;
        });

      
