import * as XLSX from "xlsx-js-style";
import formatDate from "../hooks/FormatDate";
import { style } from "framer-motion/client";

// --- Constantes para mejorar la legibilidad y mantenibilidad ---
const COTIZACION_DISPLAY_STATUS = {
  ANULADA: "ANULADA",
  PROCESADA: "PROCESADA",
  PENDIENTE: "PENDIENTE",
};

const SISTEMA_COTIZACION_STATUS = {
  ANULADO: "Anulado",
};

const COMPROBANTE_ABREVIATURAS = {
  "NOTA DE VENTA": "NV",
  "FACTURA ELECTRÓNICA": "FT",
  "BOLETA DE VENTA": "BV",
  "NOTA DE CREDITO": "NC",
  "NOTA DE DEBITO": "ND",
};

const IGV_RATE = 0.18;

// --- Estilos para las celdas ---
const STYLES = {
  TITLE: {
    font: { bold: true, size: 16, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "4472C4" } },
  },
  SECTION_HEADER: {
    font: { bold: true, size: 12, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "5B9BD5" } },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  },
  SECTION_HEADER_YELLOW: {
    font: { bold: true, size: 12, color: { rgb: "000000" } }, // Texto negro para mejor contraste
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "FFFF00" } }, // Amarillo
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  },
  DATA_HEADER: {
    font: { bold: true, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "DDEBF7" } },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  },
  DATA_HEADER_YELLOW: {
    font: { bold: true, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "FFFF00" } }, // Amarillo
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  },
  NUMBER_CELL: {
    alignment: { vertical: "top", wrapText: true },
  },
  TEXT_CELL: {
    alignment: { vertical: "top", wrapText: true },
  },
  BOLD_TEXT_CELL: {
    font: { bold: true },
    alignment: { vertical: "top", wrapText: true },
  },
  RED_TEXT_CELL: {
    font: { color: { rgb: "FF0000" } },
    alignment: { vertical: "top", wrapText: true },
  },
};

// --- Definición de Columnas de Descuento Global ---
const globalDiscountColumns = [
  {
    header: "Fecha de emisión (Desc./Aum.)",
    key: "descuento_fecha_emision_global",
    width: 15,
  },
  {
    header: "Tipo Compr. (Desc./Aum.)",
    key: "descuento_tipo_comprobante_global",
    width: 12,
  },
  {
    header: "Serie y Número (Desc./Aum.)",
    key: "descuento_serie_numero_global",
    width: 18,
  },
  { header: "Motivo (Desc./Aum.)", key: "descuento_motivo_global", width: 25 },
  {
    header: "Base Imponible (Desc./Aum.)",
    key: "descuento_base_global",
    width: 20,
    type: "number",
    style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
  },
  {
    header: "IGV (Desc./Aum.)",
    key: "descuento_igv_global",
    width: 20,
    type: "number",
    style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
  },
  {
    header: "Total (Desc./Aum.)",
    key: "descuento_total_global",
    width: 20,
    type: "number",
    style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
  },
];

// --- Configuración de Secciones de la Hoja ---
const SECTIONS_CONFIG = {
  TITLE_ROW: 0,
  SECTION_HEADER_ROW: 1,
  DATA_HEADER_ROW: 2,
  DATA_START_ROW: 3,
  RANGES: [
    { title: "DATOS GENERALES Y CLIENTE", startCol: 0, endCol: 12 },
    { title: "COMPROBANTE DE PAGO", startCol: 13, endCol: 16 },
    { title: "DESTINO Y ENVÍO", startCol: 17, endCol: 18 },
    { title: "PRODUCTOS", startCol: 19, endCol: 26 },
  ],
  PRODUCT_COLUMNS: {
    START_KEY: "codigo_venta",
    END_KEY: "producto_total",
  },
  PAYMENT_COLUMNS_PER_PAYMENT: 4,
};

const ExcelReporteCotizacion = {
  createColumnDefinitions(cotizacionConMasPagos) {
    const baseColumns = [
      { header: "COT", key: "id", width: 7, style: STYLES.BOLD_TEXT_CELL },
      { header: "Fecha Pedido", key: "fechaPedido", width: 12 },
      { header: "Fecha Despacho", key: "fechaDespacho", width: 12 },
      {
        header: "Estado Cot.",
        key: "estadoCot",
        width: 15,
        style: STYLES.BOLD_TEXT_CELL,
      },
      { header: "Vendedor", key: "vendedor", width: 25 },
      { header: "Consignatario 1", key: "consignatario", width: 30 },
      { header: "DNI Consignatario 1", key: "dni", width: 18 },
      { header: "Teléfono 1", key: "telefono1", width: 15 },
      { header: "Consignatario 2", key: "consignatario2", width: 30 },
      { header: "DNI Consignatario 2", key: "dni2", width: 18 },
      { header: "Teléfono 2", key: "telefono2", width: 15 },
      { header: "Cliente", key: "cliente", width: 30 },
      { header: "Número Doc. Cliente", key: "numeroDoc", width: 18 },
      { header: "Fecha Compr. Pago", key: "fechaCP", width: 15 },
      { header: "Tipo Compr.", key: "facturaBoleta", width: 12 },
      { header: "Serie", key: "serie", width: 8 },
      { header: "Número", key: "numero", width: 12 },
      { header: "Destino", key: "destino", width: 30 },
      { header: "Tipo Envío", key: "tipoEnvio", width: 15 },
      { header: "Cod. Venta Prod.", key: "codigo_venta", width: 15 },
      { header: "Nombre Producto", key: "producto_nombre", width: 30 },
      { header: "Línea Producto", key: "producto_linea", width: 18 },
      {
        header: "Cantidad",
        key: "producto_cantidad",
        width: 10,
        type: "number",
        style: STYLES.NUMBER_CELL,
      },
      {
        header: "Precio Unit. (Inc. IGV)",
        key: "producto_precioUnitario",
        width: 15,
        type: "number",
        style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
      },
      {
        header: "Sub Total (Sin IGV)",
        key: "producto_sub_total",
        width: 15,
        type: "number",
        style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
      },
      {
        header: "IGV",
        key: "producto_total_igv",
        width: 12,
        type: "number",
        style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
      },
      {
        header: "Precio Total (Inc. IGV)",
        key: "producto_total",
        width: 15,
        type: "number",
        style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
      },
    ];

    const paymentColumns = Array.from({
      length: cotizacionConMasPagos?.pagos?.length || 0,
    }).flatMap((_, index) => [
      {
        header: `Fecha Pago ${index + 1}`,
        key: `pago${index + 1}_fecha`,
        width: 15,
      },
      {
        header: `Abono ${index + 1}`,
        key: `pago${index + 1}_abono`,
        width: 15,
        type: "number",
        style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
      },
      {
        header: `Operación ${index + 1}`,
        key: `pago${index + 1}_operacion`,
        width: 18,
      },
      {
        header: `Medio de Pago ${index + 1}`,
        key: `pago${index + 1}_medioPago`,
        width: 20,
      },
    ]);

    const endColumns = [
      {
        header: "Saldo",
        key: "saldo_number",
        width: 15,
        type: "number",
        style: { ...STYLES.NUMBER_CELL, numFmt: "#,##0.00" },
      },
      {
        header: "Estado del Pago",
        key: "estadoPago",
        width: 18,
        style: STYLES.BOLD_TEXT_CELL,
      },
    ];

    return [
      ...baseColumns,
      ...paymentColumns,
      ...globalDiscountColumns,
      ...endColumns,
    ];
  },

  _determineEstadoCot(ComprobanteElectronico, status) {
    if (ComprobanteElectronico?.id) {
      return COTIZACION_DISPLAY_STATUS.PROCESADA;
    } else if (status === SISTEMA_COTIZACION_STATUS.ANULADO) {
      return COTIZACION_DISPLAY_STATUS.ANULADA;
    } else {
      return COTIZACION_DISPLAY_STATUS.PENDIENTE;
    }
  },

  _createBaseRowData(cotizacion) {
    const {
      id,
      fechaEmision,
      fechaEntrega,
      status,
      estadoPago,
      vendedor,
      consignatario,
      consignatarioDni,
      consignatarioTelefono,
      consignatario2,
      consignatarioDni2,
      consignatarioTelefono2,
      cliente,
      ComprobanteElectronico,
      direccionEnvio,
      tipoEnvio,
      saldo,
    } = cotizacion;

    return {
      id,
      fechaPedido: fechaEmision ? formatDate(fechaEmision) : "",
      fechaDespacho: fechaEntrega ? formatDate(fechaEntrega) : "",
      estadoCot: this._determineEstadoCot(ComprobanteElectronico, status),
      vendedor: vendedor || "",
      consignatario: consignatario || "",
      dni: consignatarioDni || "",
      telefono1: consignatarioTelefono || "",
      consignatario2: consignatario2 || "",
      dni2: consignatarioDni2 || "",
      telefono2: consignatarioTelefono2 || "",
      numeroDoc: cliente?.numeroDoc || "",
      cliente: cliente?.nombreApellidos || cliente?.nombreComercial || "",
      fechaCP: ComprobanteElectronico?.fechaEmision
        ? formatDate(ComprobanteElectronico.fechaEmision)
        : "",
      facturaBoleta:
        COMPROBANTE_ABREVIATURAS[ComprobanteElectronico?.tipoComprobante] ||
        ComprobanteElectronico?.tipoComprobante ||
        "",
      serie: ComprobanteElectronico?.serie || "",
      numero: ComprobanteElectronico?.numeroSerie || "",
      destino: direccionEnvio || "",
      tipoEnvio: tipoEnvio || "",
      saldo_number: saldo || 0,
      estadoPago: estadoPago || "",
    };
  },

  transformData(cotizaciones) {
    const allRows = [];
    cotizaciones.forEach((cotizacion) => {
      let pagosData = {};
      const isMainDocNotaCredito =
        cotizacion.ComprobanteElectronico?.tipoComprobante ===
        "NOTA DE CREDITO";

      // Lógica para procesar los pagos AHORA, antes de su uso
      (cotizacion.pagos || []).forEach((pago, pagoIndex) => {
        const abonoMonto = isMainDocNotaCredito
          ? -Math.abs(pago.monto || 0)
          : pago.monto || 0;

        pagosData[`pago${pagoIndex + 1}_fecha`] = pago.fecha
          ? formatDate(pago.fecha)
          : "";
        pagosData[`pago${pagoIndex + 1}_abono`] = abonoMonto;
        pagosData[`pago${pagoIndex + 1}_operacion`] = pago.operacion || "";
        pagosData[`pago${pagoIndex + 1}_medioPago`] =
          pago.metodoPago?.descripcion || "";
      });

      const baseRowDataGeneral = this._createBaseRowData(cotizacion);

      let descuento_global_data = {
        descuento_fecha_emision_global: "",
        descuento_tipo_comprobante_global: "",
        descuento_serie_numero_global: "",
        descuento_motivo_global: "",
        descuento_base_global: null,
        descuento_igv_global: null,
        descuento_total_global: null,
      };

      const notaGlobal = cotizacion.ComprobanteElectronico?.notas_comprobante;
      if (
        notaGlobal &&
        (notaGlobal.codigo_motivo === "02" || notaGlobal.codigo_motivo === "04")
      ) {
        descuento_global_data = {
          descuento_fecha_emision_global: notaGlobal.fecha_emision
            ? formatDate(notaGlobal.fecha_emision)
            : "",
          descuento_tipo_comprobante_global: notaGlobal.tipo_nota,
          descuento_serie_numero_global: `${notaGlobal.serie}-${notaGlobal.numero_serie}`,
          descuento_motivo_global: notaGlobal.descripcion || "",
          descuento_base_global:
            notaGlobal.codigo_motivo === "02"
              ? notaGlobal.total_valor_venta
              : -notaGlobal.total_valor_venta,
          descuento_igv_global:
            notaGlobal.codigo_motivo === "02"
              ? notaGlobal.total_igv
              : -notaGlobal.total_igv,
          descuento_total_global:
            notaGlobal.codigo_motivo === "02"
              ? notaGlobal.total_venta
              : -notaGlobal.total_venta,
        };
      }

      const productosOriginal = (cotizacion.productos || []).filter(
        (p) => p?.producto
      );

      if (productosOriginal.length > 0) {
        productosOriginal.forEach((producto) => {
          let cantidad = producto.cantidad || 0;
          let precioUnitario = producto.precioUnitario || 0;
          let subTotalSinIgv = producto.total / (1 + IGV_RATE);
          let igvCalculado = subTotalSinIgv * IGV_RATE;
          let totalConIgv = producto.total;

          if (isMainDocNotaCredito) {
            cantidad = -Math.abs(cantidad);
            subTotalSinIgv = -Math.abs(subTotalSinIgv);
            igvCalculado = -Math.abs(igvCalculado);
            totalConIgv = -Math.abs(totalConIgv);
          }

          const productoData = {
            ...baseRowDataGeneral,
            ...pagosData, // pagosData ya contiene valores negativos si aplica
            ...descuento_global_data,
            codigo_venta: producto.producto.codigoVenta || "",
            producto_nombre: producto.producto.nombre || "",
            producto_linea: producto.producto.categoria || "",
            producto_cantidad: cantidad,
            producto_precioUnitario: precioUnitario,
            producto_sub_total: subTotalSinIgv,
            producto_total_igv: igvCalculado,
            producto_total: totalConIgv,
          };
          allRows.push(productoData);
        });
      } else {
        // En este caso, si no hay productos, también queremos que los pagos sean negativos si es Nota de Crédito
        allRows.push({
          ...baseRowDataGeneral,
          ...pagosData, // pagosData ya contiene valores negativos si aplica
          ...descuento_global_data,
          codigo_venta: "-",
          producto_nombre: isMainDocNotaCredito
            ? "NOTA DE CREDITO SIN DETALLE"
            : "Sin productos detallados",
          producto_linea: "-",
        });
      }

      const codigoMotivo =
        cotizacion.ComprobanteElectronico?.notas_comprobante?.codigo_motivo;
      if (
        cotizacion.ComprobanteElectronico?.notas_comprobante &&
        codigoMotivo !== "02" &&
        codigoMotivo !== "04"
      ) {
        const notaAdjunta = cotizacion.ComprobanteElectronico.notas_comprobante;
        const isNotaAdjuntaCredito =
          notaAdjunta.tipo_nota === "NOTA DE CREDITO";

        const notaAdjuntaInfoDoc = {
          fechaCP: notaAdjunta.fecha_emision
            ? formatDate(notaAdjunta.fecha_emision)
            : "",
          facturaBoleta:
            COMPROBANTE_ABREVIATURAS[notaAdjunta.tipo_nota] ||
            notaAdjunta.tipo_nota ||
            "",
          serie: notaAdjunta.serie || "",
          numero: notaAdjunta.numero_serie || "",
        };

        // Si es una nota adjunta, sus pagos no se verán afectados por la Nota de Crédito principal.
        // Pero si la nota adjunta en sí es de crédito, sus valores sí deben ser negativos.
        let pagosDataNotaAdjunta = {};
        (cotizacion.pagos || []).forEach((pago, pagoIndex) => {
          const abonoMonto = isNotaAdjuntaCredito
            ? -Math.abs(pago.monto || 0)
            : pago.monto || 0;

          pagosDataNotaAdjunta[`pago${pagoIndex + 1}_fecha`] = pago.fecha
            ? formatDate(pago.fecha)
            : "";
          pagosDataNotaAdjunta[`pago${pagoIndex + 1}_abono`] = abonoMonto;
          pagosDataNotaAdjunta[`pago${pagoIndex + 1}_operacion`] =
            pago.operacion || "";
          pagosDataNotaAdjunta[`pago${pagoIndex + 1}_medioPago`] =
            pago.metodoPago?.descripcion || "";
        });

        if (productosOriginal.length > 0) {
          productosOriginal.forEach((producto) => {
            let cantidad = producto.cantidad || 0;
            let precioUnitario = producto.precioUnitario || 0;
            let subTotalSinIgv = producto.total / (1 + IGV_RATE);
            let igvCalculado = subTotalSinIgv * IGV_RATE;
            let totalConIgv = producto.total;

            if (isNotaAdjuntaCredito) {
              cantidad = -Math.abs(cantidad);
              subTotalSinIgv = -Math.abs(subTotalSinIgv);
              igvCalculado = -Math.abs(igvCalculado);
              totalConIgv = -Math.abs(totalConIgv);
            }

            const notaProductoRow = {
              ...baseRowDataGeneral,
              ...notaAdjuntaInfoDoc,
              ...pagosDataNotaAdjunta, // Usar pagosDataNotaAdjunta
              ...descuento_global_data,
              codigo_venta: producto.producto.codigoVenta || "",
              producto_nombre: producto.producto.nombre || "",
              producto_linea: producto.producto.categoria || "",
              producto_cantidad: cantidad,
              producto_precioUnitario: precioUnitario,
              producto_sub_total: subTotalSinIgv,
              producto_total_igv: igvCalculado,
              producto_total: totalConIgv,
              isNotaRow: true,
            };
            allRows.push(notaProductoRow);
          });
        } else {
          let notaSubTotalVal = notaAdjunta.monto_subtotal_afectado_nota;
          let notaIgvVal = notaAdjunta.monto_igv_afectado_nota;
          let notaTotalVal = notaAdjunta.monto_total_afectado_nota;

          if (isNotaAdjuntaCredito) {
            if (notaSubTotalVal != null)
              notaSubTotalVal = -Math.abs(notaSubTotalVal);
            if (notaIgvVal != null) notaIgvVal = -Math.abs(notaIgvVal);
            if (notaTotalVal != null) notaTotalVal = -Math.abs(notaTotalVal);
          }

          const notaSummaryRow = {
            ...baseRowDataGeneral,
            ...notaAdjuntaInfoDoc,
            ...pagosDataNotaAdjunta, // Usar pagosDataNotaAdjunta
            ...descuento_global_data,
            codigo_venta: `NOTA: ${notaAdjunta.tipo_nota || ""}`,
            producto_nombre: `Ref: ${
              notaAdjunta.comprobante_referencia_serie || ""
            }-${
              notaAdjunta.comprobante_referencia_numero || ""
            } (Sin detalle prod. orig.)`,
            producto_linea: "",
            producto_cantidad: null,
            producto_precioUnitario: null,
            producto_sub_total: notaSubTotalVal,
            producto_total_igv: notaIgvVal,
            producto_total: notaTotalVal,
            isNotaRow: true,
          };
          allRows.push(notaSummaryRow);
        }
      }
    });
    return allRows;
  },

  configureWorksheet(worksheet, columns, numPagos, fechaInicio, fechaFinal) {
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`REPORTE DE COTIZACIÓN ${fechaInicio} a ${fechaFinal}`]],
      { origin: "A1" }
    );
    worksheet["A1"].s = STYLES.TITLE;
    worksheet["!cols"] = columns.map((col) => ({ wch: col.width }));

    const sectionHeaderRowIdx = SECTIONS_CONFIG.SECTION_HEADER_ROW;
    const merges = [
      {
        s: { r: SECTIONS_CONFIG.TITLE_ROW, c: 0 },
        e: { r: SECTIONS_CONFIG.TITLE_ROW, c: columns.length - 1 },
      },
    ];

    let currentSections = [...SECTIONS_CONFIG.RANGES];
    const productSectionEndCol = SECTIONS_CONFIG.RANGES.find(
      (s) => s.title === "PRODUCTOS"
    ).endCol;
    let dynamicSectionStartCol = productSectionEndCol + 1;

    for (let i = 0; i < numPagos; i++) {
      const startCol = dynamicSectionStartCol;
      const endCol = startCol + SECTIONS_CONFIG.PAYMENT_COLUMNS_PER_PAYMENT - 1;
      currentSections.push({ title: `PAGO ${i + 1}`, startCol, endCol });
      dynamicSectionStartCol = endCol + 1;
    }

    if (globalDiscountColumns.length > 0) {
      const startCol = dynamicSectionStartCol;
      const endCol = startCol + globalDiscountColumns.length - 1;
      currentSections.push({
        title: "DESCUENTO/AUMENTO GLOBAL",
        startCol,
        endCol,
      });
      dynamicSectionStartCol = endCol + 1;
    }

    const saldoColIndex = columns.findIndex(
      (col) => col.key === "saldo_number"
    );
    const estadoPagoColIndex = columns.findIndex(
      (col) => col.key === "estadoPago"
    );
    if (saldoColIndex !== -1 && estadoPagoColIndex !== -1) {
      currentSections.push({
        title: "ESTADO FINAL",
        startCol: saldoColIndex,
        endCol: estadoPagoColIndex,
      });
    }

    currentSections.forEach((section) => {
      if (section.startCol < columns.length) {
        const actualEndCol = Math.min(section.endCol, columns.length - 1);
        merges.push({
          s: { r: sectionHeaderRowIdx, c: section.startCol },
          e: { r: sectionHeaderRowIdx, c: actualEndCol },
        });
        for (let c = section.startCol; c <= actualEndCol; ++c) {
          const cellAddress = XLSX.utils.encode_cell({
            r: sectionHeaderRowIdx,
            c,
          });
          if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: "" };
          worksheet[cellAddress].v =
            c === section.startCol ? section.title : "";
          if (section.title === "DESCUENTO/AUMENTO GLOBAL") {
            worksheet[cellAddress].s = STYLES.SECTION_HEADER_YELLOW;
          } else {
            worksheet[cellAddress].s = STYLES.SECTION_HEADER;
          }
        }
      }
    });

    worksheet["!merges"] = merges;
    return worksheet;
  },

  exportToExcel(cotizaciones, fechaInicio, fechaFinal, formatDate) {
    try {
      if (!Array.isArray(cotizaciones) || cotizaciones.length === 0) {
        throw new Error("No hay datos para exportar");
      }

      const maxLengths = cotizaciones.reduce(
        (max, cot) => ({
          pagos: Math.max(max.pagos, cot.pagos?.length || 0),
        }),
        { pagos: 0 }
      );
      const cotizacionConMasPagos = { pagos: { length: maxLengths.pagos } };

      const columns = this.createColumnDefinitions(cotizacionConMasPagos);
      const data = this.transformData(cotizaciones, formatDate);
      const worksheet = XLSX.utils.aoa_to_sheet([[]]);

      this.configureWorksheet(
        worksheet,
        columns,
        maxLengths.pagos,
        fechaInicio,
        fechaFinal
      );

      const headerCells = columns.map((col) => {
        let headerStyle = STYLES.DATA_HEADER;
        const isGlobalDiscountColumn = globalDiscountColumns.some(
          (discountCol) => discountCol.key === col.key
        );

        if (isGlobalDiscountColumn) {
          headerStyle = STYLES.DATA_HEADER_YELLOW;
        }

        return {
          v: col.header,
          t: "s",
          s: headerStyle,
        };
      });
      XLSX.utils.sheet_add_aoa(worksheet, [headerCells], {
        origin: `A${SECTIONS_CONFIG.DATA_HEADER_ROW + 1}`,
      });
      XLSX.utils.sheet_add_aoa(
        worksheet,
        data.map((item) =>
          columns.map((col) => {
            const value = item[col.key];
            let cell = { v: value };
            let styleToApply = { ...STYLES.TEXT_CELL, ...(col.style || {}) };

            if (item.isNotaRow) {
              styleToApply.font = {
                ...(styleToApply.font || {}),
                ...STYLES.RED_TEXT_CELL.font,
              };
            }
            styleToApply.alignment = {
              ...STYLES.TEXT_CELL.alignment,
              ...(styleToApply.alignment || {}),
            };
            cell.s = styleToApply;

            if (value === null || typeof value === "undefined") {
              cell.v = "";
              cell.t = "s";
            } else if (col.type === "number") {
              cell.t = "n";
              cell.v = parseFloat(value);
              if (isNaN(cell.v)) {
                cell.v = null;
              }
              if (cell.v !== null) {
                cell.s.numFmt = col.style?.numFmt || "#,##0.00";
              } else {
                delete cell.s.numFmt;
                cell.t = "s";
                cell.v = "";
              }
            } else {
              cell.t = "s";
              cell.v = String(value);
            }

            cell.s.border = {
              top: { style: "thin", color: { rgb: "B2B2B2" } },
              bottom: { style: "thin", color: { rgb: "B2B2B2" } },
              left: { style: "thin", color: { rgb: "B2B2B2" } },
              right: { style: "thin", color: { rgb: "B2B2B2" } },
            };
            return cell;
          })
        ),
        {
          origin: `A${SECTIONS_CONFIG.DATA_START_ROW + 1}`,
          cellStyles: true,
        }
      );

      if (!worksheet["!merges"]) worksheet["!merges"] = [];

      const productColStartIndex = columns.findIndex(
        (col) => col.key === SECTIONS_CONFIG.PRODUCT_COLUMNS.START_KEY
      );
      const productColEndIndex = columns.findIndex(
        (col) => col.key === SECTIONS_CONFIG.PRODUCT_COLUMNS.END_KEY
      );
      let mergeBlockStartIndexInSheet = SECTIONS_CONFIG.DATA_START_ROW;

      for (let i = 0; i < data.length; i++) {
        const currentRowInSheet = SECTIONS_CONFIG.DATA_START_ROW + i;
        const currentRowData = data[i];
        const isLastRowOfData = i === data.length - 1;
        const nextRowData = !isLastRowOfData ? data[i + 1] : null;

        let shouldEndBlockAndMerge = false;
        if (isLastRowOfData) {
          shouldEndBlockAndMerge = true;
        } else if (currentRowData.id !== nextRowData.id) {
          shouldEndBlockAndMerge = true;
        } else if (nextRowData.isNotaRow && !currentRowData.isNotaRow) {
          shouldEndBlockAndMerge = true;
        } else if (
          currentRowData.isNotaRow &&
          (!nextRowData.isNotaRow ||
            currentRowData.serie !== nextRowData.serie ||
            currentRowData.numero !== nextRowData.numero)
        ) {
          shouldEndBlockAndMerge = true;
        }

        if (shouldEndBlockAndMerge) {
          const blockEndRowInSheet = currentRowInSheet;
          if (blockEndRowInSheet > mergeBlockStartIndexInSheet) {
            for (let colIdx = 0; colIdx < columns.length; colIdx++) {
              const isProductColumn =
                productColStartIndex !== -1 &&
                productColEndIndex !== -1 &&
                colIdx >= productColStartIndex &&
                colIdx <= productColEndIndex;
              if (isProductColumn) continue;

              worksheet["!merges"].push({
                s: { r: mergeBlockStartIndexInSheet, c: colIdx },
                e: { r: blockEndRowInSheet, c: colIdx },
              });
            }
          }
          mergeBlockStartIndexInSheet = blockEndRowInSheet + 1;
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Cotizaciones");
      const fileName =
        `ReporteCotizaciones_${fechaInicio}_al_${fechaFinal}.xlsx`
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

export default ExcelReporteCotizacion;
