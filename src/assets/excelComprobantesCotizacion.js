import * as XLSX from "xlsx-js-style";
import formatDate from "../hooks/FormatDate";

const ExcelComprobantesCotizacion = {
  createColumnDefinitions() {
    const columns = [
      { header: "#", key: "numero", width: 5 },
      { header: "Fecha Emisión", key: "fechaEmision", width: 15 },
      { header: "Vendedor", key: "vendedor", width: 20 },
      { header: "Cliente", key: "cliente", width: 35 },
      { header: "Número Documento", key: "numeroDoc", width: 15 },
      { header: "Serie", key: "serie", width: 15 },
      { header: "Tipo Comprobante", key: "tipoComprobante", width: 18 },
      { header: "T.Gravado", key: "totalGravado", width: 15 },
      { header: "T.IGV", key: "totalIgv", width: 15 },
      { header: "Total", key: "total", width: 15 },
      { header: "Saldo", key: "saldo", width: 15 },
      { header: "XML", key: "xml", width: 10 },
      { header: "CDR", key: "cdr", width: 10 },
    ];

    return columns;
  },

  transformData(comprobantes) {
    return comprobantes.map((comprobante, index) => ({
      numero: index + 1,
      fechaEmision: formatDate(comprobante.fechaEmision),
      vendedor: comprobante.vendedor || "",
      cliente:
        comprobante.cliente?.nombreApellidos ||
        comprobante.cliente?.nombreComercial ||
        "",
      numeroDoc: comprobante.cliente?.numeroDoc || "",
      serie: `${comprobante.serie}-${comprobante.numeroSerie}`,
      tipoComprobante: comprobante.tipoComprobante || "",
      // Convertir a números para que sean sumables
      totalGravado: parseFloat(comprobante.total_valor_venta) || 0,
      totalIgv: parseFloat(comprobante.total_igv) || 0,
      total: parseFloat(comprobante.total_venta) || 0,
      saldo: parseFloat(comprobante.cotizacion?.saldo) || 0,
      xml: comprobante.urlXml ? "Sí" : "No",
      cdr: comprobante.cdr ? "Sí" : "No",
    }));
  },

  configureWorksheet(worksheet, columns, fechaInicio, fechaFinal) {
    // Título del reporte
    const titleRow = [
      [`REPORTE DE COMPROBANTES DE COTIZACIÓN ${fechaInicio} a ${fechaFinal}`],
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
        fill: { fgColor: { rgb: "1f2937" } }, // Color gris oscuro similar a stone-800
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Merge del título
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    ];

    return worksheet;
  },

  styleHeaders(worksheet, columns) {
    // Aplicar estilo a los headers (fila 2) - similar al color stone-800
    columns.forEach((col, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "1f2937" } }, // Color stone-800
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          fill: { fgColor: { rgb: "f3f4f6" } }, // Fondo gris claro
          border: {
            top: { style: "thin", color: { rgb: "d1d5db" } },
            bottom: { style: "thin", color: { rgb: "d1d5db" } },
            left: { style: "thin", color: { rgb: "d1d5db" } },
            right: { style: "thin", color: { rgb: "d1d5db" } },
          },
        };
      }
    });
  },

  applyCurrencyFormat(worksheet, data, columns) {
    const currencyColumns = ["totalGravado", "totalIgv", "total", "saldo"];

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
              alignment: { horizontal: "right", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "e5e7eb" } },
                bottom: { style: "thin", color: { rgb: "e5e7eb" } },
                left: { style: "thin", color: { rgb: "e5e7eb" } },
                right: { style: "thin", color: { rgb: "e5e7eb" } },
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
            const alignment =
              col.key === "cliente" ||
              col.key === "vendedor" ||
              col.key === "tipoComprobante"
                ? { horizontal: "left", vertical: "center" }
                : { horizontal: "center", vertical: "center" };

            worksheet[cellAddress].s = {
              alignment: alignment,
              border: {
                top: { style: "thin", color: { rgb: "e5e7eb" } },
                bottom: { style: "thin", color: { rgb: "e5e7eb" } },
                left: { style: "thin", color: { rgb: "e5e7eb" } },
                right: { style: "thin", color: { rgb: "e5e7eb" } },
              },
            };
          }
        }
      });
    });

    // Agregar fila de totales
    this.addTotalRow(worksheet, data, columns);
  },

  // Función para agregar fila de totales
  addTotalRow(worksheet, data, columns) {
    const totalRowIndex = data.length + 2; // +2 por título y headers
    const currencyColumns = ["totalGravado", "totalIgv", "total", "saldo"];

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
            fill: { fgColor: { rgb: "1f2937" } }, // stone-800
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
            alignment: { horizontal: "right", vertical: "center" },
            fill: { fgColor: { rgb: "1f2937" } }, // stone-800
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
            fill: { fgColor: { rgb: "1f2937" } }, // stone-800
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

  exportToExcel(
    comprobantes,
    fechaInicio,
    fechaFinal,
    formatDate,
    formatNumber
  ) {
    try {
      if (!Array.isArray(comprobantes) || comprobantes.length === 0) {
        throw new Error("No hay datos para exportar");
      }

      const columns = this.createColumnDefinitions();

      // Crear worksheet vacío
      const worksheet = XLSX.utils.aoa_to_sheet([[]]);

      // Configurar worksheet con título
      this.configureWorksheet(worksheet, columns, fechaInicio, fechaFinal);

      // Transformar datos
      const data = this.transformData(comprobantes, formatDate, formatNumber);

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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Comprobantes");

      // Generar nombre de archivo
      const fileName =
        `comprobantes_cotizacion_${fechaInicio}_a_${fechaFinal}.xlsx`
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

export default ExcelComprobantesCotizacion;
