const sheetID = '1RNlIfAE7DYteMDfjHWCNi7DIEbsHb6xbxEhfvVSoRsQ';
const sheetName = 'Estado';
const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

let grupos = [];
let indiceGrupo = 0;

async function actualizar() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // Agrupar de 20 en 20
    grupos = [];
    for (let i = 0; i < data.length; i += 20) {
      grupos.push(data.slice(i, i + 20));
    }

    mostrarGrupo(indiceGrupo);

    document.getElementById("timestamp").innerText =
      "Última actualización: " + new Date().toLocaleTimeString();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

function mostrarGrupo(indice) {
  const panel = document.getElementById("panel");
  panel.innerHTML = "";

  const grupo = grupos[indice] || [];

  grupo.forEach(({ Compradores: nombre, Disponibilidad: estado, Requerimientos: requerimientos }) => {
    const div = document.createElement("div");
    const emoji = estado === "Disponible" ? "🟢" : estado === "Ocupado" ? "🟠" : "☕";
    div.className = `estado ${estado.replace(/\s/g, '')}`;
    div.innerHTML = `<strong>${emoji} ${nombre}</strong> - ${estado}<br><em>${requerimientos}</em>`;
    panel.appendChild(div);
  });
}

actualizar();
setInterval(actualizar, 10000); // actualiza datos cada 10s

// carrusel de grupos cada 20s
setInterval(() => {
  if (grupos.length > 0) {
    indiceGrupo = (indiceGrupo + 1) % grupos.length;
    mostrarGrupo(indiceGrupo);
  }
}, 20000);
