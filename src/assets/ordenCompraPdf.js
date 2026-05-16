import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { numeroALetras } from "./numeroLetras";
import formatDate from "../hooks/FormatDate";
import { formatNumber, formatWithLeadingZeros } from "./formats";

const plantillaOrdenCompraPdf = (ordenCompra) => {
  const doc = new jsPDF();

  if (!ordenCompra || !ordenCompra.proveedor) {
    console.error(
      "No se proporcionaron datos válidos para la orden de compra.",
    );
    return;
  }

  // Paleta de colores
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

  // --- CABECERA ---
  const logoUrl = import.meta.env.VITE_LOGO;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", mX, 10, 32, 22);
  }

  doc.setTextColor(...slate900);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    String(import.meta.env.VITE_NOMBRE || "NOMBRE EMPRESA"),
    rightColX,
    15,
    {
      align: "right",
    },
  );

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
  doc.text(`Web: ${import.meta.env.VITE_WEB || "-"}`, rightColX, 35, {
    align: "right",
  });

  // --- TÍTULO ---
  doc.setFillColor(...slate900);
  doc.rect(mX, 40, contentWidth, 12, "F");

  doc.setFillColor(...amber500);
  doc.rect(mX, 40, 3, 12, "F");

  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ORDEN DE COMPRA", mX + 6, 48);
  doc.text(
    `N° OC-${formatWithLeadingZeros(ordenCompra.id || 0, 6)}`,
    rightColX - 4,
    48,
    { align: "right" },
  );

  // --- INFORMACIÓN DEL PROVEEDOR ---
  doc.setFillColor(...slate50);
  doc.rect(mX, 54, contentWidth, 24, "F");

  doc.setTextColor(...slate900);
  doc.setFontSize(7);

  let startYInfo = 59;
  doc.setFont("helvetica", "bold");
  doc.text("PROVEEDOR:", mX + 4, startYInfo);
  doc.text(
    `${ordenCompra.proveedor?.tipoDocIdentidad || "DOC"}:`,
    mX + 4,
    startYInfo + 4,
  );
  doc.text("DIRECCIÓN:", mX + 4, startYInfo + 8);
  doc.text("COMPRADOR:", mX + 4, startYInfo + 15);
  doc.text("REFERENCIA:", mX + 4, startYInfo + 19);

  doc.setFont("helvetica", "normal");
  doc.text(
    String(
      ordenCompra.proveedor?.nombreComercial ||
        ordenCompra.proveedor?.nombreApellidos ||
        "N/A",
    ),
    mX + 26,
    startYInfo,
  );
  doc.text(
    String(ordenCompra.proveedor?.numeroDoc || "N/A"),
    mX + 26,
    startYInfo + 4,
  );

  const direccion = ordenCompra.proveedor?.distrito?.distrito
    ? `${ordenCompra.proveedor.distrito.distrito} - ${ordenCompra.proveedor.provincia?.provincia} - ${ordenCompra.proveedor.departamento?.departamento}`
    : "N/A";

  // Dividir texto si la dirección es muy larga
  const splitDir = doc.splitTextToSize(direccion, 90);
  doc.text(splitDir, mX + 26, startYInfo + 8);

  doc.text(String(ordenCompra.comprador || "N/A"), mX + 26, startYInfo + 15);
  doc.text(String(ordenCompra.observacion || "N/A"), mX + 26, startYInfo + 19);

  // Fechas (Lado derecho)
  doc.setFont("helvetica", "bold");
  doc.text("FECHA EMISIÓN:", rightColX - 45, startYInfo);
  doc.text("VENCIMIENTO:", rightColX - 45, startYInfo + 4);

  doc.setFont("helvetica", "normal");
  doc.text(
    ordenCompra.fechaEmision ? formatDate(ordenCompra.fechaEmision) : "N/A",
    rightColX - 15,
    startYInfo,
  );
  doc.text(
    ordenCompra.fechaVencimiento
      ? formatDate(ordenCompra.fechaVencimiento)
      : "N/A",
    rightColX - 15,
    startYInfo + 4,
  );

  // --- TABLA DE PRODUCTOS ---
  const productsData = (ordenCompra.productos || []).map((producto) => {
    const precioUnitario =
      typeof producto.precioUnitario === "number"
        ? producto.precioUnitario
        : parseFloat(producto.precioUnitario) || 0;
    const total =
      typeof producto.total === "number"
        ? producto.total
        : parseFloat(producto.total) || 0;

    return [
      producto.cantidad || 0,
      String(producto.producto?.codUnidad || "-"),
      String(producto.producto?.nombre || " "),
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
    },
    bodyStyles: {
      lineWidth: { bottom: 0.1 },
      lineColor: [226, 232, 240],
    },
    alternateRowStyles: { fillColor: slate50 },
    columnStyles: {
      0: { halign: "center", cellWidth: 14 },
      1: { halign: "center", cellWidth: 18 },
      2: { halign: "left", cellWidth: "auto" },
      3: { halign: "right", cellWidth: 25 },
      4: { halign: "right", cellWidth: 25 },
    },
  });

  // --- CÁLCULO DE TOTALES Y DETRACCIÓN ---
  const opGravadas = Number(ordenCompra.saldoInicial || 0) / 1.18;
  const tieneDetraccion = !!ordenCompra.detraccion;
  const montoDetraccion = tieneDetraccion
    ? Number(ordenCompra.detraccion.monto_detraccion || 0)
    : 0;
  const totalNeto = Number(ordenCompra.saldoInicial || 0) - montoDetraccion;

  let finalY = doc.lastAutoTable.finalY + 8;

  // Renderizado de Totales
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

  finalY += 5;
  const textoTotalOriginal = tieneDetraccion
    ? "TOTAL COMPRA:"
    : "TOTAL A PAGAR:";
  doc.text(textoTotalOriginal, rightColX - 30, finalY, { align: "right" });
  doc.text(
    `S/ ${formatNumber(ordenCompra.saldoInicial || 0)}`,
    rightColX,
    finalY,
    { align: "right" },
  );

  if (tieneDetraccion) {
    finalY += 5;
    doc.text("DETRACCIÓN:", rightColX - 30, finalY, { align: "right" });
    doc.text(`- S/ ${formatNumber(montoDetraccion)}`, rightColX, finalY, {
      align: "right",
    });
  }

  // Caja de Total Final (Neto)
  finalY += 6;
  doc.setFillColor(...slate50);
  doc.rect(rightColX - 60, finalY - 5, 60, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...slate900);
  doc.text(
    tieneDetraccion ? "TOTAL A PAGAR (NETO):" : "TOTAL A PAGAR:",
    rightColX - 30,
    finalY + 0.5,
    { align: "right" },
  );

  doc.setTextColor(...red600);
  doc.text(`S/ ${formatNumber(totalNeto)}`, rightColX - 2, finalY + 0.5, {
    align: "right",
  });

  // Total en Letras
  const totalEnLetras = numeroALetras(totalNeto, {
    plural: "SOLES",
    singular: "SOL",
    centPlural: "CÉNTIMOS",
    centSingular: "CÉNTIMO",
  });

  doc.setTextColor(...slate400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`SON: ${totalEnLetras}`, mX, finalY);

  // --- TABLA INFORMATIVA DE DETRACCIÓN ---
  if (tieneDetraccion) {
    finalY += 12;

    doc.setTextColor(...slate900);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("DETRACCIÓN", mX, finalY);

    doc.setFillColor(...amber500);
    doc.rect(mX, finalY + 1.5, 12, 0.8, "F");

    const detraccionData = [
      [
        String(ordenCompra.detraccion.codigo_detraccion || "-"),
        String(ordenCompra.detraccion.serie_correlativo || "-"),
        `${ordenCompra.detraccion.porcentaje_detraccion || 0}%`,
        String(
          ordenCompra.detraccion.fecha_detraccion
            ? formatDate(ordenCompra.detraccion.fecha_detraccion)
            : "-",
        ),
        `S/ ${formatNumber(montoDetraccion)}`,
      ],
    ];

    doc.autoTable({
      startY: finalY + 4,
      head: [
        ["CÓDIGO", "N° SERIE / CORRELATIVO", "PORCENTAJE", "FECHA", "MONTO"],
      ],
      body: detraccionData,
      margin: { left: mX, right: mX },
      theme: "plain",
      styles: { fontSize: 6, textColor: slate900, cellPadding: 2.5 },
      headStyles: { fillColor: slate900, textColor: white, fontStyle: "bold" },
      alternateRowStyles: { fillColor: slate50 },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "right" },
      },
    });

    finalY = doc.lastAutoTable.finalY;
  }

  // --- HISTORIAL DE PAGOS ---
  const tienePagos = ordenCompra.pagos && ordenCompra.pagos.length > 0;

  if (tienePagos) {
    finalY += 12;

    doc.setTextColor(...slate900);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("HISTORIAL DE PAGOS", mX, finalY);

    doc.setFillColor(...amber500);
    doc.rect(mX, finalY + 1.5, 12, 0.8, "F");

    const paymentData = ordenCompra.pagos.map((pago) => [
      pago.metodoPago?.descripcion || "N/A",
      pago.banco?.descripcion || "N/A",
      pago.operacion || "-",
      `${pago.fecha ? formatDate(pago.fecha) : "-"}`,
      `S/ ${formatNumber(pago.monto || 0)}`,
    ]);

    doc.autoTable({
      startY: finalY + 4,
      head: [["MÉTODO DE PAGO", "BANCO", "OPERACIÓN", "FECHA", "MONTO"]],
      body: paymentData,
      margin: { left: mX, right: mX },
      theme: "plain",
      styles: { fontSize: 6, textColor: slate900, cellPadding: 2.5 },
      headStyles: { fillColor: slate900, textColor: white, fontStyle: "bold" },
      alternateRowStyles: { fillColor: slate50 },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "right" },
      },
    });

    finalY = doc.lastAutoTable.finalY;
  }

  // --- SALDO PENDIENTE ---
  const totalPagos = (ordenCompra.pagos || []).reduce(
    (acc, pago) => acc + Number(pago.monto || 0),
    0,
  );

  // El saldo pendiente se calcula del total neto ya restando la detracción
  const saldoFinal = totalNeto - totalPagos;

  // Calculamos el Y para el saldo, si hubo tabla de pagos u otra
  const saldoY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : finalY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...slate900);
  doc.text(`SALDO PENDIENTE:`, rightColX - 30, saldoY, { align: "right" });

  doc.setTextColor(...red600);
  doc.text(`S/ ${formatNumber(saldoFinal)}`, rightColX, saldoY, {
    align: "right",
  });

  // --- RENDERIZADO FINAL ---
  const pdfOutput = doc.output("dataurlstring");
  const newWindow = window.open();

  if (newWindow) {
    newWindow.document.title = `OC-${formatWithLeadingZeros(ordenCompra?.id || 0, 6)}`;
    newWindow.document.write(`
      <html>
        <head><title>OC-${formatWithLeadingZeros(ordenCompra?.id || 0, 6)}</title></head>
        <body style="margin:0;">
          <embed width="100%" height="100%" src="${pdfOutput}" type="application/pdf" />
        </body>
      </html>
    `);
  }

  doc.save(`OC-${formatWithLeadingZeros(ordenCompra?.id || 0, 6)}.pdf`);
};

export default plantillaOrdenCompraPdf;
