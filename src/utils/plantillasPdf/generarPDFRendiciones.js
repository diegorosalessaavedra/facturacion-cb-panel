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
    // Cálculo para centrar: (Ancho de página / 2) - (Ancho del logo / 2)
    const xCentered = pageWidth / 2 - logoWidth / 2;
    doc.addImage(logoUrl, "JPEG", xCentered, currentY, logoWidth, logoHeight);
  } catch (error) {
    console.warn("No se pudo cargar el logo", error);
  }

  // --- CABECERA ---
  currentY += 28; // Bajamos después del logo

  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, currentY, pageWidth - margin * 2, 10, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(
    "COMPROBANTE DE RENDICIÓN DE GASTOS",
    pageWidth / 2,
    currentY + 6.5,
    {
      align: "center",
    },
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

  // --- BLOQUE DE INFORMACIÓN (Aumentamos altura a 40 para que quepa todo) ---
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 40, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);

  const col1 = margin + 5;
  const col2 = pageWidth / 2 + 5;
  const rowH = 7; // Altura de fila

  // Columna 1 - Ajuste de coordenadas Y para que no se pisen
  doc.setFont("helvetica", "bold");
  doc.text("CORRELATIVO:", col1, currentY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.correlativo_rendicion || "-", col1 + 32, currentY + 8);

  doc.setFont("helvetica", "bold");
  doc.text("TRABAJADOR:", col1, currentY + 8 + rowH);
  doc.setFont("helvetica", "normal");
  doc.text(
    rendicion.trabajador?.nombre_trabajador || "-",
    col1 + 32,
    currentY + 8 + rowH,
  );

  doc.setFont("helvetica", "bold");
  doc.text("ÁREA:", col1, currentY + 8 + rowH * 2);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.area_rendicion || "-", col1 + 32, currentY + 8 + rowH * 2);

  doc.setFont("helvetica", "bold");
  doc.text("RUTAS:", col1, currentY + 8 + rowH * 3);
  doc.setFont("helvetica", "normal");
  doc.text(
    rendicion.desembolso.rutas_desembolso || "-",
    col1 + 32,
    currentY + 8 + rowH * 3,
  );

  // Columna 2 - Ajuste de coordenadas Y
  doc.setFont("helvetica", "bold");
  doc.text("CONCEPTO:", col2, currentY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.concepto_rendicion || "-", col2 + 28, currentY + 8);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA REND.:", col2, currentY + 8 + rowH);
  doc.setFont("helvetica", "normal");
  doc.text(
    formatDate(rendicion.fecha_rendida) || "-",
    col2 + 28,
    currentY + 8 + rowH,
  );

  doc.setFont("helvetica", "bold");
  doc.text("FECHA RECIB.:", col2, currentY + 8 + rowH * 2);
  doc.setFont("helvetica", "normal");
  doc.text(
    formatDate(rendicion.fecha_recibida) || "-",
    col2 + 28,
    currentY + 8 + rowH * 2,
  );

  doc.setFont("helvetica", "bold");
  doc.text("MONTO RECIB.:", col2, currentY + 8 + rowH * 3);
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${numberPeru(rendicion.monto_recibido || 0)}`,
    col2 + 28,
    currentY + 8 + rowH * 3,
  );

  // --- TABLA DE DETALLES ---
  currentY += 48;
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
      fillColor: [51, 65, 85],
      fontSize: 7,
      halign: "center",
      valign: "middle",
    },
    // 🟢 AQUÍ EL CAMBIO: Agregamos halign: "center" para centrar todo el cuerpo de la tabla
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
      // Mantenemos el importe a la derecha por buenas prácticas financieras.
      // Si quieres centrarlo también, borra 'halign: "right"' de la línea de abajo.
      6: { halign: "right", fontStyle: "bold", cellWidth: 22 },
    },
  });

  // --- RESUMEN ---
  let finalY = doc.lastAutoTable.finalY + 8;
  const totalGastos = Number(rendicion.total_gastos || 0);
  const montoRecibido = Number(rendicion.monto_recibido || 0);
  const saldo = montoRecibido - totalGastos;

  if (finalY > 265) {
    doc.addPage();
    finalY = 20;
  }

  const resumenX = pageWidth - margin - 55;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(resumenX, finalY, pageWidth - margin, finalY);

  finalY += 5;
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
