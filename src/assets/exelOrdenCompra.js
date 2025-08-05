import * as XLSX from "xlsx-js-style";
import formatDate from "../hooks/FormatDate";

const ExcelReporteOrdenCompra = {
  createColumnDefinitions(cotizacionConMasPagos) {
    const baseColumns = [
      { header: "CÓD", key: "id", width: 5 },
      { header: "Fecha Pedido", key: "fechaPedido", width: 15 },
      { header: "Fecha Vencimiento", key: "fechaVencimiento", width: 15 },
      { header: "Autorizado por", key: "autorizado", width: 20 },
      { header: "Comprador", key: "comprador", width: 20 },
      { header: "Proveedor", key: "proveedor", width: 25 },
      { header: "Número Doc", key: "numeroDoc", width: 15 },
      { header: "Bco Benef.", key: "bcoBenef", width: 15 },
      { header: "N° Cuenta Benef.", key: "numCuentaBenef", width: 15 },
      { header: "COM. PAGO", key: "facturaBoleta", width: 15 },
      { header: "Serie", key: "serie", width: 10 },
      { header: "Número", key: "numero", width: 10 },
      { header: "Centro de Costos", key: "centro_costos", width: 15 },
      { header: "Producto", key: "producto_nombre", width: 15 },
      { header: "Descripcion", key: "producto_descripcion", width: 15 },
      { header: "Cantidad", key: "producto_cantidad", width: 15 },
      { header: "Precio Unitario", key: "producto_precioUnitario", width: 15 },
      { header: "Sub total", key: "producto_sub_total", width: 15 },
      { header: "Igv", key: "producto_igv", width: 15 },
      { header: "Total", key: "producto_total", width: 15 },
    ];

    const paymentColumns = Array.from({
      length: cotizacionConMasPagos?.pagos?.length || 0,
    })
      .map((_, index) => [
        { header: `Fecha Pago`, key: `pago${index + 1}_fecha`, width: 15 },
        {
          header: `Abono ${index + 1}`,
          key: `pago${index + 1}_abono`,
          width: 15,
        },
        { header: `Operación`, key: `pago${index + 1}_operacion`, width: 15 },
        {
          header: `Medio de pago`,
          key: `pago${index + 1}_medioPago`,
          width: 20,
        },
      ])
      .flat();

    const endColumns = [
      { header: "Saldo", key: "saldo", width: 15 },
      { header: "Estado del Pago", key: "estadoPago", width: 15 },
      { header: "Observaciones", key: "observacion", width: 15 },
    ];

    return [...baseColumns, ...paymentColumns, ...endColumns];
  },

  transformData(ordenesCompra) {
    let rowCount = 0;
    const allRows = [];

    ordenesCompra.forEach((orden) => {
      const pagos = {};
      (orden.pagos || []).forEach((pago, pagoIndex) => {
        pagos[`pago${pagoIndex + 1}_fecha`] = pago.fecha
          ? formatDate(pago.fecha)
          : "";
        // CORREGIDO: Mantener como número, no como texto con "S/."
        pagos[`pago${pagoIndex + 1}_abono`] = parseFloat(pago.monto) || 0;
        pagos[`pago${pagoIndex + 1}_operacion`] = pago.operacion || "";
        pagos[`pago${pagoIndex + 1}_medioPago`] =
          pago.metodoPago?.descripcion || "";
      });

      const [parte1, parte2] = orden?.comprobante?.serie
        ? orden?.comprobante?.serie?.split("-")
        : ["", ""];

      const baseData = {
        id: orden.id,
        fechaPedido: orden.fechaEmision ? formatDate(orden.fechaEmision) : "",
        fechaVencimiento: orden.fechaVencimiento
          ? formatDate(orden.fechaVencimiento)
          : "",
        autorizado: orden.autorizado || "",
        comprador: orden.comprador || "",
        numeroDoc: orden.proveedor?.numeroDoc || "",
        proveedor:
          orden.proveedor?.nombreApellidos ||
          orden.proveedor?.nombreComercial ||
          "",
        bcoBenef: orden.banco_beneficiario || "",
        numCuentaBenef: orden.nro_cuenta_bco || "",
        facturaBoleta:
          orden.comprobante?.tipoComprobante === "NOTA DE VENTA"
            ? "NV"
            : orden.comprobante?.tipoComprobante === "FACTURA ELECTRÓNICA"
            ? "FT"
            : orden.comprobante?.tipoComprobante === "BOLETA DE VENTA"
            ? "BV"
            : "",
        serie: parte1 || "",
        numero: parte2 || "",
        observacion: orden.observacion || "",
      };

      const productosData = (orden.productos || [])
        .map((producto) => {
          if (!producto?.producto) return null;

          // CORREGIDO: Calcular valores numéricos correctamente
          const total = parseFloat(producto.total) || 0;
          const subTotal = total / 1.18;
          const igv = subTotal * 0.18;

          return {
            ...baseData,
            centro_costos: producto.centro_costo?.cod_sub_centro_costo || "",
            producto_nombre: producto.producto.nombre || "",
            producto_descripcion: producto.descripcion_producto || "",
            // CORREGIDO: Mantener como números
            producto_cantidad: parseFloat(producto.cantidad) || 0,
            producto_precioUnitario: parseFloat(producto.precioUnitario) || 0,
            producto_sub_total: parseFloat(subTotal.toFixed(3)),
            producto_igv: parseFloat(igv.toFixed(3)),
            producto_total: total,
            ...pagos,
            // CORREGIDO: Mantener saldo como número
            saldo: parseFloat(orden.saldo) || 0,
            estadoPago: orden.estadoPago || "",
            _rowCount: rowCount,
            _productsInGroup: (orden.productos || []).filter((p) => p?.producto)
              .length,
          };
        })
        .filter(Boolean);

      if (productosData.length > 0) {
        productosData.forEach((row) => {
          allRows.push(row);
          rowCount++;
        });
      } else {
        allRows.push({
          ...baseData,
          ...pagos,
          // CORREGIDO: Mantener saldo como número
          saldo: parseFloat(orden.saldo) || 0,
          estadoPago: orden.estadoPago || "",
          _rowCount: rowCount,
          _productsInGroup: 1,
        });
        rowCount++;
      }
    });

    return allRows;
  },

  configureWorksheet(worksheet, columns, numPagos, fechaInicio, fechaFinal) {
    const titleRow = [[`REPORTE DE SOLPED ${fechaInicio} a ${fechaFinal}`]];
    XLSX.utils.sheet_add_aoa(worksheet, titleRow, { origin: "A1" });

    const colWidths = {};
    columns.forEach((col, index) => {
      colWidths[XLSX.utils.encode_col(index)] = { width: col.width };
    });
    worksheet["!cols"] = Object.values(colWidths);

    worksheet["A1"].s = {
      font: { bold: true, size: 14 },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "FFFF00" } },
    };

    const sectionHeaders = Array(columns.length).fill("");

    // Datos del cliente (columnas 0-9)
    sectionHeaders[0] = "DATOS SOLPED";

    // Productos (columnas 10-19)
    for (let i = 10; i <= 19; i++) {
      sectionHeaders[i] = "PRODUCTOS";
    }

    // Pagos (columnas 20 en adelante, 4 columnas por pago)
    for (let i = 0; i < numPagos; i++) {
      const startCol = 20 + i * 4;
      for (let j = 0; j < 4; j++) {
        if (startCol + j < columns.length) {
          sectionHeaders[startCol + j] = `PAGO ${i + 1}`;
        }
      }
    }

    // Últimas columnas para estado final
    const lastColumns = columns.length - 3;
    if (lastColumns >= 20) {
      sectionHeaders[lastColumns] = "ESTADO FINAL";
      sectionHeaders[lastColumns + 1] = "ESTADO FINAL";
      sectionHeaders[lastColumns + 2] = "ESTADO FINAL";
    }

    XLSX.utils.sheet_add_aoa(worksheet, [sectionHeaders], { origin: "A2" });

    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } }, // DATOS DE LA ORDEN DE COMPRA
      { s: { r: 1, c: 13 }, e: { r: 1, c: 19 } }, // PRODUCTOS
    ];

    // Merges para pagos
    for (let i = 0; i < numPagos; i++) {
      const startCol = 20 + i * 4;
      if (startCol < columns.length) {
        merges.push({
          s: { r: 1, c: startCol },
          e: { r: 1, c: Math.min(startCol + 3, columns.length - 1) },
        });
      }
    }

    // Merge para estado final
    if (lastColumns >= 20) {
      merges.push({
        s: { r: 1, c: lastColumns },
        e: { r: 1, c: columns.length - 1 },
      });
    }

    worksheet["!merges"] = merges;
    return worksheet;
  },

  // NUEVO: Función para aplicar formato de moneda a celdas específicas
  applyCurrencyFormat(worksheet, data, columns) {
    const currencyColumns = [
      "producto_precioUnitario",
      "producto_sub_total",
      "producto_igv",
      "producto_total",
      "saldo",
    ];

    // También incluir columnas de abonos de pagos
    const abonoColumns = columns
      .filter((col) => col.key.includes("_abono"))
      .map((col) => col.key);

    const allCurrencyColumns = [...currencyColumns, ...abonoColumns];

    data.forEach((row, rowIndex) => {
      columns.forEach((col, colIndex) => {
        if (allCurrencyColumns.includes(col.key)) {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex + 3,
            c: colIndex,
          });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
              numFmt: '"S/. "#,##0.00',
            };
          }
        }
      });
    });
  },

  exportToExcel(ordenesCompra, fechaInicio, fechaFinal, formatDate) {
    try {
      if (!Array.isArray(ordenesCompra) || ordenesCompra.length === 0) {
        throw new Error("No hay datos para exportar");
      }

      const maxLengths = ordenesCompra.reduce(
        (max, orden) => ({
          productos: Math.max(max.productos, orden.productos?.length || 0),
          pagos: Math.max(max.pagos, orden.pagos?.length || 0),
        }),
        { productos: 0, pagos: 0 }
      );

      const ordenConMasPagos = { pagos: { length: maxLengths.pagos } };
      const columns = this.createColumnDefinitions(ordenConMasPagos);

      const worksheet = XLSX.utils.aoa_to_sheet([[]], {
        sheetRows: ordenesCompra.length + 3,
      });

      this.configureWorksheet(
        worksheet,
        columns,
        maxLengths.pagos,
        fechaInicio,
        fechaFinal
      );

      const data = this.transformData(ordenesCompra, formatDate);
      const matrixData = data.map((item) =>
        columns.map((col) => item[col.key] ?? "")
      );

      const headers = columns.map((col) => col.header);
      XLSX.utils.sheet_add_aoa(worksheet, [headers, ...matrixData], {
        origin: "A3",
        cellStyles: true,
      });

      // NUEVO: Aplicar formato de moneda
      this.applyCurrencyFormat(worksheet, data, columns);

      let currentRow = 3;
      let lastOrdenId = null;
      let startRow = currentRow;

      data.forEach((row, index) => {
        if (lastOrdenId !== row.id) {
          if (lastOrdenId !== null && currentRow > startRow) {
            // CORREGIDO: Ajustar el índice de columnas para merge
            for (let col = 20; col < columns.length; col++) {
              worksheet["!merges"] = worksheet["!merges"] || [];
              worksheet["!merges"].push({
                s: { r: startRow, c: col },
                e: { r: currentRow - 1, c: col },
              });
            }
          }
          lastOrdenId = row.id;
          startRow = currentRow;
        }
        currentRow++;
      });

      if (currentRow > startRow) {
        for (let col = 20; col < columns.length; col++) {
          worksheet["!merges"] = worksheet["!merges"] || [];
          worksheet["!merges"].push({
            s: { r: startRow, c: col },
            e: { r: currentRow - 1, c: col },
          });
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

      const fileName = `reporte_${fechaInicio}_a_${fechaFinal}.xlsx`
        .replace(/[\/\?<>\\:\*\|"]/g, "_")
        .replace(/\s+/g, "_");

      XLSX.writeFile(workbook, fileName);
      return true;
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      throw error;
    }
  },
};

export default ExcelReporteOrdenCompra;
