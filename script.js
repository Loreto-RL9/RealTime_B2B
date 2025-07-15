const API_URL = "https://qqegzhoxhzsgcqiulqul.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZWd6aG94aHpzZ2NxaXVscXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzA0ODUsImV4cCI6MjA2ODEwNjQ4NX0.iAFhr3QoYJDkP1_iXGSsDZAd_f00RxuFK0HCdvo7ryE";

let empresas = [];
let paginaActual = 0;
let intervaloCarrusel;
let pausado = false;
const TARJETAS_POR_PAGINA = 20;

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

function obtenerFiltrados() {
  const estadoFiltro = document.getElementById("filtroEstado").value;
  const requerimientoFiltro = document.getElementById("filtroRequerimiento").value.toLowerCase();

  return empresas.filter(({ Disponibilidad, Requerimientos }) =>
    (!estadoFiltro || Disponibilidad === estadoFiltro) &&
    (!requerimientoFiltro || (Requerimientos || "").toLowerCase().includes(requerimientoFiltro))
  );
}

function renderPagina() {
  const panel = document.getElementById("panel");
  panel.innerHTML = "";

  const filtrados = obtenerFiltrados();
  const start = paginaActual * TARJETAS_POR_PAGINA;
  const pageItems = filtrados.slice(start, start + TARJETAS_POR_PAGINA);

  pageItems.forEach(({ Compradores, Disponibilidad, Requerimientos }) => {
    const div = document.createElement("div");
    const emoji =
      Disponibilidad === "Disponible" ? "🟢" :
      Disponibilidad === "Ocupado" ? "🟠" : "☕";
    div.className = `estado ${Disponibilidad.replace(/\s/g, '')}`;
    div.innerHTML = `<strong>${emoji} ${Compradores}</strong> - ${Disponibilidad}<br><em>${Requerimientos || ""}</em>`;
    panel.appendChild(div);
  });
}

function iniciarCarrusel() {
  if (intervaloCarrusel) clearInterval(intervaloCarrusel);

  intervaloCarrusel = setInterval(() => {
    const filtrados = obtenerFiltrados();
    const totalPaginas = Math.ceil(filtrados.length / TARJETAS_POR_PAGINA) || 1;

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
  if (!pausado) iniciarCarrusel(); // reinicia el carrusel
});

document.getElementById("filtroRequerimiento").addEventListener("input", () => {
  paginaActual = 0;
  renderPagina();
  if (!pausado) iniciarCarrusel();
});

actualizar();
setInterval(actualizar, 15000); // actualización de datos independiente del carrusel
iniciarCarrusel();
