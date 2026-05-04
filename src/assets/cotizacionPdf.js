import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { numeroALetras } from "./numeroLetras";
import formatDate from "../hooks/FormatDate";
import { formatNumber, formatWithLeadingZeros } from "./formats";

const plantillaCotizacionPdf = (selectCotizacion, cuentasBancarias) => {
  const doc = new jsPDF();

  if (!selectCotizacion || !selectCotizacion.cliente) {
    console.error("No se proporcionaron datos válidos para la cotización.");
    return;
  }

  // ==========================================
  // 🎨 PALETA DE COLORES (Slate / Amber / Red)
  // ==========================================
  const slate900 = [15, 23, 42]; // #0f172a
  const amber500 = [245, 158, 11]; // #f59e0b
  const red600 = [220, 38, 38]; // #dc2626
  const white = [255, 255, 255];
  const black = [0, 0, 0];
  const slate50 = [248, 250, 252];
  const slate400 = [148, 163, 184];

  // Configuración de márgenes
  const mX = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const rightColX = pageWidth - mX;
  const contentWidth = pageWidth - mX * 2;

  // ==========================================
  // 🏢 CABECERA: LOGO Y DATOS DE EMPRESA
  // ==========================================
  const logoUrl = import.meta.env.VITE_LOGO;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", mX, 10, 32, 22);
  }

  doc.setTextColor(...slate900);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(import.meta.env.VITE_NOMBRE || "NOMBRE EMPRESA", rightColX, 15, {
    align: "right",
  });

  doc.setTextColor(...slate400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`RUC: ${import.meta.env.VITE_RUC || "-"}`, rightColX, 19, {
    align: "right",
  });
  doc.text(`${import.meta.env.VITE_DIRRECION || "-"}`, rightColX, 23, {
    align: "right",
  });
  doc.text(`Tel: ${import.meta.env.VITE_TELEFONO || "-"}`, rightColX, 27, {
    align: "right",
  });
  doc.text(`Email: ${import.meta.env.VITE_CORREO || "-"}`, rightColX, 31, {
    align: "right",
  });

  // ==========================================
  // 🏷️ BLOQUE DE TÍTULO
  // ==========================================
  doc.setFillColor(...slate900);
  doc.rect(mX, 36, contentWidth, 12, "F");

  doc.setFillColor(...amber500);
  doc.rect(mX, 36, 3, 12, "F");

  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("COTIZACIÓN", mX + 6, 44);

  doc.text(
    `N° COT-${formatWithLeadingZeros(selectCotizacion.id, 6)}`,
    rightColX - 4,
    44,
    { align: "right" },
  );

  // ==========================================
  // 👤 BLOQUE DE CLIENTE
  // ==========================================
  doc.setFillColor(...slate50);
  doc.rect(mX, 50, contentWidth, 22, "F");

  doc.setTextColor(...slate900);
  doc.setFontSize(7);

  // Columna 1
  const startYInfo = 55;
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE:", mX + 4, startYInfo);
  doc.text(
    `${selectCotizacion.cliente?.tipoDocIdentidad || "DOC"}:`,
    mX + 4,
    startYInfo + 4,
  );
  doc.text("DIRECCIÓN:", mX + 4, startYInfo + 8);
  doc.text("VENDEDOR:", mX + 4, startYInfo + 12);

  doc.setFont("helvetica", "normal");
  doc.text(
    selectCotizacion.cliente?.nombreComercial ||
      selectCotizacion.cliente?.nombreApellidos ||
      "N/A",
    mX + 24,
    startYInfo,
  );
  doc.text(
    selectCotizacion.cliente?.numeroDoc || "N/A",
    mX + 24,
    startYInfo + 4,
  );

  const direccion = selectCotizacion.direccionEnvio || "N/A";
  const splitDir = doc.splitTextToSize(direccion, 90);
  doc.text(splitDir, mX + 24, startYInfo + 8);
  doc.text(
    selectCotizacion.vendedor || "N/A",
    mX + 24,
    startYInfo + 12 + (splitDir.length - 1) * 3,
  );

  // Columna 2
  doc.setFont("helvetica", "bold");
  doc.text("FECHA EMISIÓN:", rightColX - 45, startYInfo);
  doc.text("TIEMPO ENTREGA:", rightColX - 45, startYInfo + 4);

  doc.setFont("helvetica", "normal");
  doc.text(
    selectCotizacion.fechaEmision
      ? formatDate(selectCotizacion.fechaEmision)
      : "N/A",
    rightColX - 15,
    startYInfo,
  );
  doc.text(
    selectCotizacion.fechaEntrega || "N/A",
    rightColX - 15,
    startYInfo + 4,
  );

  // ==========================================
  // 📦 TABLA DE PRODUCTOS
  // ==========================================
  const productsData = selectCotizacion?.productos.map((producto) => {
    const precioUnitario =
      typeof producto.precioUnitario === "number"
        ? producto.precioUnitario
        : parseFloat(producto.precioUnitario) || 0;
    const total =
      typeof producto.total === "number"
        ? producto.total
        : parseFloat(producto.total) || 0;

    const esBono = producto.bono || producto.tipo_producto === "BONO";
    const nombreProductoBase =
      producto.producto?.nombre || (esBono ? "Producto de Bono" : "N/A");

    // 👇 Si es bono, enviamos un objeto que permite identificarlo y le agregamos espacios
    // para que deje lugar visual al rectángulo que dibujaremos después.
    const descripcionCelda = esBono
      ? { content: `        ${nombreProductoBase}`, esBono: true }
      : nombreProductoBase;

    return [
      producto.cantidad || 0,
      producto.producto?.codUnidad || "-",
      descripcionCelda,
      `S/ ${precioUnitario.toFixed(2)}`,
      `S/ ${formatNumber(total)}`,
    ];
  });

  doc.autoTable({
    startY: 75,
    head: [["CANT", "UNIDAD", "DESCRIPCIÓN", "V. UNITARIO", "SUB TOTAL"]],
    body: productsData,
    margin: { left: mX, right: mX },
    theme: "plain",
    styles: {
      fontSize: 6,
      textColor: black,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: slate900,
      textColor: white,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      lineWidth: { bottom: 0.1 },
      lineColor: [226, 232, 240],
    },
    alternateRowStyles: {
      fillColor: slate50,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 14 },
      1: { halign: "center", cellWidth: 18 },
      2: { halign: "center", cellWidth: "auto" },
      3: { halign: "right", cellWidth: 25 },
      4: { halign: "right", cellWidth: 25 },
    },
    // 👇 ESTO DIBUJA LA ETIQUETA "BONO" EN EL PDF 👇
    didDrawCell: (data) => {
      // Verifica si es la columna de Descripción y si la fila es un BONO
      if (data.column.index === 2 && data.cell.raw && data.cell.raw.esBono) {
        const x = data.cell.x + 3; // Posición X + padding
        const y = data.cell.y + 1.5; // Ajuste vertical

        // Guardar estilos actuales para no afectar otras celdas
        const currentTextColor = doc.getTextColor();
        const currentFillColor = doc.getFillColor();

        // Fondo verde esmeralda (emerald-100)
        doc.setFillColor(209, 250, 229);
        // Borde verde (emerald-300)
        doc.setDrawColor(110, 231, 183);
        doc.setLineWidth(0.2);

        // Dibujar el pill (rectángulo con bordes redondeados)
        doc.roundedRect(x, y, 12.5, 4.5, 1, 1, "FD");

        // Dibujar el texto dentro de la etiqueta (emerald-700)
        doc.setTextColor(4, 120, 87);
        doc.setFontSize(4.5);
        doc.setFont("helvetica", "bold");
        doc.text("BONO", x + 1.5, y + 3.2);

        // Restaurar estilos de la tabla
        doc.setTextColor(currentTextColor);
        doc.setFillColor(currentFillColor);
        doc.setFontSize(6); // Regresa a fuente normal de la tabla
        doc.setFont("helvetica", "normal");
      }
    },
  });

  // ==========================================
  // 💰 TOTALES
  // ==========================================
  let finalY = doc.lastAutoTable.finalY + 8;
  const opGravadas = Number(selectCotizacion.saldoInicial) / 1.18;

  doc.setFontSize(7);
  doc.setTextColor(...slate900);
  doc.setFont("helvetica", "normal");
  doc.text("OP. GRAVADAS:", rightColX - 30, finalY, { align: "right" });
  doc.text(`S/ ${formatNumber(opGravadas)}`, rightColX, finalY, {
    align: "right",
  });

  finalY += 5;
  doc.text("IGV (18%):", rightColX - 30, finalY, { align: "right" });
  doc.text(`S/ ${formatNumber(opGravadas * 0.18)}`, rightColX, finalY, {
    align: "right",
  });

  // TOTAL A PAGAR
  finalY += 6;
  doc.setFillColor(...slate50);
  doc.rect(rightColX - 55, finalY - 5, 55, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...slate900);
  doc.text("TOTAL A PAGAR:", rightColX - 30, finalY + 0.5, { align: "right" });

  doc.setTextColor(...red600);
  doc.text(
    `S/ ${formatNumber(selectCotizacion.saldoInicial)}`,
    rightColX - 2,
    finalY + 0.5,
    { align: "right" },
  );

  // Son Letras
  const totalEnLetras = numeroALetras(Number(selectCotizacion.saldoInicial), {
    plural: "SOLES",
    singular: "SOL",
    centPlural: "CÉNTIMOS",
    centSingular: "CÉNTIMO",
  });
  doc.setTextColor(...slate400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`SON: ${totalEnLetras}`, mX, finalY);

  // ==========================================
  // 💳 HISTORIAL DE PAGOS
  // ==========================================
  const tienePagos =
    selectCotizacion.pagos && selectCotizacion.pagos.length > 0;

  if (tienePagos) {
    finalY += 12;

    doc.setTextColor(...slate900);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("HISTORIAL DE PAGOS", mX, finalY);

    doc.setFillColor(...amber500);
    doc.rect(mX, finalY + 1.5, 12, 0.8, "F");

    const paymentData = selectCotizacion.pagos.map((pago) => [
      pago.metodoPago?.descripcion || "N/A",
      pago.banco?.descripcion || "N/A",
      pago.operacion || "-",
      `${formatDate(pago.fecha)}`,
      `S/ ${formatNumber(pago.monto)}`,
    ]);

    doc.autoTable({
      startY: finalY + 4,
      head: [["MÉTODO DE PAGO", "BANCO", "OPERACIÓN", "FECHA", "MONTO"]],
      body: paymentData,
      margin: { left: mX, right: mX },
      theme: "plain",
      styles: { fontSize: 6, textColor: slate900, cellPadding: 2.5 },
      headStyles: {
        fillColor: slate900,
        textColor: white,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: slate50 },
    });

    const totalPagos = selectCotizacion.pagos.reduce(
      (acc, pago) => acc + Number(pago.monto),
      0,
    );
    const saldoFinal = Number(selectCotizacion.saldoInicial) - totalPagos;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...slate900);
    doc.text(`SALDO PENDIENTE:`, rightColX - 30, doc.lastAutoTable.finalY + 6, {
      align: "right",
    });
    doc.setTextColor(...red600);
    doc.text(
      `S/ ${formatNumber(saldoFinal)}`,
      rightColX,
      doc.lastAutoTable.finalY + 6,
      { align: "right" },
    );
  }

  // ==========================================
  // 🏦 CUENTAS BANCARIAS
  // ==========================================

  let bancosStartY;

  if (tienePagos) {
    bancosStartY = doc.lastAutoTable.finalY + 15;
  } else {
    bancosStartY = Math.max(finalY + 15, pageHeight - 50);
  }

  doc.setTextColor(...slate900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("CUENTAS BANCARIAS", mX, bancosStartY);

  doc.setFillColor(...amber500);
  doc.rect(mX, bancosStartY + 1.5, 12, 0.8, "F");

  const bancosBody = cuentasBancarias
    .filter(
      (c) =>
        c.descripcion !== "MORTANDAD" &&
        c.descripcion !== "SIN BANCARIZACION" &&
        c.descripcion !== "JCESPEDES",
    )
    .map((c) => [c.descripcion, "Soles", c.cci, c.numero]);

  doc.autoTable({
    startY: bancosStartY + 4,
    head: [["BANCO", "MONEDA", "CÓDIGO INTERBANCARIO (CCI)", "NRO. DE CUENTA"]],
    body: bancosBody,
    margin: { left: mX, right: mX, bottom: 10 },
    theme: "plain",
    styles: { fontSize: 7, textColor: slate900, cellPadding: 2.5 },
    headStyles: {
      fillColor: slate50,
      textColor: slate900,
      fontStyle: "bold",
      lineWidth: { top: 0.5, bottom: 0.5 },
      lineColor: slate900,
    },
    bodyStyles: {
      lineWidth: { bottom: 0.1 },
      lineColor: [226, 232, 240],
    },
  });

  // ==========================================
  // 🚀 RENDERIZADO FINAL
  // ==========================================
  const pdfOutput = doc.output("dataurlstring");
  const newWindow = window.open();

  if (newWindow) {
    newWindow.document.title = `COT-${formatWithLeadingZeros(selectCotizacion.id, 6)}`;
    newWindow.document.write(`
      <html>
        <head><title>COT-${formatWithLeadingZeros(selectCotizacion.id, 6)}</title></head>
        <body style="margin:0;">
          <embed width="100%" height="100%" src="${pdfOutput}" type="application/pdf" />
        </body>
      </html>
    `);
  }

  doc.save(`COT-${formatWithLeadingZeros(selectCotizacion.id, 6)}.pdf`);
};

export default plantillaCotizacionPdf;
