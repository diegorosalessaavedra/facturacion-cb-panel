import * as XLSX from "xlsx-js-style";
import formatDate from "../hooks/FormatDate"; // Asegúrate de que este hook exista y funcione
import { formatWithLeadingZeros } from "./formats";

// --- CONSTANTES ---
const TIPO_COMPROBANTE_COMPRAS = [
  { numero: 1, descripcion: "FACTURA ELECTRÓNICA" },
  { numero: 3, descripcion: "BOLETA DE VENTA ELECTRÓNICA" },
  { numero: 7, descripcion: "NOTA DE CRÉDITO" },
];

const TIPO_COMPROBANTE_VENTAS = [
  { numero: 1, descripcion: "FACTURA ELECTRÓNICA" },
  { numero: 3, descripcion: "BOLETA DE VENTA" },
  { numero: 7, descripcion: "NOTA DE CREDITO" },
  { numero: 8, descripcion: "NOTA DE DEBITO" },
];

// --- ESTILOS PARA LAS CELDAS ---
const defaultStyle = {
  alignment: { vertical: "center", horizontal: "center", wrapText: true },
  border: {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  },
};

// --- NUEVOS ESTILOS PARA EL HEADER MEJORADO ---
// Estilo para el título principal
const mainTitleStyle = {
  font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
  alignment: { vertical: "center", horizontal: "center", wrapText: true },
  fill: { patternType: "solid", fgColor: { rgb: "081065" } }, // Azul corporativo
  border: {
    top: { style: "medium", color: { rgb: "1F4E79" } },
    bottom: { style: "medium", color: { rgb: "1F4E79" } },
    left: { style: "medium", color: { rgb: "1F4E79" } },
    right: { style: "medium", color: { rgb: "1F4E79" } },
  },
};

// Estilo para las etiquetas de la cabecera (ej: "RUC:", "PERÍODO:")
const headerLabelStyle = {
  font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
  alignment: { vertical: "center", horizontal: "left", wrapText: true },
  fill: { patternType: "solid", fgColor: { rgb: "081065" } }, // Azul claro
  border: {
    top: { style: "thin", color: { rgb: "1F4E79" } },
    bottom: { style: "thin", color: { rgb: "1F4E79" } },
    left: { style: "thin", color: { rgb: "1F4E79" } },
    right: { style: "thin", color: { rgb: "1F4E79" } },
  },
};

// Estilo para los valores de la cabecera
const headerValueStyle = {
  font: { sz: 11, color: { rgb: "FFFFFF" } },
  alignment: { vertical: "center", horizontal: "left", wrapText: true },
  fill: { patternType: "solid", fgColor: { rgb: "081065" } }, // Blanco azulado
  border: {
    top: { style: "thin", color: { rgb: "1F4E79" } },
    bottom: { style: "thin", color: { rgb: "1F4E79" } },
    left: { style: "thin", color: { rgb: "1F4E79" } },
    right: { style: "thin", color: { rgb: "1F4E79" } },
  },
};

// Estilo para fila de separación
const separatorStyle = {
  fill: { patternType: "solid", fgColor: { rgb: "FFFFFF" } },
  border: {
    top: { style: "thin", color: { rgb: "1F4E79" } },
    bottom: { style: "thin", color: { rgb: "1F4E79" } },
    left: { style: "thin", color: { rgb: "1F4E79" } },
    right: { style: "thin", color: { rgb: "1F4E79" } },
  },
};

const numberStyle5Decimal = {
  ...defaultStyle,
  numFmt: "#,##0.00000",
};

const negativeStyle = {
  ...defaultStyle,
  font: { color: { rgb: "FF0000" } }, // Rojo para valores negativos o devoluciones
};

const negativeNumberStyle5Decimal = {
  ...negativeStyle, // Extiende el estilo negativo base
  numFmt: "#,##0.00000",
};

const headerStyle = {
  ...defaultStyle,
  fill: { patternType: "solid", fgColor: { rgb: "081065" } }, // Azul oscuro
  font: { color: { rgb: "FFFFFF" }, bold: true },
};

const titleStyle = {
  ...headerStyle,
  font: { ...headerStyle.font, sz: 16 },
};

const ExcelKardex = {
  /**
   * Genera un archivo Excel de Kardex.
   * @param {Array} productos - Array de productos. Se espera que las transacciones internas ya estén filtradas por fecha desde el backend.
   * @param {string|Date} fechaInicio - Fecha de inicio del reporte.
   * @param {string|Date} fechaFinal - Fecha de fin del reporte.
   * @param {Object} [saldoInicial={cantidad: 0, precioTotal: 0}] - Objeto con el saldo inicial (cantidad y precioTotal) calculado por el backend.
   */
  exportToExcel(
    productos,
    fechaInicio,
    fechaFinal,
    saldoInicial = { cantidad: 0, precioTotal: 0 }
  ) {
    // --- INICIALIZACIÓN DEL LIBRO Y HOJA DE CÁLCULO ---
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    worksheet["!merges"] = []; // Inicializar merges

    // --- INICIO: SECCIÓN DE CABECERA GENERAL MEJORADA ---
    const dateRangeTitle = `del ${formatDate(fechaInicio)} al ${formatDate(
      fechaFinal
    )}`;

    // 1. Título principal que ocupa todo el ancho
    const mainTitle = [
      {
        v: `REGISTRO DE INVENTARIO PERMANENTE VALORIZADO - DETALLE DEL INVENTARIO VALORIZADO - ${dateRangeTitle.toUpperCase()}`,
        s: mainTitleStyle,
      },
      ...Array(17).fill(null), // Llenar las 17 columnas restantes
    ];

    // 2. Fila de separación
    const separatorRow = Array(18).fill({ v: "", s: separatorStyle });

    // 3. Definir los datos y estilos para la cabecera de información
    const reportHeaderData = [
      mainTitle, // Título principal
      separatorRow, // Fila de separación
      [
        { v: "RUC:", s: headerLabelStyle },
        { v: "10436760693", s: headerValueStyle },
        { v: "", s: headerValueStyle }, // Celda vacía con estilo
        { v: "PERÍODO:", s: headerLabelStyle },
        {
          v: `${formatDate(fechaInicio)} - ${formatDate(fechaFinal)}`,
          s: headerValueStyle,
        },
        ...Array(13).fill({ v: "", s: headerValueStyle }), // Completar las 18 columnas
      ],
      [
        { v: "RAZÓN SOCIAL:", s: headerLabelStyle },
        { v: "DIEGO ALONSO ROSALES SAAVEDRA", s: headerValueStyle },
        ...Array(16).fill({ v: "", s: headerValueStyle }), // Completar las 18 columnas
      ],
      [
        { v: "ESTABLECIMIENTO:", s: headerLabelStyle },
        { v: "ALMACEN EL PINAR - COMAS	", s: headerValueStyle },
        ...Array(16).fill({ v: "", s: headerValueStyle }), // Completar las 18 columnas
      ],
      [
        { v: "MÉTODO DE VALUACIÓN:", s: headerLabelStyle },
        { v: "COSTO PROMEDIO PONDERADO", s: headerValueStyle },
        ...Array(16).fill({ v: "", s: headerValueStyle }), // Completar las 18 columnas
      ],
      separatorRow, // Fila de separación final
      Array(16).fill({
        v: "",
        s: { fill: { patternType: "solid", fgColor: { rgb: "FFFFFF" } } },
      }), // Fila vacía para dar espacio
    ];

    // 4. Agregar la cabecera a la hoja de cálculo.
    XLSX.utils.sheet_add_aoa(worksheet, reportHeaderData, { origin: "A1" });

    // 5. Combinar celdas para el título principal y la información
    worksheet["!merges"].push(
      { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }, // Título principal ocupa todo el ancho
      { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } }, // Fila separadora
      { s: { r: 3, c: 1 }, e: { r: 3, c: 17 } }, // Combinar para "RAZÓN SOCIAL"
      { s: { r: 4, c: 1 }, e: { r: 4, c: 17 } }, // Combinar para "ESTABLECIMIENTO"
      { s: { r: 5, c: 1 }, e: { r: 5, c: 17 } }, // Combinar para "MÉTODO DE VALUACIÓN"
      { s: { r: 6, c: 0 }, e: { r: 6, c: 17 } }, // Fila separadora final
      { s: { r: 7, c: 0 }, e: { r: 7, c: 17 } } // Fila vacía
    );

    // 6. Contador de fila para que el Kardex empiece después de la cabecera (8 filas usadas).
    let currentRow = 7;
    // --- FIN: SECCIÓN DE CABECERA GENERAL MEJORADA ---

    const dateRangeFilename = `del_${formatDate(fechaInicio).replace(
      /\//g,
      "-"
    )}_al_${formatDate(fechaFinal).replace(/\//g, "-")}`;

    // --- BUCLE PRINCIPAL POR CADA PRODUCTO ---
    productos.forEach((producto) => {
      // 1. COMBINAR Y ORDENAR LAS TRANSACCIONES
      const transactions = [
        ...producto.productosOrdenCompras.map((p) => ({
          ...p,
          type: "compra",
        })),
        ...producto.productosCotizaciones.map((p) => ({ ...p, type: "venta" })),
        ...producto.productosNotas.map((p) => ({ ...p, type: "nota" })),
        ...producto.productosMerma.map((p) => ({ ...p, type: "merma" })),
      ].sort((a, b) => {
        const dateA = new Date(
          a.ordenesCompra?.fechaEmision ||
            a.cotizacion?.fechaEmision ||
            a.notas_comprobante?.fecha_emision ||
            a.comprobantesElectronico?.fechaEmision ||
            a.createdAt
        );
        const dateB = new Date(
          b.ordenesCompra?.fechaEmision ||
            b.cotizacion?.fechaEmision ||
            b.notas_comprobante?.fecha_emision ||
            a.comprobantesElectronico?.fechaEmision ||
            b.createdAt
        );
        return dateA - dateB;
      });

      const codUnidad = producto.codUnidad === "NIU" ? "07" : "01";

      // 2. OBTENER SALDO INICIAL
      let saldoCantidad = saldoInicial.cantidad;
      let saldoPrecioTotal = saldoInicial.precioTotal;
      let saldoPrecioUnitarioPromedio =
        saldoCantidad > 0 ? saldoPrecioTotal / saldoCantidad : 0;

      // 3. CREAR ENCABEZADOS DE LA TABLA DE KARDEX
      const headers = [
        [
          {
            v: `PRODUCTO: ${producto.nombre.toUpperCase()}`,
            s: titleStyle,
          },
          ...Array(17).fill(null),
        ],
        [
          "ITEM",
          "FECHA",
          "DETALLE",
          "TIPO DE COMPROBANTE DE PAGO",
          "SERIE Y NÚMERO",
          "CT/OC",
          "TIPO DE OPERACIÓN",
          "TIPO DE EXISTENCIA",
          "U.M.",
          "ENTRADAS",
          null,
          null,
          "SALIDAS",
          null,
          null,
          "SALDO FINAL",
          null,
          null,
        ].map((v) => ({ v, s: headerStyle })),
        [
          ...Array(9).fill(null),
          "CANT.",
          "C.U.",
          "C.T.",
          "CANT.",
          "C.U.",
          "C.T.",
          "CANT.",
          "C.U.",
          "C.T.",
        ].map((v) => ({ v, s: headerStyle })),
      ];
      XLSX.utils.sheet_add_aoa(worksheet, headers, {
        origin: `A${currentRow + 1}`,
      });

      // 4. CONFIGURAR MERGES PARA ENCABEZADOS DE KARDEX
      const kardexMerges = [
        { s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 17 } },
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => ({
          s: { r: currentRow + 1, c },
          e: { r: currentRow + 2, c },
        })),
        { s: { r: currentRow + 1, c: 9 }, e: { r: currentRow + 1, c: 11 } },
        { s: { r: currentRow + 1, c: 12 }, e: { r: currentRow + 1, c: 14 } },
        { s: { r: currentRow + 1, c: 15 }, e: { r: currentRow + 1, c: 17 } },
      ];
      worksheet["!merges"].push(...kardexMerges);

      let dataRowIndex = currentRow + 4;

      // 5. AGREGAR FILA DE SALDO INICIAL
      const saldoInicialRow = [
        { v: 1, s: defaultStyle },
        { v: formatDate(fechaInicio), s: defaultStyle },
        { v: `SALDO INICIAL AL ${formatDate(fechaInicio)}`, s: defaultStyle },
        ...Array(12).fill({ v: "-", s: defaultStyle }),
        { v: saldoCantidad.toFixed(5), s: numberStyle5Decimal },
        { v: saldoPrecioUnitarioPromedio.toFixed(5), s: numberStyle5Decimal },
        { v: saldoPrecioTotal.toFixed(5), s: numberStyle5Decimal },
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [saldoInicialRow], {
        origin: `A${dataRowIndex}`,
      });
      worksheet["!merges"].push({
        s: { r: dataRowIndex - 1, c: 2 },
        e: { r: dataRowIndex - 1, c: 8 },
      });

      // 6. PROCESAR TRANSACCIONES Y GENERAR FILAS DE DATOS
      const dataRows = [];
      transactions.forEach((item, index) => {
        const rowData = Array(18).fill(null);
        rowData[0] = { v: index + 2, s: defaultStyle };

        let fecha = "";
        let detalle = "";
        let tipoCompNum = "-";
        let serieNum = "-";
        let cantidadEntrada = "-";
        let puEntrada = "-";
        let ptEntrada = "-";
        let cantidadSalida = "-";
        let puSalida = "-";
        let ptSalida = "-";
        let tipoOperacion = "-";
        let docRefId = "-";

        // Lógica para ENTRADAS
        if (item.type === "compra" || item.type === "nota") {
          fecha =
            item.type === "compra"
              ? item.ordenesCompra?.fechaEmision
              : item.notas_comprobante?.fecha_emision;
          const cantidad = Number(item.cantidad || 0);
          const precioUnitario = Number(item.precioUnitario || 0) / 1.18;
          const total = cantidad * precioUnitario;
          saldoCantidad += cantidad;
          saldoPrecioTotal += total;
          saldoPrecioUnitarioPromedio =
            saldoCantidad > 0 ? saldoPrecioTotal / saldoCantidad : 0;

          if (item.type === "compra") {
            detalle = `Compra a Proveedor: ${
              item.ordenesCompra.proveedor?.nombreComercial ||
              item.ordenesCompra.proveedor?.nombreApellidos ||
              "Desconocido"
            }`;
            tipoCompNum =
              TIPO_COMPROBANTE_COMPRAS.find(
                (c) =>
                  c.descripcion ===
                  item.ordenesCompra.comprobante?.tipoComprobante
              )?.numero ?? "-";
            serieNum = item.ordenesCompra.comprobante?.serie || "-";
            tipoOperacion = "02";
            docRefId = `OC-${formatWithLeadingZeros(
              item.ordenesCompra?.id,
              6
            )}`;
          } else {
            let clientNameForNote = "Desconocido";
            if (item.notas_comprobante?.cliente) {
              clientNameForNote =
                item.notas_comprobante.cliente.nombreApellidos ||
                item.notas_comprobante.cliente.nombreComercial;
            } else if (item.cotizacion?.cliente) {
              clientNameForNote =
                item.cotizacion.cliente.nombreApellidos ||
                item.cotizacion.cliente.nombreComercial;
            }
            detalle = `Nota ${
              item.notas_comprobante?.tipo_nota || ""
            } - Cliente: ${clientNameForNote}`;
            tipoCompNum =
              TIPO_COMPROBANTE_VENTAS.find(
                (c) => c.descripcion === item.notas_comprobante?.tipo_nota
              )?.numero ?? "-";
            serieNum = `${item.notas_comprobante?.serie || "-"}-${
              item.notas_comprobante?.numero_serie || "-"
            }`;
            tipoOperacion =
              item.notas_comprobante?.tipo_nota === "NOTA DE CREDITO"
                ? "05"
                : "06";
            docRefId = "-";
          }
          cantidadEntrada = cantidad.toFixed(5);
          puEntrada = precioUnitario.toFixed(5);
          ptEntrada = total.toFixed(5);
        } else if (item.type === "venta") {
          // Lógica para SALIDAS
          fecha = item.cotizacion?.fechaEmision;
          const cantidad = Number(item.cantidad || 0);
          const costoUnitarioSalida =
            saldoPrecioUnitarioPromedio > 0
              ? saldoPrecioUnitarioPromedio
              : Number(item.precioUnitario || 0) / 1.18;
          const costoTotalSalida = cantidad * costoUnitarioSalida;
          saldoCantidad -= cantidad;
          saldoPrecioTotal -= costoTotalSalida;
          saldoPrecioUnitarioPromedio =
            saldoCantidad > 0 ? saldoPrecioTotal / saldoCantidad : 0;
          detalle = `Venta a Cliente: ${
            item.cotizacion?.cliente?.nombreApellidos ||
            item.cotizacion?.cliente?.nombreComercial ||
            "Desconocido"
          }`;

          tipoCompNum =
            TIPO_COMPROBANTE_VENTAS.find(
              (c) =>
                c.descripcion ===
                item.cotizacion?.ComprobanteElectronico?.tipoComprobante
            )?.numero ?? "-";
          serieNum = item.cotizacion?.ComprobanteElectronico
            ? `${item.cotizacion?.ComprobanteElectronico.serie}-${item.cotizacion?.ComprobanteElectronico.numeroSerie}`
            : "-";
          tipoOperacion = "01";
          docRefId = `COT-${formatWithLeadingZeros(item.cotizacion?.id, 6)}`;
          cantidadSalida = cantidad.toFixed(5);
          puSalida = costoUnitarioSalida.toFixed(5);
          ptSalida = costoTotalSalida.toFixed(5);
        } else if (item.type === "merma") {
          fecha = item.comprobantesElectronico.fechaEmision;
          const cantidad = Number(item.cantidad || 0);
          const costoUnitarioSalida =
            saldoPrecioUnitarioPromedio > 0
              ? saldoPrecioUnitarioPromedio
              : Number(item.precioUnitario || 0) / 1.18;
          const costoTotalSalida = cantidad * costoUnitarioSalida;
          saldoCantidad -= cantidad;
          saldoPrecioTotal -= costoTotalSalida;
          saldoPrecioUnitarioPromedio =
            saldoCantidad > 0 ? saldoPrecioTotal / saldoCantidad : 0;
          detalle = "Merma";
          tipoCompNum = "0";
          serieNum =
            `${item.comprobantesElectronico?.serie}-${item.comprobantesElectronico.numeroSerie}` ||
            "-";
          tipoOperacion = "13";
          docRefId =
            `${item.comprobantesElectronico?.serie}-${item.comprobantesElectronico.numeroSerie}` ||
            "-";

          cantidadSalida = cantidad.toFixed(5);
          puSalida = costoUnitarioSalida.toFixed(5);
          ptSalida = costoTotalSalida.toFixed(5);
        }

        // Asignación de datos a las celdas
        rowData[1] = { v: fecha ? formatDate(fecha) : "", s: defaultStyle };
        rowData[2] = { v: detalle, s: defaultStyle };
        rowData[3] = { v: tipoCompNum, s: defaultStyle };
        rowData[4] = { v: serieNum, s: defaultStyle };
        rowData[5] = { v: docRefId, s: defaultStyle };
        rowData[6] = { v: tipoOperacion, s: defaultStyle };
        rowData[7] = { v: "01", s: defaultStyle };
        rowData[8] = { v: codUnidad, s: defaultStyle };
        rowData[9] = { v: cantidadEntrada, t: "n", s: numberStyle5Decimal };
        rowData[10] = { v: puEntrada, t: "n", s: numberStyle5Decimal };
        rowData[11] = { v: ptEntrada, t: "n", s: numberStyle5Decimal };
        rowData[12] = {
          v: cantidadSalida,
          t: "n",
          s: negativeNumberStyle5Decimal,
        };
        rowData[13] = { v: puSalida, t: "n", s: negativeNumberStyle5Decimal };
        rowData[14] = { v: ptSalida, t: "n", s: negativeNumberStyle5Decimal };
        rowData[15] = {
          v: saldoCantidad.toFixed(5),
          t: "n",
          s: numberStyle5Decimal,
        };
        rowData[16] = {
          v: saldoPrecioUnitarioPromedio.toFixed(5),
          t: "n",
          s: numberStyle5Decimal,
        };
        rowData[17] = {
          v: saldoPrecioTotal.toFixed(5),
          t: "n",
          s: numberStyle5Decimal,
        };
        dataRows.push(rowData);
      });

      // Añade las filas de datos
      XLSX.utils.sheet_add_aoa(worksheet, dataRows, {
        origin: `A${dataRowIndex + 1}`,
      });
      // Ajusta el contador de filas para el siguiente producto
      currentRow += 5 + transactions.length;
    });

    // --- AJUSTE FINAL DEL ANCHO DE COLUMNAS ---
    worksheet["!cols"] = [
      { width: 12 },
      { width: 12 },
      { width: 40 },
      { width: 12 },
      { width: 18 },
      { width: 16 },
      { width: 10 },
      { width: 12 },
      { width: 10 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
    ];

    // --- EXPORTACIÓN DEL ARCHIVO ---
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Kardex");
    XLSX.writeFile(workbook, `Reporte_Kardex_${dateRangeFilename}.xlsx`);
  },
};

export default ExcelKardex;
