import * as XLSX from "xlsx-js-style";
import { formatWithLeadingZeros } from "../../assets/formats";
import formatDate from "../../hooks/FormatDate";

export const descargarExcelProveedor = (
  rows,
  totalSaldo,
  proveedorNombre,
  formDetracciones = {}, // NUEVO: Pasamos el estado de detracciones para extraer los valores reales
  tieneDetraccion = false, // NUEVO: Flag para saber si imprimimos la sección de detracción
) => {
  const formatoSoles = '"S/"#,##0.00';

  // 1. Definir los estilos
  const styles = {
    headerAzul: {
      fill: { fgColor: { rgb: "1D4ED8" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { right: { style: "thin", color: { rgb: "1E40AF" } } },
    },
    headerAmbar: {
      fill: { fgColor: { rgb: "F59E0B" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { right: { style: "thin", color: { rgb: "D97706" } } },
    },
    headerVerde: {
      fill: { fgColor: { rgb: "16A34A" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
    },
    subHeaderAzul: {
      fill: { fgColor: { rgb: "DBEAFE" } },
      font: { bold: true, color: { rgb: "0F172A" } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "thin" }, right: { style: "thin" } },
    },
    subHeaderAmbar: {
      fill: { fgColor: { rgb: "FFFBEB" } },
      font: { bold: true, color: { rgb: "78350F" } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "thin" }, right: { style: "thin" } },
    },
    subHeaderVerde: {
      fill: { fgColor: { rgb: "F0FDF4" } },
      font: { bold: true, color: { rgb: "1E293B" } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "thin" }, right: { style: "thin" } },
    },
    cellGeneral: {
      alignment: { vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "E2E8F0" } } },
    },
    cellDerecha: {
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "E2E8F0" } } },
    },
    cellNegritaDerecha: {
      // <- Agregado estilo que faltaba
      font: { bold: true },
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "CBD5E1" } } },
    },
    cellCentro: {
      alignment: { horizontal: "center", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "E2E8F0" } } },
    },
    cellMoneda: {
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "E2E8F0" } } },
      numFmt: formatoSoles,
    },
    cellMonedaNegrita: {
      font: { bold: true },
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "CBD5E1" } } },
      numFmt: formatoSoles,
    },
    cellSaldo: {
      fill: { fgColor: { rgb: "FEF2F2" } },
      font: { bold: true, color: { rgb: "DC2626" } },
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "CBD5E1" } } },
      numFmt: formatoSoles,
    },
    footerNegro: {
      // <- Cambiado a colores oscuros según tu tfoot en React
      fill: { fgColor: { rgb: "0F172A" } }, // bg-slate-900
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "334155" } },
        top: { style: "medium", color: { rgb: "334155" } }, // border-slate-700
      },
    },
    footerDeuda: {
      fill: { fgColor: { rgb: "0F172A" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "334155" } },
        top: { style: "medium", color: { rgb: "334155" } },
      },
      numFmt: formatoSoles,
    },
    badgeDebe: {
      // Estilos para el texto de estado en el footer
      fill: { fgColor: { rgb: "EF4444" } }, // bg-red-500
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "medium", color: { rgb: "B91C1C" } } },
    },
    badgeFavor: {
      fill: { fgColor: { rgb: "F59E0B" } }, // bg-amber-500
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "medium", color: { rgb: "D97706" } } },
    },
    badgeCancelado: {
      fill: { fgColor: { rgb: "22C55E" } }, // bg-green-500
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "medium", color: { rgb: "16A34A" } } },
    },
  };

  const excelData = [];

  // 2. Cabeceras Dinámicas (Construcción basada en flag tieneDetraccion)
  const cabeceraFila1 = [
    { v: "DETALLE DE ENVÍO", s: styles.headerAzul },
    "",
    "",
    "",
    "",
    "",
    "",
  ];
  if (tieneDetraccion) {
    cabeceraFila1.push(
      { v: "DETRACCIONES", s: styles.headerAmbar },
      "",
      "",
      "",
    );
  }
  cabeceraFila1.push(
    { v: "DETALLE DE PAGO", s: styles.headerVerde },
    "",
    "",
    "",
    "",
  );
  excelData.push(cabeceraFila1);

  const cabeceraFila2 = [
    { v: "Fecha", s: styles.subHeaderAzul },
    { v: "SOLPED", s: styles.subHeaderAzul },
    { v: "Serie Correlativo", s: styles.subHeaderAzul },
    { v: "Descripción", s: styles.subHeaderAzul },
    { v: "Cant.", s: styles.subHeaderAzul },
    { v: "P.U", s: styles.subHeaderAzul },
    { v: "Total", s: styles.subHeaderAzul },
  ];
  if (tieneDetraccion) {
    cabeceraFila2.push(
      { v: "Cód Dr", s: styles.subHeaderAmbar },
      { v: "Fecha Dr", s: styles.subHeaderAmbar },
      { v: "Porcentaje Dr", s: styles.subHeaderAmbar },
      { v: "Monto Dr", s: styles.subHeaderAmbar },
    );
  }
  cabeceraFila2.push(
    { v: "Fecha Pago", s: styles.subHeaderVerde },
    { v: "Monto", s: styles.subHeaderVerde },
    { v: "Saldo", s: styles.subHeaderVerde },
    { v: "Operación", s: styles.subHeaderVerde },
    { v: "Banco", s: styles.subHeaderVerde },
  );
  excelData.push(cabeceraFila2);

  // 3. Llenar el cuerpo
  rows.forEach((row) => {
    const { orden, prod, pago, isFirstRow, saldoActual } = row;
    const bancoNombre =
      pago?.banco?.banco ||
      pago?.banco?.descripcion ||
      pago?.banco ||
      (isFirstRow ? orden.banco_beneficiario : "-");
    const detracData = formDetracciones[orden.id] || {};

    // Datos de la orden (Solo primera fila del bloque)
    const rowData = [
      {
        v: isFirstRow ? formatDate(orden.fechaEmision) || "-" : "",
        s: styles.cellCentro,
      },
      {
        v: isFirstRow ? `COD-000${formatWithLeadingZeros(orden?.id, 3)}` : "",
        s: styles.cellCentro,
      },
      {
        v: isFirstRow ? detracData.serie_correlativo || "-" : "",
        s: styles.cellCentro,
      },

      // Datos del Producto
      {
        v: prod ? prod.descripcion_producto || prod.producto?.nombre : "-",
        s: styles.cellGeneral,
      },
      {
        v: prod ? Number(prod.cantidad) : "-",
        t: prod ? "n" : "s",
        s: prod ? styles.cellMoneda : styles.cellDerecha,
      },
      {
        v: prod ? Number(prod.precioUnitario) : "-",
        t: prod ? "n" : "s",
        s: prod ? styles.cellMoneda : styles.cellDerecha,
      },
      {
        v: prod ? Number(prod.total) : "-",
        t: prod ? "n" : "s",
        s: prod ? styles.cellMonedaNegrita : styles.cellNegritaDerecha,
      },
    ];

    // Datos de Detracción (Condicional)
    if (tieneDetraccion) {
      if (isFirstRow) {
        const detracData = formDetracciones[orden.id] || {};
        rowData.push(
          { v: detracData.codigo_detraccion || "-", s: styles.cellCentro },
          { v: detracData.fecha_detraccion || "-", s: styles.cellCentro },
          {
            v: detracData.porcentaje_detraccion
              ? `${detracData.porcentaje_detraccion}%`
              : "-",
            s: styles.cellCentro,
          },
          {
            v: detracData.monto_detraccion
              ? Number(detracData.monto_detraccion)
              : "-",
            t: detracData.monto_detraccion ? "n" : "s",
            s: detracData.monto_detraccion
              ? styles.cellMoneda
              : styles.cellCentro,
          },
        );
      } else {
        rowData.push(
          { v: "", s: styles.cellCentro },
          { v: "", s: styles.cellCentro },
          { v: "", s: styles.cellCentro },
          { v: "", s: styles.cellCentro },
        );
      }
    }

    // Datos del Pago
    rowData.push(
      { v: pago ? pago.createdAt?.split("T")[0] : "-", s: styles.cellCentro },
      {
        v: pago ? Number(pago.monto) : "-",
        t: pago ? "n" : "s",
        s: pago ? styles.cellMonedaNegrita : styles.cellNegritaDerecha,
      },
      { v: Number(saldoActual), t: "n", s: styles.cellSaldo }, // Saldo individual por orden
      { v: pago ? pago.operacion : "-", s: styles.cellCentro },
      { v: bancoNombre, s: styles.cellCentro },
    );

    excelData.push(rowData);
  });

  // 4. Agregar el Footer (Gran Total)
  if (rows.length > 0) {
    const totalColsToSkip = tieneDetraccion ? 11 : 7; // Columnas vacías antes de "TOTALES"
    const footerRow = [];

    // Rellenar celdas previas vacías
    for (let i = 0; i < totalColsToSkip; i++) {
      footerRow.push({ v: "", s: styles.footerNegro });
    }

    // Texto "TOTALES"
    footerRow.push({ v: "TOTALES", s: styles.footerNegro });

    // Suma final
    footerRow.push({ v: Number(totalSaldo), t: "n", s: styles.footerDeuda });

    // Badge de estado (Debe, A favor, Cancelado)
    let badgeStyle = styles.badgeCancelado;
    let badgeText = "CANCELADO";
    if (totalSaldo > 0) {
      badgeStyle = styles.badgeDebe;
      badgeText = "DEBE";
    } else if (totalSaldo < 0) {
      badgeStyle = styles.badgeFavor;
      badgeText = "A FAVOR";
    }

    footerRow.push({ v: badgeText, s: badgeStyle });
    footerRow.push({ v: "", s: badgeStyle }); // Celda extra para combinar

    excelData.push(footerRow);
  }

  // 5. Configurar libro, fusiones y anchos
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // DETALLE DE ENVIO
  ];

  if (tieneDetraccion) {
    ws["!merges"].push({ s: { r: 0, c: 7 }, e: { r: 0, c: 10 } }); // DETRACCIONES (4 cols)
    ws["!merges"].push({ s: { r: 0, c: 11 }, e: { r: 0, c: 15 } }); // DETALLE DE PAGO (5 cols)
  } else {
    ws["!merges"].push({ s: { r: 0, c: 7 }, e: { r: 0, c: 11 } }); // DETALLE DE PAGO (5 cols, empieza antes)
  }

  if (rows.length > 0) {
    const lastRowIndex = excelData.length - 1;
    const mergeEndCol = tieneDetraccion ? 10 : 6;
    const statusColStart = tieneDetraccion ? 14 : 10;

    // Unir todo el espacio vacío antes de TOTALES
    ws["!merges"].push({
      s: { r: lastRowIndex, c: 0 },
      e: { r: lastRowIndex, c: mergeEndCol },
    });
    // Unir las dos últimas celdas para el badge de estado
    ws["!merges"].push({
      s: { r: lastRowIndex, c: statusColStart },
      e: { r: lastRowIndex, c: statusColStart + 1 },
    });
  }

  // Anchos condicionales
  const colsConfig = [
    { wch: 12 },
    { wch: 14 },
    { wch: 15 },
    { wch: 30 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 }, // Envío
  ];
  if (tieneDetraccion) {
    colsConfig.push({ wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 12 }); // Detracciones
  }
  colsConfig.push(
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
  ); // Pago

  ws["!cols"] = colsConfig;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Estado de Cuenta");

  const fileName = `Estado_Cuenta_${proveedorNombre?.replace(/\s+/g, "_") || "Proveedor"}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
