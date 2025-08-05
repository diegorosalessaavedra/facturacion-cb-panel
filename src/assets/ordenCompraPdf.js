import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { numeroALetras } from "./numeroLetras";
import formatDate from "../hooks/FormatDate";
import { formatNumber, formatWithLeadingZeros } from "./formats";

const plantillaOrdenCompraPdf = (ordenCompra) => {
  const doc = new jsPDF();

  if (!ordenCompra || !ordenCompra.proveedor) {
    console.error("No se proporcionaron datos válidos para la cotización.");
    return;
  }

  doc.setFontSize(8);

  const logoUrl = import.meta.env.VITE_LOGO;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", 20, 12, 28, 23);
  }

  doc.setFontSize(10);
  doc.text(import.meta.env.VITE_NOMBRE, 45, 15);
  doc.setFontSize(8);
  doc.text(import.meta.env.VITE_RUC, 45, 19);
  doc.text(import.meta.env.VITE_DIRRECION, 45, 23);
  doc.text(`Central telefónica: ${import.meta.env.VITE_TELEFONO}`, 45, 27);
  doc.text(`Email: ${import.meta.env.VITE_CORREO}`, 45, 32);
  doc.text(`Web: ${import.meta.env.VITE_WEB}`, 45, 37);

  doc.setFillColor("WHITE");
  doc.rect(160, 10, 40, 25, "FD");

  doc.setTextColor("BLACK");

  doc.setFontSize(9);
  const cotizacionText = "SOLPED";
  const cotizacionWidth = doc.getTextWidth(cotizacionText);
  const cotizacionX = 160 + (40 - cotizacionWidth) / 2;
  doc.text(cotizacionText, cotizacionX, 20);

  doc.setFontSize(12);
  const cotizacionCodeText = `COD-${formatWithLeadingZeros(
    ordenCompra?.id,
    6
  )}`;
  const cotizacionCodeWidth = doc.getTextWidth(cotizacionCodeText);
  const cotizacionCodeX = 160 + (40 - cotizacionCodeWidth) / 2;
  doc.text(cotizacionCodeText, cotizacionCodeX, 25);

  doc.setFontSize(9);

  doc.text("Proveedor:", 15, 50);
  doc.text(
    ordenCompra.proveedor?.nombreComercial ||
      ordenCompra.proveedor?.nombreApellidos ||
      " ",
    35,
    50
  );
  doc.text(`${ordenCompra.proveedor?.tipoDocIdentidad}`, 15, 55);

  doc.text(` ${ordenCompra.proveedor?.numeroDoc || " "}`, 35, 55);
  doc.text("Dirección:", 15, 60);
  doc.text(
    ` ${ordenCompra?.proveedor?.distrito?.distrito} - ${ordenCompra?.proveedor?.provincia?.provincia} - ${ordenCompra?.proveedor?.departamento?.departamento}` ||
      " ",
    35,
    60
  );
  doc.text("Comprador:", 15, 65);
  doc.text(ordenCompra.comprador || " ", 35, 65);
  doc.text("Observación:", 15, 70);
  doc.text(ordenCompra.observacion || " ", 35, 70);

  // Información adicional
  doc.text("Fecha de emisión:", 140, 50);
  doc.text(ordenCompra.fechaEmision || " ", 180, 50);
  doc.text("Fecha de vencimiento:", 140, 55);
  doc.text(ordenCompra.fechaVencimiento || " ", 180, 55);

  // Tabla de productos
  const productsColumns = [
    "CANT",
    "UNIDAD",
    "DESCRIPCIÓN",
    "V.UNIT",
    "SUB TOTAL",
  ];
  const productsData = ordenCompra.productos.map((producto) => {
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
      producto.producto?.codUnidad,
      producto.producto?.nombre || " ",
      precioUnitario.toFixed(2), // Aplicar .toFixed solo a números válidos
      formatNumber(total),
    ];
  });

  doc.autoTable({
    startY: 75,
    head: [productsColumns],
    body: productsData,
    margin: { top: 10 },
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [228, 228, 228], // Gris claro (RGB)
      textColor: [0, 0, 0],
      fontWeight: 400,
    },
    didDrawCell: (data) => {
      // Asegurarse de dibujar un borde en la parte superior e inferior del encabezado
      if (data.section === "head") {
        // Borde superior (más grueso)
        doc.setLineWidth(0.3); // Grosor del borde superior
        doc.setDrawColor(0, 0, 0); // Color negro para los bordes

        // Línea superior (borde superior)
        doc.line(
          data.cell.x, // Coordenada X inicial (inicio de la celda)
          data.cell.y, // Coordenada Y inicial (arriba de la celda)
          data.cell.x + data.cell.width, // Coordenada X final (ancho de la celda)
          data.cell.y // Coordenada Y final (misma Y para línea horizontal)
        );

        // Borde inferior (más delgado)
        doc.setLineWidth(0.8); // Grosor del borde inferior (más delgado)

        // Línea inferior (borde inferior)
        doc.line(
          data.cell.x, // Coordenada X inicial (inicio de la celda)
          data.cell.y + data.cell.height, // Coordenada Y final (abajo de la celda)
          data.cell.x + data.cell.width, // Coordenada X final (ancho de la celda)
          data.cell.y + data.cell.height // Coordenada Y final (misma Y para línea horizontal)
        );
      }

      if (data.section === "body") {
        // Borde superior
        doc.setLineWidth(0.3); // Grosor del borde, ajustado a 1 para hacerlo normal
        doc.setDrawColor(0, 0, 0); // Color negro para los bordes

        // Línea inferior
        doc.line(
          data.cell.x, // Coordenada X inicial (inicio de la celda)
          data.cell.y + data.cell.height, // Coordenada Y final (abajo de la celda)
          data.cell.x + data.cell.width, // Coordenada X final (ancho de la celda)
          data.cell.y + data.cell.height // Coordenada Y final (misma Y para línea horizontal)
        );
      }
    },
  });

  // Totales
  const opGravadas = Number(ordenCompra.saldoInicial) / 1.18;

  doc.setFont("helvetica", "bold");

  doc.text(`OP. GRAVADAS:`, 165, doc.lastAutoTable.finalY + 5, {
    maxWidth: 30,
    align: "right",
  });
  doc.text(`S/ ${formatNumber(opGravadas)}`, 171, doc.lastAutoTable.finalY + 5);
  doc.text(`IGV:`, 165, doc.lastAutoTable.finalY + 10, {
    maxWidth: 30,
    align: "right",
  });
  doc.text(
    `S/ ${formatNumber(opGravadas * 0.18)}`,
    171,
    doc.lastAutoTable.finalY + 10
  );

  doc.text(`TOTAL A PAGAR:`, 165, doc.lastAutoTable.finalY + 15, {
    maxWidth: 30,
    align: "right",
  });
  doc.text(
    `S/ ${formatNumber(ordenCompra.saldoInicial)}`,
    171,
    doc.lastAutoTable.finalY + 15
  );

  // Convertir el total a letras
  const totalEnLetras = numeroALetras(ordenCompra.saldoInicial, {
    plural: "SOLES",
    singular: "SOLES",
    centPlural: "CENTIMOS",
    centSingular: "CENTIMOS",
  });
  doc.setFontSize(8);
  doc.text(`SON: ${totalEnLetras}`, 15, doc.lastAutoTable.finalY + 23);

  // Información de pagos
  const paymentColumns = [
    "Método de pago",
    "Banco",
    "Operación",
    "Monto",
    "Fecha",
  ];
  const paymentData = ordenCompra.pagos.map((pago) => [
    pago.metodoPago.descripcion || " ",
    pago.banco?.descripcion || " ",
    pago.operacion || " ",
    `S/${formatNumber(pago.monto)}` || " ",
    `${formatDate(pago.fecha)}`,
  ]);

  doc.setFontSize(10);

  doc.text(`PAGOS :`, 15, doc.lastAutoTable.finalY + 30);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 35,
    head: [paymentColumns],
    body: paymentData,
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [228, 228, 228], // Gris claro (RGB)
      textColor: [0, 0, 0],
      fontWeight: 400,
    },

    didDrawCell: (data) => {
      if (data.section === "head") {
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.line(
          data.cell.x, // Coordenada X inicial (inicio de la celda)
          data.cell.y, // Coordenada Y inicial (arriba de la celda)
          data.cell.x + data.cell.width, // Coordenada X final (ancho de la celda)
          data.cell.y // Coordenada Y final (misma Y para línea horizontal)
        );

        // Borde inferior (más delgado)
        doc.setLineWidth(0.8); // Grosor del borde inferior (más delgado)

        // Línea inferior (borde inferior)
        doc.line(
          data.cell.x, // Coordenada X inicial (inicio de la celda)
          data.cell.y + data.cell.height, // Coordenada Y final (abajo de la celda)
          data.cell.x + data.cell.width, // Coordenada X final (ancho de la celda)
          data.cell.y + data.cell.height // Coordenada Y final (misma Y para línea horizontal)
        );
      }

      if (data.section === "body") {
        // Borde superior
        doc.setLineWidth(0.3); // Grosor del borde, ajustado a 1 para hacerlo normal
        doc.setDrawColor(0, 0, 0); // Color negro para los bordes

        // Línea inferior
        doc.line(
          data.cell.x, // Coordenada X inicial (inicio de la celda)
          data.cell.y + data.cell.height, // Coordenada Y final (abajo de la celda)
          data.cell.x + data.cell.width, // Coordenada X final (ancho de la celda)
          data.cell.y + data.cell.height // Coordenada Y final (misma Y para línea horizontal)
        );
      }
    },
  });

  // Saldo
  const totalPagos = ordenCompra.pagos.reduce(
    (acc, pago) => acc + Number(pago.monto),
    0
  );

  doc.setFontSize(10);

  doc.text(
    `SALDO: S/ ${formatNumber(ordenCompra.saldoInicial - totalPagos)}`,
    15,
    doc.lastAutoTable.finalY + 10
  );

  const pdfOutput = doc.output("dataurlstring");
  const newWindow = window.open();

  if (newWindow) {
    newWindow.document.title = `OC-${formatWithLeadingZeros(
      ordenCompra?.id,
      6
    )}`;
    newWindow.document.write(`
      <html>
        <head>
          <title>OC-${formatWithLeadingZeros(ordenCompra?.id, 6)}</title>
        </head>
        <body style="margin:0;">
          <embed width="100%" height="100%" src="${pdfOutput}" type="application/pdf" />
        </body>
      </html>
    `);
  }

  doc.save(`OC-${formatWithLeadingZeros(ordenCompra?.id, 6)}.pdf`);
};

export default plantillaOrdenCompraPdf;
