import * as XLSX from "xlsx-js-style";
import formatDate from "../hooks/FormatDate";

const ExcelReporteOrdenesCompra = {
  createColumnDefinitions() {
    const columns = [
      { header: "#", key: "numero", width: 5 },
      { header: "Fecha Emisión", key: "fechaEmision", width: 15 },
      { header: "Fecha Vencimiento", key: "fechaVencimiento", width: 15 },
      { header: "Proveedor", key: "proveedor", width: 30 },
      { header: "Banco", key: "banco", width: 20 },
      { header: "Nro Cuenta", key: "nroCuenta", width: 15 },
      { header: "Forma de Pago", key: "formaPago", width: 15 },
      { header: "Estado de Pago", key: "estadoPago", width: 15 },
      { header: "Moneda", key: "moneda", width: 12 },
      { header: "Total", key: "total", width: 15 },
      { header: "Saldo", key: "saldo", width: 15 },
    ];

    return columns;
  },

  transformData(ordenesCompra) {
    return ordenesCompra.map((ordenCompra, index) => ({
      numero: index + 1,
      fechaEmision: formatDate(ordenCompra.fechaEmision),
      fechaVencimiento: formatDate(ordenCompra.fechaVencimiento),
      proveedor:
        ordenCompra.proveedor?.nombreApellidos ||
        ordenCompra.proveedor?.nombreComercial ||
        "",
      banco: ordenCompra.banco_beneficiario || "-",
      nroCuenta: ordenCompra.nro_cuenta_bco || "-",
      formaPago: ordenCompra.formaPago || "",
      estadoPago: ordenCompra.estadoPago || "",
      moneda: ordenCompra.moneda || "",
      // Convertir a número para que sea sumable en Excel
      total: parseFloat(ordenCompra.saldoInicial) || 0,
      saldo: parseFloat(ordenCompra.saldo) || 0,
    }));
  },

  configureWorksheet(worksheet, columns, fechaInicio, fechaFinal) {
    // Título del reporte
    const titleRow = [
      [`REPORTE DE ÓRDENES DE COMPRA ${fechaInicio} a ${fechaFinal}`],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: "A1" });

    // Configurar ancho de columnas
    const colWidths = columns.map((col) => ({ width: col.width }));
    worksheet["!cols"] = colWidths;

    // Estilo del título
    if (worksheet["A1"]) {
      worksheet["A1"].s = {
        font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "000000" } },
        border: {
          top: { style: "thin", color: { rgb: "FFFFFF" } },
          bottom: { style: "thin", color: { rgb: "FFFFFF" } },
          left: { style: "thin", color: { rgb: "FFFFFF" } },
          right: { style: "thin", color: { rgb: "FFFFFF" } },
        },
      };
    }

    // Merge del título
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    ];

    return worksheet;
  },

  // Nueva función para agregar fila de totales
  addTotalRow(worksheet, data, columns) {
    const totalRowIndex = data.length + 2; // +2 por título y headers
    const currencyColumns = ["total", "saldo"];

    columns.forEach((col, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({
        r: totalRowIndex,
        c: colIndex,
      });

      if (col.key === "numero") {
        // En la primera columna poner "TOTAL"
        worksheet[cellAddress] = {
          v: "TOTAL",
          t: "s",
          s: {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "333333" } },
            border: {
              top: { style: "medium", color: { rgb: "000000" } },
              bottom: { style: "medium", color: { rgb: "000000" } },
              left: { style: "medium", color: { rgb: "000000" } },
              right: { style: "medium", color: { rgb: "000000" } },
            },
          },
        };
      } else if (currencyColumns.includes(col.key)) {
        // Para columnas numéricas, crear fórmula SUM
        const startRow = 3; // Primera fila de datos (después de título y headers)
        const endRow = data.length + 2; // Última fila de datos
        const columnLetter = XLSX.utils.encode_col(colIndex);
        const formula = `SUM(${columnLetter}${startRow}:${columnLetter}${endRow})`;

        worksheet[cellAddress] = {
          f: formula,
          t: "n",
          s: {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            numFmt: '"S/. "#,##0.00',
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "333333" } },
            border: {
              top: { style: "medium", color: { rgb: "000000" } },
              bottom: { style: "medium", color: { rgb: "000000" } },
              left: { style: "medium", color: { rgb: "000000" } },
              right: { style: "medium", color: { rgb: "000000" } },
            },
          },
        };
      } else {
        // Para otras columnas, celda vacía con estilo
        worksheet[cellAddress] = {
          v: "",
          t: "s",
          s: {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "333333" } },
            border: {
              top: { style: "medium", color: { rgb: "000000" } },
              bottom: { style: "medium", color: { rgb: "000000" } },
              left: { style: "medium", color: { rgb: "000000" } },
              right: { style: "medium", color: { rgb: "000000" } },
            },
          },
        };
      }
    });
  },

  styleHeaders(worksheet, columns) {
    // Aplicar estilo a los headers (fila 2)
    columns.forEach((col, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "000000" } },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    });
  },

  applyCurrencyFormat(worksheet, data, columns) {
    const currencyColumns = ["total", "saldo"];

    data.forEach((row, rowIndex) => {
      columns.forEach((col, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex + 2, // +2 porque empezamos en la fila 3 (título + headers)
          c: colIndex,
        });

        if (worksheet[cellAddress]) {
          if (currencyColumns.includes(col.key)) {
            // Para columnas de moneda: aplicar formato numérico y bordes
            worksheet[cellAddress].s = {
              numFmt: '"S/. "#,##0.00',
              border: {
                top: { style: "thin", color: { rgb: "CCCCCC" } },
                bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                left: { style: "thin", color: { rgb: "CCCCCC" } },
                right: { style: "thin", color: { rgb: "CCCCCC" } },
              },
            };
            // Asegurar que el valor sea numérico
            const numericValue = parseFloat(worksheet[cellAddress].v);
            if (!isNaN(numericValue)) {
              worksheet[cellAddress].v = numericValue;
              worksheet[cellAddress].t = "n"; // Tipo numérico
            }
          } else {
            // Aplicar bordes a las demás celdas
            worksheet[cellAddress].s = {
              border: {
                top: { style: "thin", color: { rgb: "CCCCCC" } },
                bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                left: { style: "thin", color: { rgb: "CCCCCC" } },
                right: { style: "thin", color: { rgb: "CCCCCC" } },
              },
            };
          }
        }
      });
    });

    // Agregar fila de totales
    this.addTotalRow(worksheet, data, columns);
  },

  exportToExcel(
    ordenesCompra,
    fechaInicio,
    fechaFinal,
    formatDate,
    formatNumber
  ) {
    try {
      if (!Array.isArray(ordenesCompra) || ordenesCompra.length === 0) {
        throw new Error("No hay datos para exportar");
      }

      const columns = this.createColumnDefinitions();

      // Crear worksheet vacío
      const worksheet = XLSX.utils.aoa_to_sheet([[]]);

      // Configurar worksheet con título
      this.configureWorksheet(worksheet, columns, fechaInicio, fechaFinal);

      // Transformar datos
      const data = this.transformData(ordenesCompra, formatDate, formatNumber);

      // Crear matriz de datos
      const matrixData = data.map((item) =>
        columns.map((col) => item[col.key] ?? "")
      );

      // Agregar headers y datos
      const headers = columns.map((col) => col.header);
      XLSX.utils.sheet_add_aoa(worksheet, [headers, ...matrixData], {
        origin: "A2", // Empezar en A2 porque A1 es el título
        cellStyles: true,
      });

      // Aplicar estilos
      this.styleHeaders(worksheet, columns);
      this.applyCurrencyFormat(worksheet, data, columns);

      // Crear workbook y agregar worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Órdenes de Compra");

      // Generar nombre de archivo
      const fileName = `ordenes_compra_${fechaInicio}_a_${fechaFinal}.xlsx`
        .replace(/[\/\?<>\\:\*\|"]/g, "_")
        .replace(/\s+/g, "_");

      // Exportar archivo
      XLSX.writeFile(workbook, fileName);
      return true;
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      throw error;
    }
  },
};

export default ExcelReporteOrdenesCompra;
