import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export const handleDownloadExcel = (dataEntries) => {
  const now = new Date();
  const formattedDate = now.toLocaleString();

  const worksheetData = dataEntries.map((entry, index) => ({
    Num: index + 1,
    "Durée (µs)": entry.duree_us,
    "Capacité (pF)": entry.valeur_pF,
  }));

  const worksheet = XLSX.utils.json_to_sheet([], { skipHeader: true });

  // Ligne 1 : Date
  XLSX.utils.sheet_add_aoa(worksheet, [[`Date et heure de téléchargement : ${formattedDate}`]], { origin: "A1" });

  // Fusionner A1 à C1
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

  // Ligne 2 : En-têtes
  XLSX.utils.sheet_add_aoa(worksheet, [["Num", "Durée (µs)", "Capacité (pF)"]], { origin: "A2" });

  // Données à partir de la ligne 3
  XLSX.utils.sheet_add_json(worksheet, worksheetData, { origin: "A3", skipHeader: true });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Mesures");

  XLSX.writeFile(workbook, "donnees_capteur_IDT.xlsx");
};

export const downloadChartAsPNG = (chartRef, fileName) => {
  if (!chartRef.current) return;

  const now = new Date().toLocaleString();
  const originalCanvas = chartRef.current;
  const width = originalCanvas.width;
  const height = originalCanvas.height;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height + 40;

  const ctx = tempCanvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  ctx.drawImage(originalCanvas, 0, 0);

  // Ajoute date/heure
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Téléchargé le : ${now}`, 10, height + 25);

  const link = document.createElement("a");
  link.download = fileName;
  link.href = tempCanvas.toDataURL("image/png", 1.0);
  link.click();
};

export const downloadChartsAsPDF = (chartRef) => {
  const now = new Date().toLocaleString();
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [chartRef.current.width, chartRef.current.height + 60],
  });

  if (chartRef.current) {
    const canvas = chartRef.current;
    const imgData = canvas.toDataURL("image/png", 1.0);

    const imgWidth = canvas.width * 0.8;
    const imgHeight = canvas.height * 0.8;
    const pageWidth = pdf.internal.pageSize.getWidth();

    const xCentered = (pageWidth - imgWidth) / 2;

    pdf.text(`Téléchargé le : ${now}`, 10, 20);
    pdf.addImage(imgData, "PNG", xCentered, 30, imgWidth, imgHeight);
  }
  pdf.save("graphique_IDT.pdf");
};
