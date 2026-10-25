const formRegistro = document.querySelector("#form-registro");
if (formRegistro) {
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.querySelector("#correo").value;
    const contrasena = document.querySelector("#contrasena").value;

    localStorage.setItem("usuarioLogueado", JSON.stringify({ correo }));
    alert("¡Registro exitoso!");
    window.location.href = "dashboard.html";
  });
}

const formEquipos = document.querySelector("#form-equipos");
if (formEquipos) {
  formEquipos.addEventListener("submit", (e) => {
    e.preventDefault();
    const equipo1 = document.querySelector("#seleccionar1").value.trim();
    const equipo2 = document.querySelector("#seleccionar2").value.trim();

    if (equipo1 === equipo2 && equipo1 !== "") {
      alert("Error: Un equipo no puede jugar contra sí mismo.");
      return;
    }

    localStorage.setItem("Equipo Local", equipo1);
    localStorage.setItem("Equipo Visitante", equipo2);

    window.location.href = "partidos.html";
  });
}

      
