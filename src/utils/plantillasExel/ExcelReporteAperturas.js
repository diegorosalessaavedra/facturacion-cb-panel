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
    fill: { fgColor: { rgb: "F8FAFC" } }, // slate-50
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
};

const formatMoneda = '"S/" #,##0.00';
const formatCantidad = "#,##0";

const ExcelReporteAperturas = {
  exportToExcel(aperturas) {
    try {
      if (!Array.isArray(aperturas) || aperturas.length === 0) {
        throw new Error("No hay datos de aperturas para exportar");
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([]);

      // 1. FILA DE TÍTULO PRINCIPAL
      XLSX.utils.sheet_add_aoa(ws, [["REPORTE DE APERTURAS DE CAJA"]], {
        origin: "A1",
      });
      ws["A1"].s = STYLES.TITLE;

      // 2. CONFIGURACIÓN DE CABECERAS Y MERGES (Filas 2 y 3)
      const headerRow1 = [
        { v: "N°", s: STYLES.HEADER_DARK },
        { v: "DISPONE CAJA", s: STYLES.HEADER_DARK },
        { v: "FECHA QUE DISPONE", s: STYLES.HEADER_DARK },
        { v: "IMPORTE", s: STYLES.HEADER_DARK },
        { v: "MOTIVO DE APERTURA", s: STYLES.HEADER_DARK },
        { v: "BILLETERA DIGITAL", s: STYLES.HEADER_PURPLE },
        { v: "BILLETES", s: STYLES.HEADER_DARK },
        ...Array(4).fill({ v: "", s: STYLES.HEADER_DARK }), // Espacios para merge de Billetes
        { v: "MONEDAS", s: STYLES.HEADER_DARK },
        ...Array(5).fill({ v: "", s: STYLES.HEADER_DARK }), // Espacios para merge de Monedas
        { v: "ESTADO DE APERTURA", s: STYLES.HEADER_DARK },
        { v: "OBSERVACIONES", s: STYLES.HEADER_DARK },
      ];

      const headerRow2 = [
        { v: "", s: STYLES.HEADER_DARK }, // N°
        { v: "", s: STYLES.HEADER_DARK }, // Dispone Caja
        { v: "", s: STYLES.HEADER_DARK }, // Fecha
        { v: "", s: STYLES.HEADER_DARK }, // Importe
        { v: "", s: STYLES.HEADER_DARK }, // Motivo
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
        { v: "", s: STYLES.HEADER_DARK }, // Observaciones
      ];

      XLSX.utils.sheet_add_aoa(ws, [headerRow1, headerRow2], { origin: "A2" });

      // Configurar las combinaciones de celdas (Merges)
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 18 } }, // Titulo (A1:S1)
        { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } }, // N°
        { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } }, // DISPONE CAJA
        { s: { r: 1, c: 2 }, e: { r: 2, c: 2 } }, // FECHA
        { s: { r: 1, c: 3 }, e: { r: 2, c: 3 } }, // IMPORTE
        { s: { r: 1, c: 4 }, e: { r: 2, c: 4 } }, // MOTIVO
        { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } }, // BILLETES (colspan 5)
        { s: { r: 1, c: 11 }, e: { r: 1, c: 16 } }, // MONEDAS (colspan 6)
        { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } }, // ESTADO
        { s: { r: 1, c: 18 }, e: { r: 2, c: 18 } }, // OBSERVACIONES
      ];

      // 3. AGREGAR LOS DATOS (Fila 4 en adelante)
      const dataRows = aperturas.map((item, index) => {
        const yapeMonto = item.ingresos?.yape > 0 ? item.ingresos.yape : 0;

        const rowData = [
          { v: index + 1, t: "n", s: STYLES.CELL_DATA },
          {
            v: item.trabajador?.nombre_trabajador || "N/A",
            t: "s",
            s: STYLES.CELL_DATA_LEFT,
          },
          {
            v: formatDate(item.fecha_dispone) || "--/--/--",
            t: "s",
            s: STYLES.CELL_DATA,
          },
          {
            v: Number(item.importe_apertura || 0),
            t: "n",
            s: { ...STYLES.CELL_TOTAL, numFmt: formatMoneda },
          },
          {
            v: item.motivo_apertura || "APERTURA",
            t: "s",
            s: STYLES.CELL_DATA,
          },

          // YAPE
          {
            v: Number(yapeMonto),
            t: "n",
            s:
              yapeMonto > 0
                ? { ...STYLES.CELL_YAPE, numFmt: formatMoneda }
                : STYLES.CELL_YAPE,
          },

          // BILLETES
          ...BILLETES.map((b) => ({
            v: Number(item.ingresos?.[b.key] || 0),
            t: "n",
            s: { ...STYLES.CELL_DATA, numFmt: formatCantidad },
          })),

          // MONEDAS
          ...MONEDAS.map((m) => ({
            v: Number(item.ingresos?.[m.key] || 0),
            t: "n",
            s: { ...STYLES.CELL_DATA, numFmt: formatCantidad },
          })),

          {
            v: item.estado_apertura || "",
            t: "s",
            s: { ...STYLES.CELL_DATA, font: { bold: true, sz: 10 } },
          },
          { v: item.observaciones || "", t: "s", s: STYLES.CELL_DATA_LEFT },
        ];

        return rowData;
      });

      XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

      // 4. CONFIGURAR ANCHO DE COLUMNAS
      ws["!cols"] = [
        { wch: 6 }, // N°
        { wch: 30 }, // DISPONE CAJA
        { wch: 18 }, // FECHA
        { wch: 15 }, // IMPORTE
        { wch: 20 }, // MOTIVO
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
        { wch: 35 }, // OBSERVACIONES
      ];

      // 5. GENERAR Y DESCARGAR ARCHIVO
      XLSX.utils.book_append_sheet(wb, ws, "Aperturas de Caja");

      const fechaActual = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `Reporte_Aperturas_${fechaActual}.xlsx`);

      return true;
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      throw error;
    }
  },
};

export default ExcelReporteAperturas;
