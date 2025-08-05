import { jsPDF } from "jspdf";
import "jspdf-autotable";
import formatDate from "../hooks/FormatDate";
import { formatNumber, formatWithLeadingZeros } from "./formats";
import QRCode from "qrcode";
import { codigosBienes } from "../jsons/codigosBienes";
import { mediosDePago } from "../jsons/mediosPago";

const plantillaComprobantePdf = async (
  comprobanteElectronico,
  cuentasBancarias
) => {
  // Crear un nuevo documento PDF con fuente Arial
  const doc = new jsPDF();

  // Agregar la fuente Arial (que viene incorporada en jsPDF)
  doc.setFont("helvetica"); // "helvetica" es el equivalente a Arial en jsPDF

  // Asegúrate de que comprobanteElectronico no sea null o undefined
  if (!comprobanteElectronico || !comprobanteElectronico.cliente) {
    return;
  }

  // Estilos generales - usando siempre la misma fuente
  doc.setFontSize(8);

  // Verifica si el logo existe antes de agregarlo
  const logoUrl = import.meta.env.VITE_LOGO;
  if (logoUrl) {
    doc.addImage(logoUrl, "JPEG", 5, 5, 28, 23); // Añadir logo
  }

  // Información de la empresa
  // Información de la empresa - sin saltos de línea automáticos
  // Información de la empresa - prevenir saltos de línea de manera más estricta
  doc.setFontSize(8);
  // Eliminar cualquier salto de línea que pudiera existir en las variables
  const nombre = (import.meta.env.VITE_NOMBRE || "").replace(/\n/g, " ");
  doc.text(nombre, 40, 9);

  doc.setFontSize(7);
  const ruc = (import.meta.env.VITE_RUC || "").replace(/\n/g, " ");
  doc.text(ruc, 40, 13);

  const direccion = (import.meta.env.VITE_DIRRECION || "").replace(/\n/g, " ");
  doc.text(direccion, 40, 17);

  const telefono = `Central telefónica: ${(
    import.meta.env.VITE_TELEFONO || ""
  ).replace(/\n/g, " ")}`;
  doc.text(telefono, 40, 21);

  const correo = `Email: ${(import.meta.env.VITE_CORREO || "").replace(
    /\n/g,
    " "
  )}`;
  doc.text(correo, 40, 25);

  const web = `Web: ${(import.meta.env.VITE_WEB || "").replace(/\n/g, " ")}`;
  doc.text(web, 40, 29);
  // Caja de cotización
  doc.setFillColor("WHITE"); // Color blanco para el fondo
  doc.rect(145, 5, 55, 25, "FD"); // Dibuja el rectángulo con el borde y relleno

  // Configuración del texto
  doc.setTextColor("BLACK"); // Color negro para el texto

  // Texto "COTIZACIÓN" centrado en el rectángulo
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold"); // Usar helvetica bold para títulos
  const cotizacionText = comprobanteElectronico.tipoComprobante;
  const cotizacionWidth = doc.getTextWidth(cotizacionText); // Obtener el ancho del texto
  const cotizacionX = 153 + (40 - cotizacionWidth) / 2; // Calcular la posición X para centrar
  doc.text(cotizacionText, cotizacionX, 15); // Posición X centrada, Y en 20

  // Texto "COT-00000017" centrado en el rectángulo
  doc.setFontSize(10);
  const cotizacionCodeText = `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}`;
  const cotizacionCodeWidth = doc.getTextWidth(cotizacionCodeText); // Obtener el ancho del texto
  const cotizacionCodeX = 153 + (40 - cotizacionCodeWidth) / 2; // Calcular la posición X para centrar
  doc.text(cotizacionCodeText, cotizacionCodeX, 20); // Posición X centrada, Y en 25

  // Espaciado
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold"); // Mantener bold para etiquetas

  // Información del cliente
  doc.text("CLIENTE:", 10, 35);
  doc.setFont("helvetica", "normal"); // Cambiar a normal para valores
  doc.text(
    comprobanteElectronico.cliente?.nombreComercial ||
      comprobanteElectronico.cliente?.nombreApellidos ||
      " ",
    35,
    35
  );

  doc.setFont("helvetica", "bold");
  doc.text(`${comprobanteElectronico.cliente?.tipoDocIdentidad}:`, 10, 40);
  doc.setFont("helvetica", "normal");
  doc.text(` ${comprobanteElectronico.cliente?.numeroDoc || " "}`, 35, 40);

  doc.setFont("helvetica", "bold");
  doc.text("DIRECCIÓN:", 10, 45);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${comprobanteElectronico?.cliente?.direccion} - ${comprobanteElectronico?.cliente?.provincia.provincia} - ${comprobanteElectronico?.cliente?.distrito.distrito} - ${comprobanteElectronico?.cliente?.departamento.departamento}` ||
      " ",
    35,
    45
  );

  doc.setFont("helvetica", "bold");
  doc.text("VENDEDOR:", 10, 50);
  doc.setFont("helvetica", "normal");
  doc.text(comprobanteElectronico.vendedor || " ", 35, 50);

  doc.setFont("helvetica", "bold");
  doc.text("OBSERVACIONES:", 10, 55);
  doc.setFont("helvetica", "normal");
  doc.text(comprobanteElectronico.observacion || " ", 50, 55);

  if (comprobanteElectronico?.cotizacion) {
    doc.setFont("helvetica", "bold");
    doc.text("COTIZACION:", 10, 60);
    doc.setFont("helvetica", "normal");
    doc.text(
      `COT-${formatWithLeadingZeros(
        comprobanteElectronico?.cotizacion?.id,
        6
      )}`,
      35,
      60
    );
  }

  // Información adicional
  doc.setFont("helvetica", "bold");
  doc.text("FECHA DE EMISIÓN :", 145, 38);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(comprobanteElectronico.fechaEmision) || " ", 185, 38);

  doc.setFont("helvetica", "bold");
  doc.text("FECHA DE VENCIMIENTO:", 145, 42);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(comprobanteElectronico.fechaVencimiento) || " ", 185, 42);

  // Tabla de productos
  const productsColumns = [
    "CANT",
    "UNIDAD",
    "DESCRIPCIÓN",
    "V.UNIT",
    "SUB TOTAL",
  ];
  const productsData = comprobanteElectronico.productos.map((producto) => {
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
      precioUnitario.toFixed(2),
      formatNumber(total),
    ];
  });

  doc.autoTable({
    startY: 65,
    head: [productsColumns],
    body: productsData,
    margin: { top: 10, left: 10, rigth: 5 },
    styles: {
      fontSize: 8,
      font: "helvetica", // Aplicar Arial a toda la tabla
    },
    bodyStyles: { fillColor: [235, 235, 235] },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: "bold", // Usar bold para encabezados
    },
  });

  // Totales
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  doc.text(`OP. GRAVADAS:`, 165, doc.lastAutoTable.finalY + 5, {
    maxWidth: 30,
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${formatNumber(comprobanteElectronico?.total_valor_venta)}`,
    171,
    doc.lastAutoTable.finalY + 5
  );

  doc.setFont("helvetica", "bold");
  doc.text(`IGV:`, 165, doc.lastAutoTable.finalY + 10, {
    maxWidth: 30,
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${formatNumber(comprobanteElectronico?.total_igv)}`,
    171,
    doc.lastAutoTable.finalY + 10
  );

  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL A PAGAR:`, 165, doc.lastAutoTable.finalY + 15, {
    maxWidth: 30,
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.text(
    `S/ ${formatNumber(comprobanteElectronico.total_venta)}`,
    171,
    doc.lastAutoTable.finalY + 15
  );

  // Convertir el total a letras
  const totalEnLetras = comprobanteElectronico.legend;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`SON: ${totalEnLetras}`, 10, doc.lastAutoTable.finalY + 23);

  // Información de pagos
  const paymentColumns = [
    "MÉTODO DE PAGO",
    "BANCO",
    "OPERACIÓN",
    "MONTO",
    "FECHA",
  ];
  const paymentData = comprobanteElectronico.pagos.map((pago) => [
    pago.metodoPago.descripcion || " ",
    pago.banco?.descripcion || " ",
    pago.operacion || " ",
    `S/${formatNumber(pago.monto)}` || " ",
    `${formatDate(pago.fecha)}`,
  ]);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  if (comprobanteElectronico.detraccion) {
    doc.text(
      `Información de la detracción :`,
      10,
      doc.lastAutoTable.finalY + 28
    );

    doc.setFontSize(9);
    doc.text(`Bien o Servicio:`, 10, doc.lastAutoTable.finalY + 32);
    const bienEncontrado = codigosBienes.find(
      (codigo) =>
        codigo.codigo === comprobanteElectronico.detraccion.codBienDetraccion
    );

    doc.setFont("helvetica", "normal");
    doc.text(
      `${bienEncontrado.codigo} - ${bienEncontrado?.descripcion || ""}`,
      60,
      doc.lastAutoTable.finalY + 32
    );

    doc.setFont("helvetica", "bold");
    doc.text(`Medio de pago:`, 10, doc.lastAutoTable.finalY + 36);
    const medioPagoEncontrado = mediosDePago.find(
      (pago) => pago.codigo === comprobanteElectronico.detraccion.codMedioPago
    );

    doc.setFont("helvetica", "normal");
    doc.text(
      `${medioPagoEncontrado.codigo} - ${
        medioPagoEncontrado?.descripcion || ""
      }`,
      60,
      doc.lastAutoTable.finalY + 36
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      `Nro. Cta. Banco de la Nación:`,
      10,
      doc.lastAutoTable.finalY + 40
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      `${comprobanteElectronico.detraccion.ctaBancaria}      Porcentaje de detracción:     ${comprobanteElectronico.detraccion.porcentaje}      Monto detracción:    ${comprobanteElectronico.detraccion.montoDetraccion} `,
      60,
      doc.lastAutoTable.finalY + 40
    );

    doc.setFont("helvetica", "bold");
    doc.text(`PAGOS :`, 10, doc.lastAutoTable.finalY + 47);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 49,
      head: [paymentColumns],
      margin: { top: 10, left: 10, rigth: 5 },
      body: paymentData,
      styles: {
        fontSize: 8,
        font: "helvetica", // Aplicar Arial a toda la tabla
      },
      bodyStyles: { fillColor: [235, 235, 235] },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });
  } else {
    doc.text(`PAGOS :`, 10, doc.lastAutoTable.finalY + 30);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 33,
      head: [paymentColumns],
      body: paymentData,
      margin: { top: 10, left: 10, rigth: 5 },
      styles: {
        fontSize: 8,
        font: "helvetica", // Aplicar Arial a toda la tabla
      },
      bodyStyles: { fillColor: [235, 235, 235] },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });
  }

  doc.setFontSize(8);

  const qrContent = `${comprobanteElectronico.qrContent}`;

  // Crear un elemento canvas temporal para el QR
  const qrDataUrl = await QRCode.toDataURL(qrContent);
  if (comprobanteElectronico.digestValue !== null) {
    doc.addImage(qrDataUrl, "PNG", 160, doc.lastAutoTable.finalY, 35, 35);
    doc.text("Código Hash:", 133, doc.lastAutoTable.finalY + 37);
    doc.text(
      comprobanteElectronico.digestValue,
      150,
      doc.lastAutoTable.finalY + 37
    );
  }

  // doc.text(
  //   `TOTAL PAGADO: S/ ${formatNumber(
  //     comprobanteElectronico.saldoInicial - totalPagos
  //   )}`,
  //   15,
  //   doc.lastAutoTable.finalY + 10
  // );

  const pageHeight = doc.internal.pageSize.height; // Altura total de la página

  const bancosStartY = pageHeight - 45;

  doc.setFontSize(8);
  doc.text("CUENTAS BANCARIAS:", 10, bancosStartY + 5);

  const bancosColumns = [
    "Banco",
    "Moneda",
    "Código de Cuenta Interbancaria",
    "Código de Cuenta",
  ];

  const bancosBody = cuentasBancarias.map((cuentaBancaria) => [
    cuentaBancaria.descripcion,
    "Soles",
    cuentaBancaria.cci,
    cuentaBancaria.numero,
  ]);

  // Agregar la tabla al pie de página
  doc.autoTable({
    startY: bancosStartY + 10, // Posición calculada
    head: [bancosColumns],
    margin: { top: 10, left: 10, rigth: 5, bottom: 5 },

    body: bancosBody,
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [228, 228, 228], // Gris claro (RGB)
      textColor: [0, 0, 0],
      fontWeight: 400,
    },
  });

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
    `${comprobanteElectronico.serie}-${comprobanteElectronico.numeroSerie}.pdf`
  );
};

export default plantillaComprobantePdf;
