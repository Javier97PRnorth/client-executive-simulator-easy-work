const runButton = document.querySelector("#run-demo");
const resultPlaceholder = document.querySelector("#result-placeholder");
const resultTable = document.querySelector("#result-table-wrap");
const downloadButton = document.querySelector("#download-csv");
const statusMessage = document.querySelector("#sim-status");
const toast = document.querySelector("#toast");
const slides = [...document.querySelectorAll(".slide")];
const previousButton = document.querySelector("#previous-slide");
const nextButton = document.querySelector("#next-slide");
const progressCount = document.querySelector("#progress-count");
const progressDots = [...document.querySelectorAll(".progress-dots button")];
let activeSlide = 0;
let toastTimer;

function showSlide(index, focusHeading = true) {
  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  activeSlide = nextIndex;
  document.body.classList.toggle("privacy-mode", activeSlide === 6);

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.hidden = !isActive;
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  progressCount.innerHTML = `${String(activeSlide + 1).padStart(2, "0")} <span>/ ${String(slides.length).padStart(2, "0")}</span>`;
  progressDots.forEach((dot, dotIndex) => {
    if (dotIndex === activeSlide) dot.setAttribute("aria-current", "step");
    else dot.removeAttribute("aria-current");
  });
  previousButton.disabled = activeSlide === 0;
  nextButton.disabled = activeSlide === slides.length - 1;

  if (focusHeading) {
    const heading = slides[activeSlide].querySelector("h1, h2");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
}

function announce(message, isError = false) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3500);
}

previousButton.addEventListener("click", () => showSlide(activeSlide - 1));
nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
progressDots.forEach((dot) => {
  dot.addEventListener("click", () => showSlide(Number(dot.dataset.slide)));
});
document.querySelectorAll("[data-go-to]").forEach((button) => {
  button.addEventListener("click", () => showSlide(Number(button.dataset.goTo)));
});
document.querySelector("#home-link").addEventListener("click", (event) => {
  event.preventDefault();
  showSlide(0);
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;

  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    showSlide(activeSlide + 1);
  } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    showSlide(activeSlide - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    showSlide(0);
  } else if (event.key === "End") {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});

runButton.addEventListener("click", () => {
  runButton.disabled = true;
  runButton.innerHTML = 'Revisando fuentes <span aria-hidden="true">…</span>';
  statusMessage.textContent = "Simulación en curso…";

  window.setTimeout(() => {
    resultPlaceholder.hidden = true;
    resultTable.hidden = false;
    downloadButton.disabled = false;
    runButton.disabled = false;
    runButton.innerHTML = 'Ejemplo preparado <span aria-hidden="true">✓</span>';
    statusMessage.textContent = "Listo: hay un dato marcado como pendiente de confirmación.";
    showSlide(4);
  }, 650);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) {
      announce("No se encontró el texto que querías copiar.", true);
      return;
    }

    const text = source.value ?? source.textContent;
    try {
      await navigator.clipboard.writeText(text);
      announce("Instrucción copiada. Puedes pegarla en Copilot Chat.");
    } catch (error) {
      source.focus();
      if (typeof source.select === "function") source.select();
      announce("El navegador no permitió copiar automáticamente. Selecciona el texto y cópialo manualmente.", true);
    }
  });
});

document.querySelectorAll(".source-detail").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".source-detail[open]").forEach((otherDetail) => {
      if (otherDetail !== detail) otherDetail.open = false;
    });
  });
});

downloadButton.addEventListener("click", () => {
  const rows = [
    ["Campo", "Borrador", "Referencia de origen", "Cita / revisión", "Estado"],
    ["Vencimiento", "31/01/2027", "poliza_lumen_2026.pdf, p. 2, líneas 4-5", "Periodo: 01/02/2026 a 31/01/2027", "Revisar"],
    ["Prima anual", "48.200 EUR", "poliza_lumen_2026.pdf, p. 4, línea 3", "Prima anual neta: 48.200 EUR", "Revisar"],
    ["Límite principal", "2.000.000 EUR", "poliza_lumen_2026.pdf, p. 3, líneas 8-9", "Límite máximo por siniestro: 2.000.000 EUR", "Revisar"],
    ["Siniestros pagados", "12.400 EUR; 3 casos", "historial_siniestros.xlsx, hoja Siniestros, B8:D10", "Rango de ejemplo; tres registros suman 12.400 EUR", "Revisar"],
    ["Ampliación de cobertura", "", "seguimiento_cliente.msg, asunto Renovación, párrafo 2", "Aún no se ha definido el límite solicitado", "Por confirmar"],
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";")).join("\r\n")}`;
  const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ficha-renovacion-ejemplo-ficticio.csv";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce("CSV ficticio descargado. Puedes abrirlo con Excel.");
});
