const nombrelocal = localStorage.getItem("Equipo Local");
const nombrevisitante = localStorage.getItem("Equipo Visitante");

const titulolocal = document.querySelector("#nombre-local");
const titulovisitante = document.querySelector("#nombre-visita");
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
        
         const botonTerminar = document.querySelector("#btn-terminar");
  botonTerminar.addEventListener("click", () => {
    const confirmar = confirm("¿Estás seguro de dar por terminado el partido?");
     if (confirmar) {
      localStorage.clear();
      window.location.href = "index.html";
      }
});
      
      });
