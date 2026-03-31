import { jsPDF } from "jspdf";
import "jspdf-autotable";
import formatDate from "../../hooks/FormatDate";
import { numberPeru } from "../../assets/onInputs";

export const generarPDFRendiciones = (rendicion) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margin = 6;
  const pageWidth = doc.internal.pageSize.width;
  let currentY = 10;

  // --- LOGO CENTRADO ---
  try {
    const logoUrl = import.meta.env.VITE_LOGO;
    const logoWidth = 30;
    const logoHeight = 27;
    const xCentered = pageWidth / 2 - logoWidth / 2;
    doc.addImage(logoUrl, "JPEG", xCentered, currentY, logoWidth, logoHeight);
  } catch (error) {
    console.warn("No se pudo cargar el logo", error);
  }

  // --- CABECERA ---
  currentY += 28;

  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, currentY, pageWidth - margin * 2, 10, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(
    "COMPROBANTE DE RENDICIÓN DE GASTOS",
    pageWidth / 2,
    currentY + 6.5,
    { align: "center" },
  );

  // Fecha de impresión
  currentY += 15;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    pageWidth - margin,
    currentY,
    { align: "right" },
  );

  // --- BLOQUE DE INFORMACIÓN GENERAL ---
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 25, 2, 2, "FD"); // Reduje altura a 25 porque quité rutas y concepto

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);

  const col1 = margin + 5;
  const col2 = pageWidth / 2 + 5;
  const rowH = 7;

  // Fila 1
  doc.setFont("helvetica", "bold");
  doc.text("CORRELATIVO:", col1, currentY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.correlativo_rendicion || "-", col1 + 32, currentY + 8);

  doc.setFont("helvetica", "bold");
  doc.text("TRABAJADOR:", col2, currentY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(
    rendicion.trabajador?.nombre_trabajador || "-",
    col2 + 28,
    currentY + 8,
  );

  // Fila 2
  doc.setFont("helvetica", "bold");
  doc.text("ÁREA:", col1, currentY + 8 + rowH);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.area_rendicion || "-", col1 + 32, currentY + 8 + rowH);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA REND.:", col2, currentY + 8 + rowH);
  doc.setFont("helvetica", "normal");
  doc.text(
    formatDate(rendicion.fecha_rendida) || "-",
    col2 + 28,
    currentY + 8 + rowH,
  );

  // Fila 3
  doc.setFont("helvetica", "bold");
  doc.text("MONTO TOTAL RECIBIDO:", col1, currentY + 8 + rowH * 2);
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${numberPeru(rendicion.monto_recibido || 0)}`,
    col1 + 45,
    currentY + 8 + rowH * 2,
  );

  // ==========================================
  // --- 1. TABLA DE DESEMBOLSOS (NUEVA) ---
  // ==========================================
  currentY += 32;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLE DE DESEMBOLSOS", margin, currentY);
  currentY += 2;

  // 💡 Unificamos la lógica: Si viene el objeto antiguo lo metemos en un array, si viene el nuevo usamos ese, o un array vacío si no hay nada.
  let listaDesembolsos = [];
  if (
    rendicion.desembolsos_multiples &&
    rendicion.desembolsos_multiples.length > 0
  ) {
    listaDesembolsos = rendicion.desembolsos_multiples;
  } else if (rendicion.desembolso) {
    listaDesembolsos = [rendicion.desembolso];
  }

  const rowsDesembolsos = listaDesembolsos.map((d, index) => [
    index + 1,
    formatDate(d.fecha_desembolso) || "-",
    d.motivo_desembolso || "-",
    d.rutas_desembolso || "-",
    `S/ ${numberPeru(Math.abs(d.importe_desembolso) || 0)}`,
  ]);

  doc.autoTable({
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [["N°", "FECHA RECIBIDO", "MOTIVO / CONCEPTO", "RUTAS", "IMPORTE"]],
    body: rowsDesembolsos,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42], // Mismo color de la cabecera slate-900
      fontSize: 7,
      halign: "center",
      valign: "middle",
    },
    styles: {
      fontSize: 7,
      valign: "middle",
      halign: "center",
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 7 },
      4: { halign: "right", fontStyle: "bold", cellWidth: 25 }, // Importe alineado a la derecha
    },
  });

  // Actualizamos el cursor Y después de pintar la primera tabla
  currentY = doc.lastAutoTable.finalY + 10;

  // ==========================================
  // --- 2. TABLA DE GASTOS RENDIDOS ---
  // ==========================================
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DE LA RENDICIÓN", margin, currentY);
  currentY += 2;

  const detalles = rendicion.datos_rendicion || [];

  const tableRows = detalles.map((det, index) => [
    index + 1,
    formatDate(det.fecha_uso),
    det.razon_social,
    `${det.tipo_comprobante} - \n${det.numero_comprobante}`,
    det.categoria,
    det.detalle || "-",
    `S/ ${numberPeru(det.importe || 0)}`,
  ]);

  doc.autoTable({
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [
      [
        "N°",
        "FECHA USO",
        "PROVEEDOR",
        "COMPROBANTE",
        "CATEGORÍA",
        "DETALLE",
        "IMPORTE",
      ],
    ],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [51, 65, 85], // slate-700
      fontSize: 7,
      halign: "center",
      valign: "middle",
    },
    styles: {
      fontSize: 7,
      valign: "middle",
      halign: "center",
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 7 },
      1: { cellWidth: 18 },
      3: { cellWidth: 25 },
      6: { halign: "right", fontStyle: "bold", cellWidth: 22 },
    },
  });

  // ==========================================
  // --- 3. OBSERVACIONES (Ancho completo) ---
  // ==========================================
  let finalY = doc.lastAutoTable.finalY + 8;

  // Verificamos si hay espacio en la página actual para el cuadro de observaciones y el resumen
  if (finalY > 240) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("OBSERVACIONES GENERALES:", margin, finalY);

  finalY += 3;

  // Dibujamos un cuadro para que se vea ordenado
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, finalY, pageWidth - margin * 2, 20, 1, 1, "FD");

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // slate-600

  // autoSplitText asegura que el texto haga salto de línea si es muy largo
  const obsTexto = rendicion.observaciones_rendicion || "Sin observaciones.";
  const lineasObs = doc.splitTextToSize(obsTexto, pageWidth - margin * 2 - 4);
  doc.text(lineasObs, margin + 2, finalY + 4);

  // ==========================================
  // --- 4. RESUMEN MATEMÁTICO ---
  // ==========================================
  finalY += 30; // Bajamos el cursor después del cuadro de observaciones

  if (finalY > 270) {
    doc.addPage();
    finalY = 20;
  }

  const totalGastos = Number(rendicion.total_gastos || 0);
  const montoRecibido = Number(rendicion.monto_recibido || 0);
  const saldo = montoRecibido - totalGastos;

  const resumenX = pageWidth - margin - 55;

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(resumenX, finalY, pageWidth - margin, finalY);

  finalY += 5;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL GASTOS:", resumenX, finalY);
  doc.text(`S/ ${numberPeru(totalGastos)}`, pageWidth - margin, finalY, {
    align: "right",
  });

  finalY += 5;
  if (saldo < 0) {
    doc.setTextColor(220, 38, 38);
    doc.text("POR REEMBOLSAR:", resumenX, finalY);
  } else {
    doc.setTextColor(15, 23, 42);
    doc.text("A DEVOLVER:", resumenX, finalY);
  }
  doc.text(`S/ ${numberPeru(Math.abs(saldo))}`, pageWidth - margin, finalY, {
    align: "right",
  });

  // Descarga del PDF
  doc.save(`Rendicion_${rendicion.correlativo_rendicion || "SN"}.pdf`);
};
