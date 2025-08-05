import { jsPDF } from "jspdf";
import "jspdf-autotable";
import formatDate from "../hooks/FormatDate";
import { formatNumber } from "./formats";
import "@fontsource-variable/roboto-condensed";
import QRCode from "qrcode";

const loadRobotoCondensed = async () => {
  try {
    const response = await fetch(
      "/node_modules/@fontsource-variable/roboto-condensed/files/roboto-condensed-latin-variable-wghtOnly-normal.woff2"
    );
    const fontData = await response.arrayBuffer();
    const base64Font = btoa(String.fromCharCode(...new Uint8Array(fontData)));
    return base64Font;
  } catch (error) {
    console.error("Error loading font:", error);
    return null;
  }
};

const plantillaNotaComprobantePdf = async (notaComprobante) => {
  const doc = new jsPDF();
  const robotoCondensedFont = await loadRobotoCondensed();
  if (robotoCondensedFont) {
    // Establecer como fuente predeterminada
    doc?.setFont("RobotoCondensed", "normal");
  }

  // Asegúrate de que notaComprobante no sea null o undefined
  if (!notaComprobante || !notaComprobante.cliente) {
    console.error("No se proporcionaron datos válidos para la cotización.");
    return;
  }

  // Estilos generales
  doc.setFontSize(8);
  doc.setFont("RobotoCondensed", "normal", 600); // Simular bold usando weight 700

  // Verifica si el logo existe antes de agregarlo
  const logoUrl = import.meta.env.VITE_LOGO;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", 10, 12, 28, 23); // Añadir logo
  }

  // Información de la empresa
  doc.setFontSize(10);
  doc.text(import.meta.env.VITE_NOMBRE, 45, 15);
  doc.setFontSize(8);
  doc.text(import.meta.env.VITE_RUC, 45, 19);
  doc.text(import.meta.env.VITE_DIRRECION, 45, 23);
  doc.text(`Central telefónica: ${import.meta.env.VITE_TELEFONO}`, 45, 27);
  doc.text(`Email: ${import.meta.env.VITE_CORREO}`, 45, 32);
  doc.text(`Web: ${import.meta.env.VITE_WEB}`, 45, 37);

  // Caja de cotización
  doc.setFillColor("WHITE"); // Color blanco para el fondo
  doc.rect(140, 10, 60, 25, "FD"); // Dibuja el rectángulo con el borde y relleno

  // Configuración del texto
  doc.setTextColor("BLACK"); // Color negro para el texto

  // Texto "COTIZACIÓN" centrado en el rectángulo
  doc.setFontSize(9);
  const cotizacionText = notaComprobante.tipo_nota;
  const cotizacionWidth = doc.getTextWidth(cotizacionText); // Obtener el ancho del texto
  const cotizacionX = 150 + (40 - cotizacionWidth) / 2; // Calcular la posición X para centrar
  doc.text(cotizacionText, cotizacionX, 20); // Posición X centrada, Y en 20

  // Texto "COT-00000017" centrado en el rectángulo
  doc.setFontSize(12);
  const cotizacionCodeText = `${notaComprobante.serie}-${notaComprobante.numero_serie}`;
  const cotizacionCodeWidth = doc.getTextWidth(cotizacionCodeText); // Obtener el ancho del texto
  const cotizacionCodeX = 150 + (40 - cotizacionCodeWidth) / 2; // Calcular la posición X para centrar
  doc.text(cotizacionCodeText, cotizacionCodeX, 26); // Posición X centrada, Y en 25

  // Espaciado
  doc.setFontSize(9);

  doc.text("FECHA DE EMISIÓN :", 15, 45);
  doc.text(formatDate(notaComprobante.fecha_emision) || " ", 50, 45);

  // Información del cliente
  doc.text("CLIENTE:", 15, 50);
  doc.text(
    notaComprobante.cliente?.nombreComercial ||
      notaComprobante.cliente?.nombreApellidos ||
      " ",
    50,
    50
  );
  doc.text(`${notaComprobante.cliente?.tipoDocIdentidad}`, 15, 55);

  doc.text(` ${notaComprobante.cliente?.numeroDoc || " "}`, 50, 55);

  doc.text("DIRECCIÓN:", 15, 60);
  doc.text(
    `${notaComprobante?.cliente?.direccion} - ${notaComprobante?.cliente?.provincia.provincia} - ${notaComprobante?.cliente?.distrito.distrito} - ${notaComprobante?.cliente?.departamento.departamento}` ||
      " ",
    50,
    60
  );
  doc.text("DOC. AFECTADO :", 15, 65);
  doc.text(
    ` ${notaComprobante?.comprobantesElectronico.serie}-${notaComprobante?.comprobantesElectronico.numeroSerie}` ||
      " ",
    50,
    65
  );
  doc.text("TIPO DE NOTA :", 15, 70);
  doc.text(notaComprobante.motivo || " ", 50, 70);
  doc.text("DESCRIPCIÓN :", 15, 75);
  doc.text(notaComprobante.descripcion || " ", 50, 75);
  // Información adicional

  // Tabla de productos
  const productsColumns = [
    "CANT",
    "UNIDAD",
    "DESCRIPCIÓN",
    "V.UNIT",
    "SUB TOTAL",
  ];
  const productsData = notaComprobante.productos.map((producto) => {
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
    startY: 85,
    head: [productsColumns],
    body: productsData,
    margin: { top: 10 },
    styles: { fontSize: 8 },
    bodyStyles: { fillColor: [235, 235, 235] },
    headStyles: {
      fillColor: [220, 220, 220], // Gris claro (RGB)
      textColor: [0, 0, 0],
      fontWeight: 400,
    },
  });

  // Totales

  doc.setFont("RobotoCondensed", "normal", 700);
  doc.setFontSize(9);

  doc.text(`OP. GRAVADAS:`, 165, doc.lastAutoTable.finalY + 5, {
    maxWidth: 30,
    align: "right",
  });
  doc.text(
    `S/ ${formatNumber(notaComprobante?.total_valor_venta)}`,
    171,
    doc.lastAutoTable.finalY + 5
  );
  doc.text(`IGV:`, 165, doc.lastAutoTable.finalY + 10, {
    maxWidth: 30,
    align: "right",
  });
  doc.text(
    `S/ ${formatNumber(notaComprobante?.total_igv)}`,
    171,
    doc.lastAutoTable.finalY + 10
  );

  doc.text(`TOTAL A PAGAR:`, 165, doc.lastAutoTable.finalY + 15, {
    maxWidth: 30,
    align: "right",
  });
  doc.text(
    `S/ ${formatNumber(notaComprobante.total_venta)}`,
    171,
    doc.lastAutoTable.finalY + 15
  );

  // Convertir el total a letras
  const totalEnLetras = notaComprobante.legend;
  doc.setFont("RobotoCondensed", "normal", 600);
  doc.setFontSize(8);
  doc.text(`SON: ${totalEnLetras}`, 15, doc.lastAutoTable.finalY + 23);
  doc.text(
    `VENDEDOR: ${notaComprobante.comprobantesElectronico.vendedor}`,
    15,
    doc.lastAutoTable.finalY + 28
  );

  doc.setFontSize(8);

  const qrContent = `${notaComprobante.qrContent}`;

  // Crear un elemento canvas temporal para el QR
  const qrDataUrl = await QRCode.toDataURL(qrContent);

  if (notaComprobante.digestValue !== null) {
    doc.addImage(qrDataUrl, "PNG", 150, doc.lastAutoTable.finalY + 20, 40, 40);
    doc.text("Código Hash:", 133, doc.lastAutoTable.finalY + 65);
    doc.text(notaComprobante.digestValue, 150, doc.lastAutoTable.finalY + 65);
  }
  const pdfOutput = doc.output("dataurlstring");
  const newWindow = window.open();

  if (newWindow) {
    newWindow.document.title = `${notaComprobante.serie}-${notaComprobante.numero_serie}`;
    newWindow.document.write(`
      <html>
        <head>
          <title>${notaComprobante.serie}-${notaComprobante.numero_serie}</title>
        </head>
        <body style="margin:0;">
          <embed width="100%" height="100%" src="${pdfOutput}" type="application/pdf" />
        </body>
      </html>
    `);
  }

  doc.save(`${notaComprobante.serie}-${notaComprobante.numero_serie}.pdf`);
};

export default plantillaNotaComprobantePdf;
