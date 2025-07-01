
const sheetID = '1RNlIfAE7DYteMDfjHWCNi7DIEbsHb6xbxEhfvVSoRsQ';
const sheetName = 'Estado';
const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

async function actualizar() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const panel = document.getElementById("panel");
    panel.innerHTML = "";

    data.forEach(({ Compradores: nombre, Disponibilidad: estado, Requerimientos: requerimientos }) => {
      const div = document.createElement("div");
      const emoji = estado === "Disponible" ? "🟢" : estado === "Ocupado" ? "🔴" : "☕";
      div.className = `estado ${estado.replace(/\s/g, '')}`;
      div.innerHTML = `<strong>${emoji} ${nombre}</strong> - ${estado}<br><em>${requerimientos}</em>`;
      panel.appendChild(div);
    });

    document.getElementById("timestamp").innerText = "Última actualización: " + new Date().toLocaleTimeString();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

actualizar();
setInterval(actualizar, 5000);
