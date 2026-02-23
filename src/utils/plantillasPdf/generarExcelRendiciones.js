import * as XLSX from "xlsx-js-style";
import formatDate from "../../hooks/FormatDate";
// IMPORTANTE: Ajusta estas dos rutas según dónde guardes este archivo

export const generarExcelRendiciones = (
  rendiciones,
  totalGeneralGastos,
  fechaInicio, // 🟢 Recibimos fecha inicio
  fechaFin, // 🟢 Recibimos fecha fin
) => {
  // 1. Definir Estilos
  const titleStyle = {
    font: { bold: true, color: { rgb: "0F172A" }, sz: 16 }, // slate-900, tamaño grande
    alignment: { horizontal: "center", vertical: "center" },
  };

  const subtitleStyle = {
    font: { bold: true, color: { rgb: "475569" }, sz: 11 }, // slate-600
    alignment: { horizontal: "center", vertical: "center" },
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
    fill: { fgColor: { rgb: "0F172A" } }, // 🟢 Cambiado a slate-900
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
    fill: { fgColor: { rgb: "F8FAFC" } }, // Gris muy suave (slate-50)
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "E2E8F0" } },
      bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      left: { style: "thin", color: { rgb: "E2E8F0" } },
      right: { style: "thin", color: { rgb: "E2E8F0" } },
    },
  };

  const moneyStyle = { ...cellStyle, numFmt: '"S/"#,##0.00' };

  // Formatear fechas para el título
  const textoFechas = `Desde: ${formatDate(fechaInicio) || "-"} Hasta: ${formatDate(fechaFin) || "-"}`;

  // 2. Crear las filas de encabezado (Nuevas filas 0 y 1 para título y subtítulo)
  const wsData = [
    // Fila 0: Título Principal
    [{ v: "HISTÓRICO DE RENDICIONES", s: titleStyle }],
    // Fila 1: Subtítulo con Fechas
    [{ v: textoFechas, s: subtitleStyle }],
    // Fila 2: Espacio en blanco para separar
    [],
    // Fila 3: Encabezados Superiores
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
    ],
    // Fila 4: Sub-encabezados de Comprobante
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
    ],
  ];

  // 🟢 Ajustamos las filas en los merges porque hemos añadido 3 filas nuevas arriba (+3 en 'r')
  const merges = [
    // Combinar fila del Título (ocupa de la columna A a la Q)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 16 } },
    // Combinar fila del Subtítulo (Fechas)
    { s: { r: 1, c: 0 }, e: { r: 1, c: 16 } },

    // Encabezados tabla (Ahora empiezan en r: 3)
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
  ];

  let currentRow = 5; // 🟢 Los datos empiezan a pintarse desde la fila 5 ahora

  // 3. Llenar los datos
  rendiciones.forEach((item, index) => {
    const detalles = item.datos_rendicion || [];
    const filasOcupadas = detalles.length > 0 ? detalles.length : 1;
    const startRow = currentRow;

    const elementosIterar = detalles.length > 0 ? detalles : [{}];

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
      ]);
      currentRow++;
    });

    if (filasOcupadas > 1) {
      for (let col = 0; col <= 7; col++) {
        merges.push({
          s: { r: startRow, c: col },
          e: { r: currentRow - 1, c: col },
        });
      }
    }
  });

  // 4. Añadir Fila de Totales
  wsData.push([
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    { v: "", s: cellStyle },
    {
      v: "TOTAL GASTOS:",
      s: { ...headerStyle, fill: { fgColor: { rgb: "0F172A" } } },
    },
    {
      v: totalGeneralGastos,
      t: "n",
      s: { ...moneyStyle, font: { bold: true } },
    },
  ]);

  // 5. Generar Hoja y Libro
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!merges"] = merges;

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
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rendiciones");

  // 6. Descargar Archivo (Le añadimos las fechas al nombre del archivo)
  const nombreArchivo = `Rendiciones_${fechaInicio}_al_${fechaFin}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
};
