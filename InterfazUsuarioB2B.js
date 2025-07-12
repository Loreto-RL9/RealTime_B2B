const sheetURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

function guardarNombre() {
  const nombre = document.getElementById("nombreComprador").value.trim();
  if (nombre) {
    localStorage.setItem("comprador", nombre);
    document.getElementById("pantallaInicial").style.display = "none";
    document.getElementById("formulario").style.display = "block";
  } else {
    alert("Por favor, escribe tu nombre.");
  }
}

function enviarDatos() {
  const nombre = localStorage.getItem("comprador");
  const disponibilidad = document.getElementById("disponibilidad").value;
  const requerimientos = Array.from(document.getElementById("requerimientos").selectedOptions).map(opt => opt.value).join(", ");

  if (!nombre) {
    alert("Error: comprador no identificado.");
    return;
  }

  fetch(sheetURL, {
    method: "POST",
    body: new URLSearchParams({
      "Comprador": nombre,
      "Disponibilidad": disponibilidad,
      "Requerimientos": requerimientos
    })
  })
  .then(res => res.text())
  .then(msg => {
    document.getElementById("mensaje").textContent = msg;
  })
  .catch(err => {
    document.getElementById("mensaje").textContent = "Error al actualizar.";
    console.error(err);
  });
}

window.onload = () => {
  const comprador = localStorage.getItem("comprador");
  if (comprador) {
    document.getElementById("pantallaInicial").style.display = "none";
    document.getElementById("formulario").style.display = "block";
  }
};