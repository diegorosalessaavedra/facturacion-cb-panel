import * as XLSX from "xlsx-js-style";
import { formatWithLeadingZeros } from "../../assets/formats";
import formatDate from "../../hooks/FormatDate";

export const descargarExcelProveedor = (rows, totalSaldo, proveedorNombre) => {
  // Formato nativo de Excel para Soles
  const formatoSoles = '"S/"#,##0.00';

  // 1. Definir los estilos (Colores basados en tu UI)
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
    cellCentro: {
      alignment: { horizontal: "center", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "E2E8F0" } } },
    },

    // --- ESTILOS NUEVOS CON FORMATO DE MONEDA ---
    cellMoneda: {
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "E2E8F0" } } },
      numFmt: formatoSoles, // Formato S/
    },
    cellMonedaNegrita: {
      font: { bold: true },
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "CBD5E1" } } },
      numFmt: formatoSoles, // Formato S/
    },
    cellSaldo: {
      fill: { fgColor: { rgb: "FEF2F2" } },
      font: { bold: true, color: { rgb: "DC2626" } },
      alignment: { horizontal: "right", vertical: "top" },
      border: { right: { style: "thin", color: { rgb: "CBD5E1" } } },
      numFmt: formatoSoles, // Formato S/
    },

    footerRojo: {
      fill: { fgColor: { rgb: "DC2626" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "EF4444" } },
        top: { style: "medium", color: { rgb: "B91C1C" } },
      },
    },
    footerDeuda: {
      fill: { fgColor: { rgb: "DC2626" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
      alignment: { horizontal: "right", vertical: "center" },
      border: {
        right: { style: "thin", color: { rgb: "EF4444" } },
        top: { style: "medium", color: { rgb: "B91C1C" } },
      },
      numFmt: formatoSoles, // Formato S/ en el footer
    },
    footerCentro: {
      fill: { fgColor: { rgb: "DC2626" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "medium", color: { rgb: "B91C1C" } } },
    },
  };

  // 2. Construir los datos hoja (Matriz de arreglos)
  const excelData = [];

  // Fila 1: Cabeceras Principales
  excelData.push([
    { v: "DETALLE DE ENVÍO", s: styles.headerAzul },
    "",
    "",
    "",
    "",
    "",
    "",
    { v: "DETRACCIONES", s: styles.headerAmbar },
    "",
    "",
    { v: "DETALLE DE PAGO", s: styles.headerVerde },
    "",
    "",
    "",
    "",
  ]);

  // Fila 2: Subcabeceras
  excelData.push([
    { v: "Fecha", s: styles.subHeaderAzul },
    { v: "SOLPED", s: styles.subHeaderAzul },
    { v: "Serie Correlativo", s: styles.subHeaderAzul },
    { v: "Descripción", s: styles.subHeaderAzul },
    { v: "Cant.", s: styles.subHeaderAzul },
    { v: "P.U", s: styles.subHeaderAzul },
    { v: "Total", s: styles.subHeaderAzul },
    { v: "Cód Dr", s: styles.subHeaderAmbar },
    { v: "Fecha Dr", s: styles.subHeaderAmbar },
    { v: "12%", s: styles.subHeaderAmbar },
    { v: "Fecha Pago", s: styles.subHeaderVerde },
    { v: "Monto", s: styles.subHeaderVerde },
    { v: "Saldo", s: styles.subHeaderVerde },
    { v: "Operación", s: styles.subHeaderVerde },
    { v: "Banco", s: styles.subHeaderVerde },
  ]);

  // 3. Llenar el cuerpo con los datos
  rows.forEach((row) => {
    const { orden, prod, pago, isFirstRow, saldoActual } = row;
    const bancoNombre =
      pago?.banco?.banco ||
      pago?.banco?.descripcion ||
      pago?.banco ||
      (isFirstRow ? orden.banco_beneficiario : "-");

    excelData.push([
      {
        v: isFirstRow ? formatDate(orden.fechaEmision) || "-" : "",
        s: styles.cellCentro,
      },
      {
        v: isFirstRow ? `COD-000${formatWithLeadingZeros(orden?.id, 3)}` : "",
        s: styles.cellCentro,
      },
      {
        v: isFirstRow ? orden.comprobante?.serie || "-" : "",
        s: styles.cellCentro,
      },
      {
        v: prod ? prod.producto?.nombre || prod.descripcion_producto : "-",
        s: styles.cellGeneral,
      },
      { v: prod ? Number(prod.cantidad) : "-", s: styles.cellCentro },

      // COLUMNAS DE DINERO: Especificamos t: "n" (tipo número) y los estilos numFmt
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

      { v: "-", s: styles.cellCentro },
      { v: "-", s: styles.cellCentro },
      { v: "-", s: styles.cellCentro },

      { v: pago ? pago.createdAt?.split("T")[0] : "-", s: styles.cellCentro },
      {
        v: pago ? Number(pago.monto) : "-",
        t: pago ? "n" : "s",
        s: pago ? styles.cellMonedaNegrita : styles.cellNegritaDerecha,
      },
      {
        v: Number(saldoActual),
        t: "n",
        s: styles.cellSaldo,
      },
      { v: pago ? pago.operacion : "-", s: styles.cellCentro },
      { v: bancoNombre, s: styles.cellCentro },
    ]);
  });

  // 4. Agregar el Footer (Totales)
  if (rows.length > 0) {
    excelData.push([
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "", s: styles.footerRojo },
      { v: "Deuda Final Total", s: styles.footerRojo },
      // TOTAL FINAL: También con t: "n"
      {
        v: Number(totalSaldo),
        t: "n",
        s: styles.footerDeuda,
      },
      {
        v: totalSaldo > 0 ? "Debe" : totalSaldo === 0 ? "Cancelado" : "A favor",
        s: styles.footerCentro,
      },
      { v: "", s: styles.footerCentro },
    ]);
  }

  // 5. Crear el libro y la hoja
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Combinar celdas de las cabeceras principales (y footer)
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // DETALLE DE ENVIO (cols 0-6)
    { s: { r: 0, c: 7 }, e: { r: 0, c: 9 } }, // DETRACCIONES (cols 7-9)
    { s: { r: 0, c: 10 }, e: { r: 0, c: 14 } }, // DETALLE DE PAGO (cols 10-14)
  ];
  if (rows.length > 0) {
    const lastRowIndex = excelData.length - 1;
    ws["!merges"].push({
      s: { r: lastRowIndex, c: 0 },
      e: { r: lastRowIndex, c: 10 },
    }); // Espacio vacío footer
    ws["!merges"].push({
      s: { r: lastRowIndex, c: 13 },
      e: { r: lastRowIndex, c: 14 },
    }); // "Debe" footer
  }

  // Ajustar anchos de columna
  ws["!cols"] = [
    { wch: 12 },
    { wch: 14 },
    { wch: 15 },
    { wch: 30 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 }, // Envío
    { wch: 10 },
    { wch: 12 },
    { wch: 12 }, // Detracciones
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 }, // Pago
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Estado de Cuenta");

  // 6. Descargar el archivo
  const fileName = `Estado_Cuenta_${proveedorNombre?.replace(/\s+/g, "_") || "Proveedor"}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
