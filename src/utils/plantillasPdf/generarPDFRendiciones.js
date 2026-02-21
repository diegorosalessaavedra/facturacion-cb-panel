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

  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;

  // Iniciamos un poco más abajo para dar espacio al logo
  let currentY = 15;

  // --- LOGO (Superior Izquierda) ---
  // Nota: Asegúrate de que la ruta sea accesible o usa una imagen en base64
  try {
    const logoUrl = import.meta.env.VITE_LOGO;
    doc.addImage(logoUrl, "JPEG", margin, currentY, 20, 18);
  } catch (error) {
    console.warn("No se pudo cargar el logo en el PDF", error);
  }

  // --- CABECERA ESTILIZADA ---
  // Ajustamos el título para que no se superponga con el logo
  currentY += 30;

  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, currentY, pageWidth - margin * 2, 12, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("COMPROBANTE DE RENDICIÓN DE GASTOS", pageWidth / 2, currentY + 8, {
    align: "center",
  });

  // Fecha de impresión a la derecha
  currentY += 18;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(
    `Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    pageWidth - margin,
    currentY,
    { align: "right" },
  );

  // --- BLOQUE DE INFORMACIÓN (DISEÑO TIPO TARJETA) ---
  currentY += 5;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 35, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);

  const col1 = margin + 5;
  const col2 = pageWidth / 2 + 5;
  const rowHeight = 7;

  // Columna 1
  doc.setFont("helvetica", "bold");
  doc.text("CORRELATIVO:", col1, currentY + 10);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.correlativo_rendicion || "-", col1 + 30, currentY + 10);

  doc.setFont("helvetica", "bold");
  doc.text("TRABAJADOR:", col1, currentY + 10 + rowHeight);
  doc.setFont("helvetica", "normal");
  doc.text(
    rendicion.trabajador?.nombre_trabajador || "-",
    col1 + 30,
    currentY + 10 + rowHeight,
  );

  doc.setFont("helvetica", "bold");
  doc.text("ÁREA:", col1, currentY + 10 + rowHeight * 2);
  doc.setFont("helvetica", "normal");
  doc.text(
    rendicion.area_rendicion || "-",
    col1 + 30,
    currentY + 10 + rowHeight * 2,
  );

  // Columna 2
  doc.setFont("helvetica", "bold");
  doc.text("CONCEPTO:", col2, currentY + 10);
  doc.setFont("helvetica", "normal");
  doc.text(rendicion.concepto_rendicion || "-", col2 + 25, currentY + 10);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA REND.:", col2, currentY + 10 + rowHeight);
  doc.setFont("helvetica", "normal");
  doc.text(
    formatDate(rendicion.fecha_rendida) || "-",
    col2 + 25,
    currentY + 10 + rowHeight,
  );

  doc.setFont("helvetica", "bold");
  doc.text("MONTO RECIB.:", col2, currentY + 10 + rowHeight * 2);
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${numberPeru(rendicion.monto_recibido || 0)}`,
    col2 + 25,
    currentY + 10 + rowHeight * 2,
  );

  // --- TABLA DE DETALLES ---
  currentY += 45;
  const detalles = rendicion.datos_rendicion || [];

  const tableRows = detalles.map((det, index) => [
    index + 1,
    formatDate(det.fecha_uso),
    det.razon_social,
    `${det.tipo_comprobante}\n${det.numero_comprobante}`,
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
        "FECHA DE USO",
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
      fontSize: 8,
      halign: "center",
      valign: "middle",
    },
    styles: {
      fontSize: 7.5,
      valign: "middle",
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      1: { halign: "center", cellWidth: 20 },
      2: { cellWidth: 30 },
      6: { halign: "right", fontStyle: "bold", cellWidth: 25 },
    },
  });

  // --- RESUMEN DE TOTALES ---
  let finalY = doc.lastAutoTable.finalY + 10;
  const totalGastos = Number(rendicion.total_gastos || 0);
  const montoRecibido = Number(rendicion.monto_recibido || 0);
  const saldo = montoRecibido - totalGastos;

  if (finalY > 260) {
    doc.addPage();
    finalY = 20;
  }

  const resumenX = pageWidth - margin - 60;
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(resumenX, finalY, pageWidth - margin, finalY);

  finalY += 6;
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL GASTOS:", resumenX, finalY);
  doc.text(`S/ ${numberPeru(totalGastos)}`, pageWidth - margin, finalY, {
    align: "right",
  });

  finalY += 6;
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
