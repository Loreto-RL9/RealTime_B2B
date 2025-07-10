const sheetID = '1RNlIfAE7DYteMDfjHWCNi7DIEbsHb6xbxEhfvVSoRsQ';
const sheetName = 'Estado';
const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

let empresas = [];
let paginaActual = 0;
let intervaloCarrusel;
let pausado = false;

async function actualizar() {
  try {
    const res = await fetch(url);
    empresas = await res.json();
    paginaActual = 0;
    renderPagina();
    document.getElementById("timestamp").innerText =
      "Última actualización: " + new Date().toLocaleTimeString();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

function renderPagina() {
  const panel = document.getElementById("panel");
  panel.innerHTML = "";

  const estadoFiltro = document.getElementById("filtroEstado").value;
  const requerimientoFiltro = document.getElementById("filtroRequerimiento").value.toLowerCase();

  const filtrados = empresas.filter(({ Disponibilidad, Requerimientos }) =>
    (!estadoFiltro || Disponibilidad === estadoFiltro) &&
    (!requerimientoFiltro || Requerimientos.toLowerCase().includes(requerimientoFiltro))
  );

  const start = paginaActual * 25;
  const pageItems = filtrados.slice(start, start + 25);

  pageItems.forEach(({ Compradores, Disponibilidad, Requerimientos }) => {
    const div = document.createElement("div");
    const emoji =
      Disponibilidad === "Disponible"
        ? "🟢"
        : Disponibilidad === "Ocupado"
        ? "🟠"
        : "☕";
    div.className = `estado ${Disponibilidad.replace(/\s/g, '')}`;
    div.innerHTML = `<strong>${emoji} ${Compradores}</strong> - ${Disponibilidad}<br><em>${Requerimientos}</em>`;
    panel.appendChild(div);
  });
}

function iniciarCarrusel() {
  intervaloCarrusel = setInterval(() => {
    const estadoFiltro = document.getElementById("filtroEstado").value;
    const requerimientoFiltro = document.getElementById("filtroRequerimiento").value.toLowerCase();
    const filtrados = empresas.filter(({ Disponibilidad, Requerimientos }) =>
      (!estadoFiltro || Disponibilidad === estadoFiltro) &&
      (!requerimientoFiltro || Requerimientos.toLowerCase().includes(requerimientoFiltro))
    );

    const totalPaginas = Math.ceil(filtrados.length / 20);
    paginaActual = (paginaActual + 1) % totalPaginas;
    renderPagina();
  }, 20000); // cada 20 segundos
}

document.getElementById("toggleCarrusel").addEventListener("click", () => {
  pausado = !pausado;
  const btn = document.getElementById("toggleCarrusel");
  if (pausado) {
    clearInterval(intervaloCarrusel);
    btn.textContent = "▶️ Reanudar";
  } else {
    iniciarCarrusel();
    btn.textContent = "⏸️ Pausar";
  }
});

document.getElementById("filtroEstado").addEventListener("change", () => {
  paginaActual = 0;
  renderPagina();
});
document.getElementById("filtroRequerimiento").addEventListener("input", () => {
  paginaActual = 0;
  renderPagina();
});

actualizar();
setInterval(actualizar, 30000); // Refresca datos cada 30 segundos
iniciarCarrusel();
