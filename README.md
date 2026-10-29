# Simplificar el trabajo

Presentación web en español, organizada en 9 diapositivas, para enseñar con un caso ficticio de renovación de seguros cómo pedir a un asistente en VS Code que prepare un borrador a partir de varias fuentes y una plantilla.

## Probar la web

Abre `index.html` en un navegador. Usa los botones, los indicadores de progreso o las flechas izquierda/derecha para pasar las diapositivas. No requiere instalar dependencias, configurar un servidor ni conectarse a un modelo de AI.

## Qué incluye

- Una presentación guiada de nueve diapositivas, sin desplazamiento vertical de página.
- Una simulación interactiva de la instrucción y un borrador con localizadores exactos (página y líneas, hoja y celdas, o asunto y párrafo) y extractos para comprobar cada dato.
- Descarga de un CSV de ejemplo que se puede abrir en Excel.
- Un prompt de ejemplo para adaptar a un entorno autorizado.
- Una diapositiva de práctica con un prompt copiable para analizar los cuatro PDF de condiciones PZU incluidos en `polizas-de-test-local/`.
- Avisos claros sobre datos ficticios, privacidad y revisión humana.

La simulación es únicamente una interfaz educativa: no lee ni carga archivos, no usa Copilot y no procesa información real. Todos los nombres, fechas, importes, referencias y extractos del caso son inventados. El CSV descargable también contiene solo datos ficticios e incluye columnas para referencias, citas y estado de revisión. Los localizadores concretos cambian según el formato: por ejemplo, un PDF permite citar página y líneas; una hoja de cálculo, hoja y celdas; y un correo, asunto y párrafo.

La diapositiva de práctica ofrece `demo-paquete-polizas.zip` para descargar los cuatro PDF de `polizas-de-test-local/`: condiciones PZU para negocio, PZU Doradca y dos documentos de seguro de bienes. Están en polaco. Descomprime el ZIP y abre la carpeta extraída en VS Code; el prompt usa `RUTA_DE_TRABAJO = "."`, pide un resumen y una comparación de los dos documentos de bienes con citas breves y referencias a páginas y artículos, y propone guardar el resultado en `resultado/analisis_owu.md` sin modificar los originales. El paquete `demo-paquete.zip` sigue disponible como material independiente con documentos ficticios en texto y CSV; no forma parte del análisis de esos PDF.

## Uso responsable

El prompt mostrado es una referencia, no una aprobación para usar documentos reales. Antes de trabajar con datos de clientes, hay que confirmar las políticas de la empresa, la clasificación de los documentos y las herramientas autorizadas. Verifica cada dato en la referencia indicada y comprueba la cita en su fuente original: una referencia generada por AI también puede ser errónea. Revisa el resultado antes de guardarlo o compartirlo.

## Publicación

La presentación está publicada en [GitHub Pages](https://javier97prnorth.github.io/client-executive-simulator-easy-work/). El código fuente está en el repositorio público [Javier97PRnorth/client-executive-simulator-easy-work](https://github.com/Javier97PRnorth/client-executive-simulator-easy-work).
