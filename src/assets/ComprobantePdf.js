import { jsPDF } from "jspdf";
import "jspdf-autotable";
import formatDate from "../hooks/FormatDate";
import { formatNumber, formatWithLeadingZeros } from "./formats";
import QRCode from "qrcode";
import { codigosBienes } from "../jsons/codigosBienes";
import { mediosDePago } from "../jsons/mediosPago";

const plantillaComprobantePdf = async (
  comprobanteElectronico,
  cuentasBancarias,
) => {
  const doc = new jsPDF();

  if (!comprobanteElectronico || !comprobanteElectronico.cliente) {
    console.error("No se proporcionaron datos válidos para el comprobante.");
    return;
  }

  const slate900 = [15, 23, 42];
  const amber500 = [245, 158, 11];
  const red600 = [220, 38, 38];
  const white = [255, 255, 255];
  const black = [0, 0, 0];
  const slate50 = [248, 250, 252];
  const slate400 = [148, 163, 184];

  const mX = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const rightColX = pageWidth - mX;
  const contentWidth = pageWidth - mX * 2;

  // CABECERA
  const logoUrl = import.meta.env.VITE_LOGO;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", mX, 10, 32, 22);
  }

  doc.setTextColor(...slate900);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const nombreEmpresa = (
    import.meta.env.VITE_NOMBRE || "NOMBRE EMPRESA"
  ).replace(/\n/g, " ");
  doc.text(nombreEmpresa, rightColX, 15, { align: "right" });

  doc.setTextColor(...slate400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `RUC: ${(import.meta.env.VITE_RUC || "-").replace(/\n/g, " ")}`,
    rightColX,
    19,
    { align: "right" },
  );
  doc.text(
    `${(import.meta.env.VITE_DIRRECION || "-").replace(/\n/g, " ")}`,
    rightColX,
    23,
    { align: "right" },
  );
  doc.text(
    `Tel: ${(import.meta.env.VITE_TELEFONO || "-").replace(/\n/g, " ")}`,
    rightColX,
    27,
    { align: "right" },
  );
  doc.text(
    `Email: ${(import.meta.env.VITE_CORREO || "-").replace(/\n/g, " ")}`,
    rightColX,
    31,
    { align: "right" },
  );

  if (import.meta.env.VITE_WEB) {
    doc.text(
      `Web: ${(import.meta.env.VITE_WEB || "").replace(/\n/g, " ")}`,
      rightColX,
      35,
      { align: "right" },
    );
  }

  // TÍTULO
  doc.setFillColor(...slate900);
  doc.rect(mX, 38, contentWidth, 12, "F");

  doc.setFillColor(...amber500);
  doc.rect(mX, 38, 3, 12, "F");

  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    (comprobanteElectronico.tipoComprobante || "COMPROBANTE").toUpperCase(),
    mX + 6,
    46,
  );
  doc.text(
    `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}`,
    rightColX - 4,
    46,
    { align: "right" },
  );

  // CLIENTE
  doc.setFillColor(...slate50);
  doc.rect(mX, 52, contentWidth, 26, "F");

  doc.setTextColor(...slate900);
  doc.setFontSize(7);

  const startYInfo = 57;
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE:", mX + 4, startYInfo);
  doc.text(
    `${comprobanteElectronico.cliente?.tipoDocIdentidad || "DOC"}:`,
    mX + 4,
    startYInfo + 4,
  );
  doc.text("DIRECCIÓN:", mX + 4, startYInfo + 8);
  doc.text("VENDEDOR:", mX + 4, startYInfo + 16);

  doc.setFont("helvetica", "normal");
  doc.text(
    comprobanteElectronico.cliente?.nombreComercial ||
      comprobanteElectronico.cliente?.nombreApellidos ||
      "N/A",
    mX + 24,
    startYInfo,
  );
  doc.text(
    comprobanteElectronico.cliente?.numeroDoc || "N/A",
    mX + 24,
    startYInfo + 4,
  );

  const direccionCompleta = comprobanteElectronico?.cliente?.direccion
    ? `${comprobanteElectronico.cliente.direccion} - ${comprobanteElectronico.cliente.provincia?.provincia || ""} - ${comprobanteElectronico.cliente.distrito?.distrito || ""} - ${comprobanteElectronico.cliente.departamento?.departamento || ""}`
    : "N/A";
  const splitDir = doc.splitTextToSize(direccionCompleta, 90);
  doc.text(splitDir, mX + 24, startYInfo + 8);
  doc.text(comprobanteElectronico.vendedor || "N/A", mX + 24, startYInfo + 16);

  const col2X = rightColX - 55;
  doc.setFont("helvetica", "bold");
  doc.text("F. EMISIÓN:", col2X, startYInfo);
  doc.text("F. VENCIMIENTO:", col2X, startYInfo + 4);
  doc.text("COTIZACIÓN:", col2X, startYInfo + 8);
  doc.text("OBSERVACIÓN:", col2X, startYInfo + 12);

  doc.setFont("helvetica", "normal");
  doc.text(
    comprobanteElectronico.fechaEmision
      ? formatDate(comprobanteElectronico.fechaEmision)
      : "N/A",
    col2X + 25,
    startYInfo,
  );
  doc.text(
    comprobanteElectronico.fechaVencimiento
      ? formatDate(comprobanteElectronico.fechaVencimiento)
      : "N/A",
    col2X + 25,
    startYInfo + 4,
  );

  if (comprobanteElectronico?.cotizacion) {
    doc.text(
      `COT-${formatWithLeadingZeros(comprobanteElectronico.cotizacion.id, 6)}`,
      col2X + 25,
      startYInfo + 8,
    );
  } else {
    doc.text("N/A", col2X + 25, startYInfo + 8);
  }

  const splitObs = doc.splitTextToSize(
    comprobanteElectronico.observacion || "Ninguna",
    30,
  );
  doc.text(splitObs, col2X + 25, startYInfo + 12);

  // TABLA DE PRODUCTOS
  const productsData = comprobanteElectronico?.productos.map((producto) => {
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

    const descripcionCelda = esBono
      ? { content: "", nombreProducto: nombreProductoBase, esBono: true }
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
    startY: 82,
    head: [["CANT", "UNIDAD", "DESCRIPCIÓN", "V. UNITARIO", "SUB TOTAL"]],
    body: productsData,
    margin: { left: mX, right: mX },
    theme: "plain",
    styles: { fontSize: 6, textColor: black, cellPadding: 3 },
    headStyles: {
      fillColor: slate900,
      textColor: white,
      fontStyle: "bold",
      // Removido 'halign: "center"' para que la cabecera herede la alineación de las columnas
    },
    bodyStyles: {
      lineWidth: { bottom: 0.1 },
      lineColor: [226, 232, 240],
    },
    alternateRowStyles: { fillColor: slate50 },
    columnStyles: {
      0: { halign: "center", cellWidth: 14 }, // Centrado
      1: { halign: "center", cellWidth: 18 }, // Centrado
      2: { halign: "left", cellWidth: "auto" }, // Izquierda
      3: { halign: "right", cellWidth: 25 }, // Derecha
      4: { halign: "right", cellWidth: 25 }, // Derecha
    },
    didDrawCell: (data) => {
      if (data.column.index === 2 && data.cell.raw?.esBono) {
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellH = data.cell.height;

        const nombreProducto = data.cell.raw.nombreProducto || "";

        const pillW = 14;
        const pillH = 4.5;
        const gap = 2.5;

        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        const textW = doc.getTextWidth(nombreProducto);

        // MODIFICADO: Alineado a la izquierda (con padding de 3), igual que los demás productos
        const blockStartX = cellX + 3;
        const centerY = cellY + cellH / 2;

        // 1. Nombre del producto
        doc.setTextColor(...black);
        doc.text(nombreProducto, blockStartX, centerY, { baseline: "middle" });

        // 2. Pastilla BONO a la derecha del nombre
        const pillX = blockStartX + textW + gap;
        const pillY = centerY - pillH / 2;

        doc.setFillColor(209, 250, 229);
        doc.setDrawColor(110, 231, 183);
        doc.setLineWidth(0.2);
        doc.roundedRect(pillX, pillY, pillW, pillH, 1, 1, "FD");

        doc.setTextColor(4, 120, 87);
        doc.setFontSize(4.5);
        doc.setFont("helvetica", "bold");
        doc.text("BONO", pillX + pillW / 2, pillY + pillH / 2, {
          align: "center",
          baseline: "middle",
        });

        // Restaurar
        doc.setTextColor(...black);
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
      }
    },
  });

  // TOTALES
  let finalY = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(7);
  doc.setTextColor(...slate900);
  doc.setFont("helvetica", "normal");
  doc.text("OP. GRAVADAS:", rightColX - 30, finalY, { align: "right" });
  doc.text(
    `S/ ${formatNumber(comprobanteElectronico?.total_valor_venta)}`,
    rightColX,
    finalY,
    { align: "right" },
  );

  finalY += 5;
  doc.text("IGV (18%):", rightColX - 30, finalY, { align: "right" });
  doc.text(
    `S/ ${formatNumber(comprobanteElectronico?.total_igv)}`,
    rightColX,
    finalY,
    { align: "right" },
  );

  finalY += 6;
  doc.setFillColor(...slate50);
  doc.rect(rightColX - 55, finalY - 5, 55, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...slate900);
  doc.text("TOTAL A PAGAR:", rightColX - 30, finalY + 0.5, { align: "right" });

  doc.setTextColor(...red600);
  doc.text(
    `S/ ${formatNumber(comprobanteElectronico.total_venta)}`,
    rightColX - 2,
    finalY + 0.5,
    { align: "right" },
  );

  doc.setTextColor(...slate400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`SON: ${comprobanteElectronico.legend}`, mX, finalY);

  finalY += 10;

  // QR Y HASH
  const qrContent = `${comprobanteElectronico.qrContent}`;
  const qrDataUrl = await QRCode.toDataURL(qrContent);

  if (comprobanteElectronico.digestValue !== null) {
    doc.addImage(qrDataUrl, "PNG", rightColX - 35, finalY, 35, 35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...slate900);
    doc.text("Código Hash:", rightColX - 35, finalY + 38);
    doc.setFont("helvetica", "normal");
    const splitHash = doc.splitTextToSize(
      comprobanteElectronico.digestValue,
      35,
    );
    doc.text(splitHash, rightColX - 35, finalY + 42);
  }

  // DETRACCIÓN
  if (comprobanteElectronico.detraccion) {
    doc.setTextColor(...slate900);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("INFORMACIÓN DE LA DETRACCIÓN", mX, finalY);

    doc.setFillColor(...amber500);
    doc.rect(mX, finalY + 1.5, 12, 0.8, "F");

    doc.setFontSize(7);
    const detStartY = finalY + 6;

    const bienEncontrado = codigosBienes.find(
      (c) => c.codigo === comprobanteElectronico.detraccion.codBienDetraccion,
    );
    doc.text("Bien o Servicio:", mX, detStartY);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${bienEncontrado?.codigo || ""} - ${bienEncontrado?.descripcion || ""}`,
      mX + 25,
      detStartY,
    );

    doc.setFont("helvetica", "bold");
    doc.text("Medio de pago:", mX, detStartY + 5);
    const medioPagoEncontrado = mediosDePago.find(
      (p) => p.codigo === comprobanteElectronico.detraccion.codMedioPago,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      `${medioPagoEncontrado?.codigo || ""} - ${medioPagoEncontrado?.descripcion || ""}`,
      mX + 25,
      detStartY + 5,
    );

    doc.setFont("helvetica", "bold");
    doc.text("Nro. Cta. Banco de la Nación:", mX, detStartY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${comprobanteElectronico.detraccion.ctaBancaria}`,
      mX + 45,
      detStartY + 10,
    );

    doc.setFont("helvetica", "bold");
    doc.text("Porcentaje de detracción:", mX, detStartY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${comprobanteElectronico.detraccion.porcentaje}%`,
      mX + 45,
      detStartY + 15,
    );

    doc.setFont("helvetica", "bold");
    doc.text("Monto detracción:", mX, detStartY + 20);
    doc.setFont("helvetica", "normal");
    doc.text(
      `S/ ${comprobanteElectronico.detraccion.montoDetraccion}`,
      mX + 45,
      detStartY + 20,
    );

    finalY += 30;
  }

  // HISTORIAL DE PAGOS
  const tienePagos =
    comprobanteElectronico.pagos && comprobanteElectronico.pagos.length > 0;

  if (tienePagos) {
    doc.setTextColor(...slate900);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    let pagosY = comprobanteElectronico.detraccion ? finalY : finalY + 4;

    doc.text("HISTORIAL DE PAGOS", mX, pagosY);
    doc.setFillColor(...amber500);
    doc.rect(mX, pagosY + 1.5, 12, 0.8, "F");

    const paymentData = comprobanteElectronico.pagos.map((pago) => [
      pago.metodoPago?.descripcion || "N/A",
      pago.banco?.descripcion || "N/A",
      pago.operacion || "-",
      `${formatDate(pago.fecha)}`,
      `S/ ${formatNumber(pago.monto)}`,
    ]);

    doc.autoTable({
      startY: pagosY + 4,
      head: [["MÉTODO DE PAGO", "BANCO", "OPERACIÓN", "FECHA", "MONTO"]],
      body: paymentData,
      margin: {
        left: mX,
        right: comprobanteElectronico.digestValue ? mX + 40 : mX,
      },
      theme: "plain",
      styles: { fontSize: 6, textColor: slate900, cellPadding: 2.5 },
      headStyles: { fillColor: slate900, textColor: white, fontStyle: "bold" },
      alternateRowStyles: { fillColor: slate50 },
      // Alineando la tabla de pagos para mantener consistencia
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "right" },
      },
    });

    finalY = doc.lastAutoTable.finalY + 8;
  } else {
    finalY += 40;
  }

  // CUENTAS BANCARIAS
  let bancosStartY = Math.max(finalY, pageHeight - 50);

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
    // Alineando tabla de bancos
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "left" },
      3: { halign: "left" },
    },
  });

  // RENDERIZADO FINAL
  const pdfOutput = doc.output("dataurlstring");
  const newWindow = window.open("", "_blank");

  if (newWindow) {
    newWindow.document.title = `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}`;
    newWindow.document.write(`
      <html>
        <head>
          <title>${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}</title>
        </head>
        <body style="margin:0;">
          <embed width="100%" height="100%" src="${pdfOutput}" type="application/pdf" />
        </body>
      </html>
    `);
  }

  doc.save(
    `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}.pdf`,
  );
};

export default plantillaComprobantePdf;
