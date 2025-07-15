let nombre = localStorage.getItem("comprador");

if (!nombre) {
  document.getElementById("modalNombre").style.display = "flex";
} else {
  document.getElementById("formularioCard").style.display = "block";
}

function guardarNombre() {
  const input = document.getElementById("inputNombre").value.trim();
  if (input) {
    localStorage.setItem("comprador", input);
    nombre = input;
    document.getElementById("modalNombre").style.display = "none";
    document.getElementById("formularioCard").style.display = "block";
  }
}

function enviar() {
  const disponibilidad = document.getElementById("disponibilidad").value;
  const requerimientos = Array.from(
    document.querySelectorAll('#requerimientos input[type="checkbox"]:checked')
  ).map(opt => opt.value);

  fetch(`https://qqegzhoxhzsgcqiulqul.supabase.co/rest/v1/Estado?Compradores=eq.${encodeURIComponent(nombre)}`, {
    method: "PATCH",
    headers: {
      "apikey": "TU_API_KEY",
      "Authorization": "Bearer TU_API_KEY",
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({
      Disponibilidad: disponibilidad,
      Requerimientos: requerimientos,
    }),
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("mensaje").textContent = "Actualizado correctamente.";
    document.getElementById("mensaje").style.color = "green";
  })
  .catch(() => {
    document.getElementById("mensaje").textContent = "Error al actualizar.";
    document.getElementById("mensaje").style.color = "red";
  });
}
