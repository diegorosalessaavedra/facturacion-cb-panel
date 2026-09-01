import * as XLSX from "xlsx-js-style";
import formatDate from "../../hooks/FormatDate";

// --- CONSTANTES DE BILLETES Y MONEDAS ---
const BILLETES = [
  { key: "billete_200", label: "200.00" },
  { key: "billete_100", label: "100.00" },
  { key: "billete_50", label: "50.00" },
  { key: "billete_20", label: "20.00" },
  { key: "billete_10", label: "10.00" },
];

const MONEDAS = [
  { key: "moneda_5", label: "5.00" },
  { key: "moneda_2", label: "2.00" },
  { key: "moneda_1", label: "1.00" },
  { key: "moneda_05", label: "0.50" },
  { key: "moneda_02", label: "0.20" },
  { key: "moneda_01", label: "0.10" },
];

// --- ESTILOS PARA LAS CELDAS ---
const STYLES = {
  TITLE: {
    font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "0F172A" } }, // slate-900
  },
  HEADER_DARK: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "0F172A" } }, // slate-900
    border: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  HEADER_AMBER: {
    font: { bold: true, sz: 10, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "FBBF24" } }, // amber-400
    border: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  HEADER_PURPLE: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "581C87" } }, // purple-900
    border: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  HEADER_SUB_DARK: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "1E293B" } }, // slate-800
    border: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  HEADER_SUB_PURPLE: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "6B21A8" } }, // purple-800
    border: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  CELL_DATA: {
    font: { sz: 10, color: { rgb: "334155" } }, // slate-700
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  CELL_DATA_LEFT: {
    font: { sz: 10, color: { rgb: "334155" } },
    alignment: { horizontal: "left", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  CELL_TOTAL: {
    font: { bold: true, sz: 10, color: { rgb: "1D4ED8" } }, // blue-700
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "F1F5F9" } }, // slate-100
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  CELL_YAPE: {
    font: { bold: true, sz: 10, color: { rgb: "7E22CE" } }, // purple-700
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "FAF5FF" } }, // purple-50
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  CELL_SUCCESS: {
    font: { bold: true, sz: 10, color: { rgb: "16A34A" } }, // green-600
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  CELL_DANGER: {
    font: { bold: true, sz: 10, color: { rgb: "EF4444" } }, // red-500
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
};

const formatMoneda = '"S/" #,##0.00';
const formatCantidad = "#,##0";

const ExcelReporteDesembolsos = {
  exportToExcel(desembolsos) {
    try {
      if (!Array.isArray(desembolsos) || desembolsos.length === 0) {
        throw new Error("No hay datos de desembolsos para exportar");
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([]);

      // 1. FILA DE TÍTULO PRINCIPAL
      XLSX.utils.sheet_add_aoa(ws, [["REPORTE DE DESEMBOLSOS"]], {
        origin: "A1",
      });
      ws["A1"].s = STYLES.TITLE;

      // 2. CONFIGURACIÓN DE CABECERAS Y MERGES (Filas 2 y 3)
      const headerRow1 = [
        { v: "N°", s: STYLES.HEADER_DARK },
        { v: "DESEMBOLSO", s: STYLES.HEADER_DARK },
        { v: "FECHA DE DESEMBOLSO", s: STYLES.HEADER_DARK },
        { v: "FECHA RENDIDA", s: STYLES.HEADER_AMBER },
        { v: "DÍAS EN RENDIR", s: STYLES.HEADER_AMBER },
        { v: "IMPORTE", s: STYLES.HEADER_DARK },
        { v: "CONCEPTO DE RENDICIÓN", s: STYLES.HEADER_DARK },
        { v: "RUTAS", s: STYLES.HEADER_DARK },
        { v: "BILLETERA DIGITAL", s: STYLES.HEADER_PURPLE },
        { v: "BILLETES", s: STYLES.HEADER_DARK },
        ...Array(4).fill({ v: "", s: STYLES.HEADER_DARK }), // Espacios para merge de Billetes
        { v: "MONEDAS", s: STYLES.HEADER_DARK },
        ...Array(5).fill({ v: "", s: STYLES.HEADER_DARK }), // Espacios para merge de Monedas
        { v: "ESTADO DE DESEMBOLSO", s: STYLES.HEADER_DARK },
        { v: "Nº CORRELATIVO", s: STYLES.HEADER_DARK },
        { v: "OBSERVACIONES", s: STYLES.HEADER_DARK },
      ];

      const headerRow2 = [
        { v: "", s: STYLES.HEADER_DARK }, // N°
        { v: "", s: STYLES.HEADER_DARK }, // Desembolso
        { v: "", s: STYLES.HEADER_DARK }, // Fecha Desembolso
        { v: "", s: STYLES.HEADER_AMBER }, // Fecha Rendida
        { v: "", s: STYLES.HEADER_AMBER }, // Dias en rendir
        { v: "", s: STYLES.HEADER_DARK }, // Importe
        { v: "", s: STYLES.HEADER_DARK }, // Concepto
        { v: "", s: STYLES.HEADER_DARK }, // Rutas
        { v: "YAPE", s: STYLES.HEADER_SUB_PURPLE }, // Yape
        ...BILLETES.map((b) => ({
          v: `S/ ${b.label}`,
          s: STYLES.HEADER_SUB_DARK,
        })), // Billetes
        ...MONEDAS.map((m) => ({
          v: `S/ ${m.label}`,
          s: STYLES.HEADER_SUB_DARK,
        })), // Monedas
        { v: "", s: STYLES.HEADER_DARK }, // Estado
        { v: "", s: STYLES.HEADER_DARK }, // N° Correlativo
        { v: "", s: STYLES.HEADER_DARK }, // Observaciones
      ];

      XLSX.utils.sheet_add_aoa(ws, [headerRow1, headerRow2], { origin: "A2" });

      // Configurar las combinaciones de celdas (Merges)
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 22 } }, // Titulo (A1:W1)
        { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } }, // N°
        { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } }, // DESEMBOLSO
        { s: { r: 1, c: 2 }, e: { r: 2, c: 2 } }, // FECHA DESEMBOLSO
        { s: { r: 1, c: 3 }, e: { r: 2, c: 3 } }, // FECHA RENDIDA
        { s: { r: 1, c: 4 }, e: { r: 2, c: 4 } }, // DIAS EN RENDIR
        { s: { r: 1, c: 5 }, e: { r: 2, c: 5 } }, // IMPORTE
        { s: { r: 1, c: 6 }, e: { r: 2, c: 6 } }, // CONCEPTO
        { s: { r: 1, c: 7 }, e: { r: 2, c: 7 } }, // RUTAS
        // Columna 8 es YAPE (Billetera digital). No hacemos merge vertical para que luzca como encabezado y subencabezado.
        { s: { r: 1, c: 9 }, e: { r: 1, c: 13 } }, // BILLETES (colspan 5)
        { s: { r: 1, c: 14 }, e: { r: 1, c: 19 } }, // MONEDAS (colspan 6)
        { s: { r: 1, c: 20 }, e: { r: 2, c: 20 } }, // ESTADO
        { s: { r: 1, c: 21 }, e: { r: 2, c: 21 } }, // CORRELATIVO
        { s: { r: 1, c: 22 }, e: { r: 2, c: 22 } }, // OBSERVACIONES
      ];

      // 3. AGREGAR LOS DATOS (Fila 4 en adelante)
      const dataRows = desembolsos.map((item, index) => {
        // En desembolsos la data está en "egresos" en lugar de "ingresos"
        const yapeMonto = item.egresos?.yape > 0 ? item.egresos.yape : 0;

        // Calcular correlativo
        const correlativo =
          item.rendicion?.correlativo_rendicion ||
          item.rendiciones_multiples?.[0]?.correlativo_rendicion ||
          (item.estado_desembolso === "RENDIDO" ? "NO APLICA" : "-");

        // Estilo condicional para el estado
        const estadoStyle =
          item.estado_desembolso === "RENDIDO"
            ? STYLES.CELL_SUCCESS
            : STYLES.CELL_DANGER;

        const rowData = [
          { v: index + 1, t: "n", s: STYLES.CELL_DATA },
          {
            v: item.trabajador?.nombre_trabajador || "N/A",
            t: "s",
            s: STYLES.CELL_DATA_LEFT,
          },
          {
            v: formatDate(item.fecha_desembolso) || "--/--/--",
            t: "s",
            s: STYLES.CELL_DATA,
          },
          {
            v: formatDate(item.fecha_rendida) || "--/--/--",
            t: "s",
            s: STYLES.CELL_DATA,
          },
          {
            v: item.demora_dias ? `${item.demora_dias} días` : "-",
            t: "s",
            s: STYLES.CELL_DATA,
          },
          {
            v: Number(item.importe_desembolso || 0),
            t: "n",
            s: { ...STYLES.CELL_TOTAL, numFmt: formatMoneda },
          },
          {
            v: item.motivo_desembolso || "APERTURA",
            t: "s",
            s: STYLES.CELL_DATA,
          },
          { v: item.rutas_desembolso || "-", t: "s", s: STYLES.CELL_DATA },

          // YAPE
          {
            v: Number(yapeMonto),
            t: "n",
            s:
              yapeMonto > 0
                ? { ...STYLES.CELL_YAPE, numFmt: formatMoneda }
                : STYLES.CELL_YAPE,
          },

          // BILLETES (Egresos)
          ...BILLETES.map((b) => ({
            v: Number(item.egresos?.[b.key] || 0),
            t: "n",
            s: { ...STYLES.CELL_DATA, numFmt: formatCantidad },
          })),

          // MONEDAS (Egresos)
          ...MONEDAS.map((m) => ({
            v: Number(item.egresos?.[m.key] || 0),
            t: "n",
            s: { ...STYLES.CELL_DATA, numFmt: formatCantidad },
          })),

          // RESTO
          { v: item.estado_desembolso || "", t: "s", s: estadoStyle },
          { v: correlativo, t: "s", s: STYLES.CELL_DATA },
          { v: item.observaciones || "-", t: "s", s: STYLES.CELL_DATA_LEFT },
        ];

        return rowData;
      });

      XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

      // 4. CONFIGURAR ANCHO DE COLUMNAS
      ws["!cols"] = [
        { wch: 6 }, // N°
        { wch: 30 }, // DESEMBOLSO
        { wch: 18 }, // FECHA DESEMBOLSO
        { wch: 18 }, // FECHA RENDIDA
        { wch: 15 }, // DIAS EN RENDIR
        { wch: 15 }, // IMPORTE
        { wch: 20 }, // CONCEPTO
        { wch: 25 }, // RUTAS
        { wch: 15 }, // YAPE
        // Billetes (5)
        { wch: 9 },
        { wch: 9 },
        { wch: 9 },
        { wch: 9 },
        { wch: 9 },
        // Monedas (6)
        { wch: 9 },
        { wch: 9 },
        { wch: 9 },
        { wch: 9 },
        { wch: 9 },
        { wch: 9 },
        { wch: 18 }, // ESTADO
        { wch: 18 }, // N° CORRELATIVO
        { wch: 35 }, // OBSERVACIONES
      ];

      // 5. GENERAR Y DESCARGAR ARCHIVO
      XLSX.utils.book_append_sheet(wb, ws, "Desembolsos");

      const fechaActual = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `Reporte_Desembolsos_${fechaActual}.xlsx`);

      return true;
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      throw error;
    }
  },
};

export default ExcelReporteDesembolsos;
