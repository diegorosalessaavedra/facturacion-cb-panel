import * as XLSX from "xlsx-js-style";
import { formatWithLeadingZeros } from "../../assets/formats";
import formatDate from "../../hooks/FormatDate";

export const descargarExcelProveedor = (
  rows,
  totalSaldo,
  proveedorNombre,
  formDetracciones = {},
  tieneDetraccion = false,
) => {
  const formatoSoles = '"S/"#,##0.00';
  const formatoNumber = "#,##0";

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
      alignment: { horizontal: "center", vertical: "center" },
      border: { bottom: { style: "thin" }, right: { style: "thin" } },
    },
    subHeaderAmbar: {
      fill: { fgColor: { rgb: "FFFBEB" } },
      font: { bold: true, color: { rgb: "78350F" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { bottom: { style: "thin" }, right: { style: "thin" } },
    },
    subHeaderVerde: {
      fill: { fgColor: { rgb: "F0FDF4" } },
      font: { bold: true, color: { rgb: "1E293B" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { bottom: { style: "thin" }, right: { style: "thin" } },
    },
    cellGeneral: {
      alignment: { vertical: "center", wrapText: true },
      border: {
        right: { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
    },
    cellDerecha: {
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
    },
    cellNegritaDerecha: {
      font: { bold: true },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "CBD5E1" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
    },
    cellCentro: {
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
    },
    cellMoneda: {
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
      numFmt: formatoSoles,
    },
    cellNumero: {
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
      numFmt: formatoNumber,
    },
    cellMonedaNegrita: {
      font: { bold: true },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "CBD5E1" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
      numFmt: formatoSoles,
    },
    cellSaldo: {
      fill: { fgColor: { rgb: "FEF2F2" } },
      font: { bold: true, color: { rgb: "DC2626" } },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "CBD5E1" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      },
      numFmt: formatoSoles,
    },
    footerNegro: {
      fill: { fgColor: { rgb: "0F172A" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "334155" } },
        top: { style: "medium", color: { rgb: "334155" } },
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
      fill: { fgColor: { rgb: "EF4444" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "medium", color: { rgb: "B91C1C" } } },
    },
    badgeFavor: {
      fill: { fgColor: { rgb: "F59E0B" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "medium", color: { rgb: "D97706" } } },
    },
    badgeCancelado: {
      fill: { fgColor: { rgb: "22C55E" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "medium", color: { rgb: "16A34A" } } },
    },
  };

  const excelData = [];
  const dynamicMerges = []; // 🟢 AQUÍ ALMACENAREMOS LAS FUSIONES VERTICALES

  // 2. Cabeceras Dinámicas
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
  let currentRowIdx = 2; // Las cabeceras ocupan la fila 0 y 1

  rows.forEach((row) => {
    // 🟢 Extraemos variables y calculamos isAnticipo por si acaso no viene en la prop
    const {
      orden,
      prod,
      pago,
      pagoReal,
      isFirstRow,
      saldoActual,
      maxRows,
      esAnticipo,
    } = row;
    const isAnticipo =
      esAnticipo ||
      prod?.descripcion_producto === "Anticipos" ||
      prod?.producto?.nombre === "Anticipos";

    // 🟢 CÁLCULO DE UNIÓN DE CELDAS VERTICALES
    if (isFirstRow && maxRows > 1) {
      // Fecha (Columna 0)
      dynamicMerges.push({
        s: { r: currentRowIdx, c: 0 },
        e: { r: currentRowIdx + maxRows - 1, c: 0 },
      });
      // SOLPED (Columna 1)
      dynamicMerges.push({
        s: { r: currentRowIdx, c: 1 },
        e: { r: currentRowIdx + maxRows - 1, c: 1 },
      });
      // Serie Correlativo (Columna 2)
      dynamicMerges.push({
        s: { r: currentRowIdx, c: 2 },
        e: { r: currentRowIdx + maxRows - 1, c: 2 },
      });

      if (tieneDetraccion) {
        // Detracciones: Columnas 7, 8, 9, 10
        dynamicMerges.push({
          s: { r: currentRowIdx, c: 7 },
          e: { r: currentRowIdx + maxRows - 1, c: 7 },
        });
        dynamicMerges.push({
          s: { r: currentRowIdx, c: 8 },
          e: { r: currentRowIdx + maxRows - 1, c: 8 },
        });
        dynamicMerges.push({
          s: { r: currentRowIdx, c: 9 },
          e: { r: currentRowIdx + maxRows - 1, c: 9 },
        });
        dynamicMerges.push({
          s: { r: currentRowIdx, c: 10 },
          e: { r: currentRowIdx + maxRows - 1, c: 10 },
        });
      }
    }

    const bancoNombre =
      pagoReal?.banco?.banco ||
      pagoReal?.banco?.descripcion ||
      pagoReal?.banco ||
      "-";
    const detracData = formDetracciones[orden.id] || {};

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

      {
        v:
          (prod?.descripcion_producto &&
            prod?.descripcion_producto !== "null" &&
            prod.descripcion_producto) ||
          prod?.producto?.nombre ||
          "-",
        s: styles.cellGeneral,
      },
      {
        v: prod ? Number(prod.cantidad) : "-",
        t: prod ? "n" : "s",
        s: prod ? styles.cellNumero : styles.cellDerecha,
      },
      // CONDICIONAL APLICADA AQUÍ PARA P.U
      {
        v: prod ? (isAnticipo ? 0 : Number(prod.precioUnitario)) : "-",
        t: prod ? "n" : "s",
        s: prod ? styles.cellMoneda : styles.cellDerecha,
      },
      // CONDICIONAL APLICADA AQUÍ PARA EL TOTAL
      {
        v: prod ? (isAnticipo ? 0 : Number(prod.total)) : "-",
        t: prod ? "n" : "s",
        s: prod ? styles.cellMonedaNegrita : styles.cellNegritaDerecha,
      },
    ];

    if (tieneDetraccion) {
      if (isFirstRow) {
        rowData.push(
          { v: detracData.codigo_detraccion || "-", s: styles.cellCentro },
          {
            v: formatDate(detracData.fecha_detraccion) || "-",
            s: styles.cellCentro,
          },
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

    rowData.push(
      { v: pagoReal ? formatDate(pagoReal.fecha) : "-", s: styles.cellCentro },
      {
        v: pago ? Number(pago.monto) : "-",
        t: pago ? "n" : "s",
        s: pago ? styles.cellMonedaNegrita : styles.cellNegritaDerecha,
      },
      { v: Number(saldoActual), t: "n", s: styles.cellSaldo },
      { v: pagoReal ? pagoReal.operacion : "-", s: styles.cellCentro },
      { v: bancoNombre, s: styles.cellCentro },
    );

    excelData.push(rowData);
    currentRowIdx++; // 🟢 Avanzamos a la siguiente fila de Excel
  });

  // 4. Agregar el Footer (Gran Total)
  if (rows.length > 0) {
    const totalColsToSkip = tieneDetraccion ? 12 : 7;
    const footerRow = [];

    for (let i = 0; i < totalColsToSkip; i++) {
      footerRow.push({ v: "", s: styles.footerNegro });
    }

    footerRow.push({ v: "TOTALES", s: styles.footerNegro });
    footerRow.push({ v: Number(totalSaldo), t: "n", s: styles.footerDeuda });

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
    footerRow.push({ v: "", s: badgeStyle });

    excelData.push(footerRow);
  }

  // 5. Configurar libro, fusiones y anchos
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Uniones fijas de las cabeceras
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];

  if (tieneDetraccion) {
    ws["!merges"].push({ s: { r: 0, c: 7 }, e: { r: 0, c: 10 } });
    ws["!merges"].push({ s: { r: 0, c: 11 }, e: { r: 0, c: 15 } });
  } else {
    ws["!merges"].push({ s: { r: 0, c: 7 }, e: { r: 0, c: 11 } });
  }

  // 🟢 INYECTAMOS LAS UNIONES VERTICALES CALCULADAS EN EL BUCLE
  ws["!merges"].push(...dynamicMerges);

  if (rows.length > 0) {
    const lastRowIndex = excelData.length - 1;
    const mergeEndCol = tieneDetraccion ? 10 : 6;
    const statusColStart = tieneDetraccion ? 14 : 10;

    ws["!merges"].push({
      s: { r: lastRowIndex, c: 0 },
      e: { r: lastRowIndex, c: mergeEndCol },
    });
    ws["!merges"].push({
      s: { r: lastRowIndex, c: statusColStart },
      e: { r: lastRowIndex, c: statusColStart + 1 },
    });
  }

  const colsConfig = [
    { wch: 12 },
    { wch: 14 },
    { wch: 15 },
    { wch: 30 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
  ];
  if (tieneDetraccion) {
    colsConfig.push({ wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 12 });
  }
  colsConfig.push(
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
  );

  ws["!cols"] = colsConfig;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Estado de Cuenta");

  const fileName = `Estado_Cuenta_${proveedorNombre?.replace(/\s+/g, "_") || "Proveedor"}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
