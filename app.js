const runButton = document.querySelector("#run-demo");
const resultPlaceholder = document.querySelector("#result-placeholder");
const resultTable = document.querySelector("#result-table-wrap");
const resultLocked = document.querySelector("#result-locked");
const downloadButton = document.querySelector("#download-csv");
const statusMessage = document.querySelector("#sim-status");
const toast = document.querySelector("#toast");
const steps = [...document.querySelectorAll(".step")];
let toastTimer;

function announce(message, isError = false) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3500);
}

runButton.addEventListener("click", () => {
  runButton.disabled = true;
  runButton.innerHTML = 'Revisando fuentes <span aria-hidden="true">…</span>';
  statusMessage.textContent = "Simulación en curso…";

  window.setTimeout(() => {
    resultPlaceholder.hidden = true;
    resultTable.hidden = false;
    resultLocked.hidden = true;
    downloadButton.disabled = false;
    runButton.disabled = false;
    runButton.innerHTML = 'Borrador preparado <span aria-hidden="true">✓</span>';
    statusMessage.textContent = "Listo: hay un dato marcado como pendiente de confirmación.";
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === 2);
      step.classList.toggle("complete", index < 2);
    });
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

downloadButton.addEventListener("click", () => {
  const rows = [
    ["Campo", "Borrador", "Origen", "Estado"],
    ["Vencimiento", "31/01/2027", "Póliza §2", "Revisar"],
    ["Prima anual", "48.200 EUR", "Póliza §4", "Revisar"],
    ["Límite principal", "2.000.000 EUR", "Póliza §3", "Revisar"],
    ["Siniestros pagados", "12.400 EUR; 3 casos", "Historial", "Revisar"],
    ["Interés en ampliar cobertura", "", "Correo", "Por confirmar"],
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
