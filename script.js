const API_URL = "https://qqegzhoxhzsgcqiulqul.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWd6aG94aHpzZ2NxaXVscXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzA0ODUsImV4cCI6MjA2ODEwNjQ4NX0.iAFhr3QoYJDkP1_iXGSsDZAd_f00RxuFK0HCdvo7ryE";

let empresas = [];
let paginaActual = 0;
let intervaloCarrusel;
let pausado = false;

async function actualizar() {
  try {
    const res = await fetch(`${API_URL}/rest/v1/Estado?select=*`, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`
      }
    });
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
    (!requerimientoFiltro || (Requerimientos || "").toLowerCase().includes(requerimientoFiltro))
  );

  const pageSize = 20;
  const start = paginaActual * pageSize;
  const pageItems = filtrados.slice(start, start + pageSize);

  pageItems.forEach(({ Compradores, Disponibilidad, Requerimientos }) => {
    const div = document.createElement("div");
    const emoji =
      Disponibilidad === "Disponible"
        ? "🟢"
        : Disponibilidad === "Ocupado"
        ? "🟠"
        : "☕";
    div.className = `estado ${Disponibilidad.replace(/\s/g, '')}`;
    div.innerHTML = `<strong>${emoji} ${Compradores}</strong> - ${Disponibilidad}<br><em>${Requerimientos || ""}</em>`;
    panel.appendChild(div);
  });
}

function iniciarCarrusel() {
  intervaloCarrusel = setInterval(() => {
    const estadoFiltro = document.getElementById("filtroEstado").value;
    const requerimientoFiltro = document.getElementById("filtroRequerimiento").value.toLowerCase();
    const filtrados = empresas.filter(({ Disponibilidad, Requerimientos }) =>
      (!estadoFiltro || Disponibilidad === estadoFiltro) &&
      (!requerimientoFiltro || (Requerimientos || "").toLowerCase().includes(requerimientoFiltro))
    );

    const totalPaginas = Math.ceil(filtrados.length / 20) || 1;
    paginaActual = (paginaActual + 1) % totalPaginas;
    renderPagina();
  }, 10000); // 10 segundos
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
setInterval(actualizar, 10000); // actualiza datos cada 10 seg
iniciarCarrusel();
