import * as XLSX from "xlsx-js-style";
import formatDate from "../../hooks/FormatDate";
// IMPORTANTE: Ajusta esta ruta si es necesario
// import { numberPeru } from "../../assets/onInputs";

export const generarExcelRendiciones = (
  rendiciones,
  totalGeneralGastos,
  fechaInicio,
  fechaFin,
) => {
  // ==========================================
  // 1. DEFINICIÓN DE ESTILOS SENIOR
  // ==========================================
  const titleStyle = {
    font: { bold: true, color: { rgb: "0F172A" }, sz: 16 }, // slate-900
    alignment: { horizontal: "center", vertical: "center" },
  };

  const subtitleStyle = {
    font: { bold: true, color: { rgb: "475569" }, sz: 11 }, // slate-600
    alignment: { horizontal: "center", vertical: "center" },
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
    fill: { fgColor: { rgb: "0F172A" } }, // slate-900
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  };

  const cellStyle = {
    font: { sz: 10, color: { rgb: "334155" } },
    fill: { fgColor: { rgb: "F8FAFC" } }, // Gris muy suave
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "E2E8F0" } },
      bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      left: { style: "thin", color: { rgb: "E2E8F0" } },
      right: { style: "thin", color: { rgb: "E2E8F0" } },
    },
  };

  const moneyStyle = { ...cellStyle, numFmt: '"S/"#,##0.00' };

  // Formatear fechas para el subtítulo
  const textoFechas = `Desde: ${formatDate(fechaInicio) || "-"} Hasta: ${formatDate(fechaFin) || "-"}`;

  // ==========================================
  // 2. CONSTRUCCIÓN DE LA CABECERA (19 Cols)
  // ==========================================
  const wsData = [
    [{ v: "HISTÓRICO DE RENDICIONES", s: titleStyle }],
    [{ v: textoFechas, s: subtitleStyle }],
    [], // Fila en blanco
    [
      { v: "N°", s: headerStyle },
      { v: "CORRELATIVO", s: headerStyle },
      { v: "TRABAJADOR", s: headerStyle },
      { v: "ÁREA", s: headerStyle },
      { v: "CONCEPTO", s: headerStyle },
      { v: "RUTAS", s: headerStyle },
      { v: "MONTO RECIBIDO", s: headerStyle },
      { v: "FECHA RECIBIDA", s: headerStyle },
      { v: "FECHA DE USO DE DINERO", s: headerStyle },
      { v: "RAZÓN SOCIAL DEL PROVEEDOR", s: headerStyle },
      { v: "RUC PROVEEDOR", s: headerStyle },
      { v: "COMPROBANTE", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "CATEGORIA DEL GASTO", s: headerStyle },
      { v: "DETALLE DEL GASTO", s: headerStyle },
      { v: "IMPORTE S/", s: headerStyle },
      { v: "ESTADO", s: headerStyle }, // Columna 17
      { v: "RESULTADO", s: headerStyle }, // Columna 18
    ],
    [
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "FECHA DE EMISIÓN", s: headerStyle },
      { v: "TIPO COMPROB.", s: headerStyle },
      { v: "NÚMERO COMP.", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle },
      { v: "", s: headerStyle }, // ESTADO abajo
      { v: "", s: headerStyle }, // RESULTADO abajo
    ],
  ];

  // Combinaciones base (Cabeceras)
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 18 } }, // Título
    { s: { r: 1, c: 0 }, e: { r: 1, c: 18 } }, // Subtítulo
    { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
    { s: { r: 3, c: 1 }, e: { r: 4, c: 1 } },
    { s: { r: 3, c: 2 }, e: { r: 4, c: 2 } },
    { s: { r: 3, c: 3 }, e: { r: 4, c: 3 } },
    { s: { r: 3, c: 4 }, e: { r: 4, c: 4 } },
    { s: { r: 3, c: 5 }, e: { r: 4, c: 5 } },
    { s: { r: 3, c: 6 }, e: { r: 4, c: 6 } },
    { s: { r: 3, c: 7 }, e: { r: 4, c: 7 } },
    { s: { r: 3, c: 8 }, e: { r: 4, c: 8 } },
    { s: { r: 3, c: 9 }, e: { r: 4, c: 9 } },
    { s: { r: 3, c: 10 }, e: { r: 4, c: 10 } },
    { s: { r: 3, c: 11 }, e: { r: 3, c: 13 } }, // COMPROBANTE colspan
    { s: { r: 3, c: 14 }, e: { r: 4, c: 14 } },
    { s: { r: 3, c: 15 }, e: { r: 4, c: 15 } },
    { s: { r: 3, c: 16 }, e: { r: 4, c: 16 } },
    { s: { r: 3, c: 17 }, e: { r: 4, c: 17 } }, // ESTADO rowspan
    { s: { r: 3, c: 18 }, e: { r: 4, c: 18 } }, // RESULTADO rowspan
  ];

  let currentRow = 5;

  // ==========================================
  // 3. LLENADO DE DATOS Y MERGES DINÁMICOS
  // ==========================================
  rendiciones.forEach((item, index) => {
    const detalles = item.datos_rendicion || [];
    const filasOcupadas = detalles.length > 0 ? detalles.length : 1;
    const startRow = currentRow;
    const elementosIterar = detalles.length > 0 ? detalles : [{}];

    // Lógica inteligente para el Resultado (Permite cálculos en Excel)
    let valResultado = "Completo";
    let tipoResultado = "s";
    let estiloResultado = {
      ...cellStyle,
      font: { bold: true, color: { rgb: "059669" } },
    };

    if (item.por_devolver > 0) {
      valResultado = Number(item.por_devolver);
      tipoResultado = "n";
      estiloResultado = {
        ...cellStyle,
        numFmt: '"A devolver S/"#,##0.00',
        font: { bold: true, color: { rgb: "DC2626" } }, // Rojo
      };
    } else if (item.por_reembolsar > 0) {
      valResultado = Number(item.por_reembolsar);
      tipoResultado = "n";
      estiloResultado = {
        ...cellStyle,
        numFmt: '"Por reembolsar S/"#,##0.00',
        font: { bold: true, color: { rgb: "2563EB" } }, // Azul
      };
    }

    elementosIterar.forEach((detalle, dIndex) => {
      const isFirst = dIndex === 0;

      wsData.push([
        { v: isFirst ? index + 1 : "", s: cellStyle },
        { v: isFirst ? item.correlativo_rendicion || "-" : "", s: cellStyle },
        {
          v: isFirst ? item.trabajador?.nombre_trabajador || "-" : "",
          s: cellStyle,
        },
        { v: isFirst ? item.area_rendicion || "-" : "", s: cellStyle },
        { v: isFirst ? item.concepto_rendicion || "-" : "", s: cellStyle },
        {
          v: isFirst ? item.desembolso?.rutas_desembolso || "-" : "",
          s: cellStyle,
        },
        {
          v: isFirst ? Number(item.monto_recibido || 0) : "",
          t: isFirst ? "n" : "s",
          s: isFirst ? moneyStyle : cellStyle,
        },
        {
          v: isFirst ? formatDate(item.fecha_recibida) || "-" : "",
          s: cellStyle,
        },
        { v: formatDate(detalle.fecha_uso) || "-", s: cellStyle },
        { v: detalle.razon_social || "-", s: cellStyle },
        { v: detalle.ruc || "-", s: cellStyle },
        { v: formatDate(detalle.fecha_emision) || "-", s: cellStyle },
        { v: detalle.tipo_comprobante || "-", s: cellStyle },
        { v: detalle.numero_comprobante || "-", s: cellStyle },
        { v: detalle.categoria || "-", s: cellStyle },
        { v: detalle.detalle || "-", s: cellStyle },
        { v: Number(detalle.importe || 0), t: "n", s: moneyStyle },
        // ESTADO y RESULTADO
        { v: isFirst ? item.estado || "-" : "", s: cellStyle },
        {
          v: isFirst ? valResultado : "",
          t: isFirst ? tipoResultado : "s",
          s: isFirst ? estiloResultado : cellStyle,
        },
      ]);
      currentRow++;
    });

    // 💡 AQUI ESTÁ LA MAGIA DE LA COMBINACIÓN (MERGE)
    if (filasOcupadas > 1) {
      // 1. Unimos las primeras 8 columnas (0 al 7)
      for (let col = 0; col <= 7; col++) {
        merges.push({
          s: { r: startRow, c: col },
          e: { r: currentRow - 1, c: col },
        });
      }
      // 2. Unimos ESTADO (17) y RESULTADO (18)
      merges.push({
        s: { r: startRow, c: 17 },
        e: { r: currentRow - 1, c: 17 },
      });
      merges.push({
        s: { r: startRow, c: 18 },
        e: { r: currentRow - 1, c: 18 },
      });
    }
  });

  // ==========================================
  // 4. FILA DE TOTALES AUTOMÁTICA
  // ==========================================
  // Creamos una fila vacía de 19 celdas y solo llenamos las que nos importan
  const filaTotales = Array(19).fill({ v: "", s: cellStyle });
  filaTotales[15] = {
    v: "TOTAL GASTOS:",
    s: { ...headerStyle, fill: { fgColor: { rgb: "0F172A" } } },
  };
  filaTotales[16] = {
    v: totalGeneralGastos,
    t: "n",
    s: { ...moneyStyle, font: { bold: true } },
  };

  wsData.push(filaTotales);

  // ==========================================
  // 5. RENDERIZADO FINAL DEL EXCEL
  // ==========================================
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!merges"] = merges;

  // Anchos de las 19 columnas
  ws["!cols"] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rendiciones");

  const nombreArchivo = `Rendiciones_${fechaInicio}_al_${fechaFin}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
};
