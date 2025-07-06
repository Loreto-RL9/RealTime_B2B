const sheetID = '1RNlIfAE7DYteMDfjHWCNi7DIEbsHb6xbxEhfvVSoRsQ';
const sheetName = 'Estado';
const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

let grupos = [];
let indiceGrupo = 0;
let dataCompleta = [];
let intervaloCarrusel;
let pausado = false;

const estadoFiltro = document.getElementById("estadoFiltro");
const requerimientoFiltro = document.getElementById("requerimientoFiltro");
const botonCarrusel = document.getElementById("toggleCarrusel");

estadoFiltro.addEventListener("change", aplicarFiltros);
requerimientoFiltro.addEventListener("input", aplicarFiltros);
botonCarrusel.addEventListener("click", toggleCarrusel);

function toggleCarrusel() {
  pausado = !pausado;
  botonCarrusel.textContent = pausado ? "▶️ Reanudar" : "⏸️ Pausar";
}

async function actualizar() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    dataCompleta = data;
    aplicarFiltros();
    document.getElementById("timestamp").innerText =
      "Última actualización: " + new Date().toLocaleTimeString();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

function aplicarFiltros() {
  const estado = estadoFiltro.value;
  const reqTexto = requerimientoFiltro.value.toLowerCase();

  const filtrados = dataCompleta.filter(item => {
    const coincideEstado = estado === "Todos" || item.Disponibilidad === estado;
    const coincideReq = item.Requerimientos?.toLowerCase().includes(reqTexto);
    return coincideEstado && coincideReq;
  });

  // Agrupar de 20 en 20
  grupos = [];
  for (let i = 0; i < filtrados.length; i += 20) {
    grupos.push(filtrados.slice(i, i + 20));
  }

  indiceGrupo = 0;
  mostrarGrupo(indiceGrupo);
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

// Actualización cada 10s
actualizar();
setInterval(actualizar, 10000);

// Carrusel cada 20s
intervaloCarrusel = setInterval(() => {
  if (!pausado && grupos.length > 0) {
    indiceGrupo = (indiceGrupo + 1) % grupos.length;
    mostrarGrupo(indiceGrupo);
  }
}, 20000);
