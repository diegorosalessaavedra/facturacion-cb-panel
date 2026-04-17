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

  // ==========================================
  // --- LÓGICA DE DESEMBOLSOS ---
  // ==========================================
  let listaDesembolsos = [];
  if (
    rendicion.desembolsos_multiples &&
    rendicion.desembolsos_multiples.length > 0
  ) {
    listaDesembolsos = rendicion.desembolsos_multiples;
  } else if (rendicion.desembolso) {
    listaDesembolsos = [rendicion.desembolso];
  }

  // ==========================================
  // --- BLOQUE DE INFORMACIÓN GENERAL ---
  // ==========================================
  currentY += 4;
  const boxHeight = 25;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(
    margin,
    currentY,
    pageWidth - margin * 2,
    boxHeight,
    2,
    2,
    "FD",
  );

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);

  const col1 = margin + 5;
  const col2 = pageWidth / 2 + 5;
  const rowH = 7;

  // --- COLUMNA 1 ---
  doc.setFont("helvetica", "bold");
  doc.text("CORRELATIVO:", col1, currentY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.correlativo_rendicion || "-", col1 + 32, currentY + 8);

  doc.setFont("helvetica", "bold");
  doc.text("ÁREA:", col1, currentY + 8 + rowH);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.area_rendicion || "-", col1 + 32, currentY + 8 + rowH);

  doc.setFont("helvetica", "bold");
  doc.text("MONTO TOTAL RECIBIDO:", col1, currentY + 8 + rowH * 2);
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${numberPeru(rendicion.monto_recibido || 0)}`,
    col1 + 45,
    currentY + 8 + rowH * 2,
  );

  // --- COLUMNA 2 ---
  doc.setFont("helvetica", "bold");
  doc.text("TRABAJADOR:", col2, currentY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(
    rendicion.trabajador?.nombre_trabajador || "-",
    col2 + 28,
    currentY + 8,
  );

  doc.setFont("helvetica", "bold");
  doc.text("FECHA REND.:", col2, currentY + 8 + rowH);
  doc.setFont("helvetica", "normal");
  doc.text(
    formatDate(rendicion.fecha_rendida) || "-",
    col2 + 28,
    currentY + 8 + rowH,
  );

  // ==========================================
  // --- 1. LISTAS LADO A LADO (FECHAS Y RUTAS) ---
  // ==========================================
  currentY += boxHeight + 8; // Bajamos el cursor debajo del recuadro gris

  const col1List = margin;
  const col2List = pageWidth / 2 + 5;

  // Títulos de las listas
  doc.setTextColor(15, 23, 42); // slate-900 para el título
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FECHAS RECIBIDAS:", col1List, currentY);
  doc.text("RUTAS:", col2List, currentY);
  currentY += 4;

  // Contenido de las listas
  doc.setTextColor(20, 20, 20); // Color exacto del body de la tabla
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");

  if (listaDesembolsos.length > 0) {
    listaDesembolsos.forEach((d) => {
      // 💡 Datos formateados
      const fechaFormat = formatDate(d.fecha_desembolso) || "-";
      const montoFormat = `S/ ${numberPeru(Math.abs(d.importe_desembolso) || 0)}`;
      const rutaTexto = d.rutas_desembolso || "-";

      // 💡 Textos finales con la viñeta
      const textoCol1 = `\u2022  ${fechaFormat} - ${montoFormat}`;
      const textoCol2 = `\u2022  ${rutaTexto}`;

      // 💡 Control de texto largo para las rutas (para que no invada el margen derecho)
      const maxRutaWidth = pageWidth / 2 - margin - 5;
      const lineasRuta = doc.splitTextToSize(textoCol2, maxRutaWidth);

      // Imprimimos Columna Izquierda (Fechas)
      doc.text(textoCol1, col1List + 2, currentY);

      // Imprimimos Columna Derecha (Rutas)
      doc.text(lineasRuta, col2List + 2, currentY);

      // Incrementamos currentY basándonos en si la ruta ocupó más de una línea
      currentY += lineasRuta.length * 4;
    });
  } else {
    // Si no hay datos
    doc.text("-", col1List + 2, currentY);
    doc.text("-", col2List + 2, currentY);
    currentY += 4;
  }

  currentY += 6; // Espacio extra antes de la tabla principal

  // ==========================================
  // --- 2. TABLA DE GASTOS RENDIDOS ---
  // ==========================================

  // Título de la tabla
  doc.setTextColor(15, 23, 42); // Restauramos el color del título
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLE DE LA RENDICIÓN", margin, currentY);
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
      0: { cellWidth: 10 },
      1: { cellWidth: 18 },
      3: { cellWidth: 25 },
      6: { halign: "right", fontStyle: "bold", cellWidth: 22 },
    },
  });

  // ==========================================
  // --- 3. OBSERVACIONES (Ancho completo) ---
  // ==========================================
  let finalY = doc.lastAutoTable.finalY + 8;

  if (finalY > 240) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("OBSERVACIONES GENERALES:", margin, finalY);

  finalY += 3;

  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, finalY, pageWidth - margin * 2, 20, 1, 1, "FD");

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // slate-600

  const obsTexto = rendicion.observaciones_rendicion || "Sin observaciones.";
  const lineasObs = doc.splitTextToSize(obsTexto, pageWidth - margin * 2 - 4);
  doc.text(lineasObs, margin + 2, finalY + 4);

  // ==========================================
  // --- 4. RESUMEN MATEMÁTICO ---
  // ==========================================
  finalY += 30;

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

  doc.save(`Rendicion_${rendicion.correlativo_rendicion || "SN"}.pdf`);
};
