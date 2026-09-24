import * as XLSX from "xlsx-js-style";

// --- CONSTANTES Y FORMATOS ---
const formatMoneda = '"S/" #,##0.00';
const formatCantidad = "#,##0";

// --- ESTILOS PARA LAS CELDAS DE EXCEL ---
const STYLES = {
  TITLE: {
    font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "0F172A" } }, // slate-900
  },
  SUBTITLE: {
    font: { bold: true, sz: 11, color: { rgb: "475569" } }, // slate-600
    alignment: { horizontal: "center", vertical: "center" },
  },
  HEADER_DARK: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "1E293B" } }, // slate-800
    border: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  HEADER_GREEN: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "16A34A" } }, // green-600
    border: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  HEADER_AMBER: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "D97706" } }, // amber-600
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
  CELL_MONEY: {
    font: { sz: 10, color: { rgb: "334155" } },
    alignment: { horizontal: "right", vertical: "center" },
    numFmt: formatMoneda, // S/ 0.00
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  CELL_MONEY_TOTAL: {
    font: { bold: true, sz: 10, color: { rgb: "0F172A" } }, // slate-900 (Negrita)
    alignment: { horizontal: "right", vertical: "center" },
    numFmt: formatMoneda,
    fill: { fgColor: { rgb: "FEF3C7" } }, // ámbar muy suave de fondo
    border: {
      top: { style: "thin", color: { rgb: "CBD5E1" } },
      bottom: { style: "thin", color: { rgb: "CBD5E1" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  // --- NUEVOS ESTILOS PARA LA FILA FINAL DE SUMATORIAS ---
  TOTAL_LABEL: {
    font: { bold: true, sz: 10, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "right", vertical: "center" },
    fill: { fgColor: { rgb: "1E293B" } }, // slate-800
    border: {
      top: { style: "medium", color: { rgb: "94A3B8" } },
      bottom: { style: "medium", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } },
    },
  },
  TOTAL_VALUE: {
    font: { bold: true, sz: 10, color: { rgb: "0F172A" } },
    alignment: { horizontal: "right", vertical: "center" },
    numFmt: formatMoneda,
    fill: { fgColor: { rgb: "F1F5F9" } }, // slate-100 claro
    border: {
      top: { style: "medium", color: { rgb: "94A3B8" } },
      bottom: { style: "medium", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
  TOTAL_EMPTY: {
    fill: { fgColor: { rgb: "F1F5F9" } },
    border: {
      top: { style: "medium", color: { rgb: "94A3B8" } },
      bottom: { style: "medium", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "CBD5E1" } },
      right: { style: "thin", color: { rgb: "CBD5E1" } },
    },
  },
};

export const generarExcelResumenPlanilla = (colaboradores, dataSemana) => {
  try {
    const wb = XLSX.utils.book_new();

    // --- 1. AGRUPAR COLABORADORES POR EMPRESA Y LUEGO POR RÉGIMEN ---
    const grupos = {};

    colaboradores.forEach((colab) => {
      const empresa = colab.empresa || "Sin Empresa";

      // Usar el régimen que viene directamente del backend
      const esAdministrativo =
        colab.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS" ||
        colab.cargo_laboral_id === 2;
      const regimen =
        colab.regimen || (esAdministrativo ? "PLANILLA" : "LOCADOR");

      // Inicializar estructura
      if (!grupos[empresa]) grupos[empresa] = {};
      if (!grupos[empresa][regimen]) grupos[empresa][regimen] = [];

      grupos[empresa][regimen].push(colab);
    });

    const textoSemana = dataSemana
      ? `SEMANA ${dataSemana.numero_semana || ""} - ${dataSemana.mes_planilla?.mes || ""} ${dataSemana.year_planilla?.year || ""}`
      : "";

    // --- 2. ITERAR SOBRE LOS GRUPOS PARA CREAR LAS HOJAS ---
    Object.keys(grupos).forEach((empresa) => {
      Object.keys(grupos[empresa]).forEach((regimen) => {
        const colabsGrupo = grupos[empresa][regimen];
        if (colabsGrupo.length === 0) return;

        const wsData = [];

        // FILA 1: Título Principal
        const tituloHoja = `RESUMEN DE PLANILLA - ${empresa.toUpperCase()} (${regimen})`;
        wsData.push([{ v: tituloHoja, s: STYLES.TITLE }]);

        // FILA 2: Subtítulo (Periodo)
        wsData.push([{ v: textoSemana, s: STYLES.SUBTITLE }]);

        // FILA 3: Espacio en blanco
        wsData.push([]);

        // FILA 4: Cabeceras
        wsData.push([
          { v: "REGIMEN", s: STYLES.HEADER_DARK },
          { v: "GRUPO", s: STYLES.HEADER_DARK },
          { v: "APELLIDOS Y NOMBRES", s: STYLES.HEADER_DARK },
          { v: "DNI", s: STYLES.HEADER_DARK },
          { v: "BCO", s: STYLES.HEADER_DARK },
          { v: "Nº CUENTA BCO", s: STYLES.HEADER_DARK },
          { v: "BRUTO", s: STYLES.HEADER_GREEN },
          { v: "ASIG. FAM", s: STYLES.HEADER_GREEN },
          { v: "ONP - AFP", s: STYLES.HEADER_GREEN },
          { v: "DESCUENTOS", s: STYLES.HEADER_GREEN },
          { v: "TOTAL POR PAGAR", s: STYLES.HEADER_AMBER },
          { v: "ADICIONALES", s: STYLES.HEADER_DARK },
          { v: "Nº DESTINO", s: STYLES.HEADER_DARK },
        ]);

        // --- VARIABLES ACUMULADORAS PARA LA SUMA FINAL ---
        let sumBruto = 0;
        let sumAsigFam = 0;
        let sumOnpAfp = 0;
        let sumDescuentos = 0;
        let sumTotalPagar = 0;
        let sumAdicionales = 0;

        // FILA 5+: Datos
        colabsGrupo.forEach((colab) => {
          const totales =
            colab.totales_asistencia_administrativas?.length > 0
              ? colab.totales_asistencia_administrativas[0]
              : null;

          const salarioBruto = Number(totales?.salario_total || 0);

          let asigFam = Number(colab.asignacion_familiar || 0);
          if (dataSemana?.totalSemanas && dataSemana.totalSemanas > 0) {
            asigFam = asigFam / Number(dataSemana.totalSemanas);
          }

          const pensionEncontrada = [
            colab.afp_integra,
            colab.afp_prima,
            colab.afp_horizonte,
            colab.afp_profuturo,
            colab.afp_habitat,
            colab.onp,
          ].find((monto) => Number(monto) > 0);

          const porcentajePension = Number(pensionEncontrada || 0);
          const montoPension = (salarioBruto * porcentajePension) / 100;
          const descuentos = 0;
          const totalPagar = salarioBruto + asigFam - montoPension - descuentos;

          const adicionales = Number(totales?.adicionales_total || 0);
          const numeroDestino =
            totales?.numero_destino && totales.numero_destino !== 0
              ? totales.numero_destino
              : "Sin número";

          const esAdministrativo =
            colab.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS" ||
            colab.cargo_laboral_id === 2;
          const grupo = esAdministrativo ? "ADMINISTRATIVOS" : "OPERATIVOS";

          const nombreCompleto =
            `${colab.apellidos_colaborador || ""} ${colab.nombre_colaborador || ""}`.trim();

          // Acumulamos los valores
          sumBruto += salarioBruto;
          sumAsigFam += asigFam;
          sumOnpAfp += montoPension;
          sumDescuentos += descuentos;
          sumTotalPagar += totalPagar;
          sumAdicionales += adicionales;

          // Helper para decidir si se renderiza como Moneda (Número) o como String ("-")
          const renderCurrency = (val, style) => {
            return val > 0
              ? { v: val, t: "n", s: style }
              : { v: "-", t: "s", s: STYLES.CELL_DATA };
          };

          wsData.push([
            { v: regimen, t: "s", s: STYLES.CELL_DATA },
            { v: grupo, t: "s", s: STYLES.CELL_DATA },
            { v: nombreCompleto, t: "s", s: STYLES.CELL_DATA_LEFT },
            { v: colab.dni_colaborador || "-", t: "s", s: STYLES.CELL_DATA },
            { v: colab.bco || "SIN BANCO", t: "s", s: STYLES.CELL_DATA },
            {
              v: colab.nro_cuenta || "SIN CUENTA",
              t: "s",
              s: STYLES.CELL_DATA,
            },
            renderCurrency(salarioBruto, STYLES.CELL_MONEY),
            renderCurrency(asigFam, STYLES.CELL_MONEY),
            renderCurrency(montoPension, STYLES.CELL_MONEY),
            renderCurrency(descuentos, STYLES.CELL_MONEY),
            renderCurrency(totalPagar, STYLES.CELL_MONEY_TOTAL),
            renderCurrency(adicionales, STYLES.CELL_MONEY),
            { v: numeroDestino, t: "s", s: STYLES.CELL_DATA },
          ]);
        });

        // --- FILA FINAL: TOTALES ---
        wsData.push([
          { v: "TOTALES GENERALES:", t: "s", s: STYLES.TOTAL_LABEL }, // REGIMEN (Esta y las sigs 5 celdas se combinarán)
          { v: "", t: "s", s: STYLES.TOTAL_LABEL }, // GRUPO
          { v: "", t: "s", s: STYLES.TOTAL_LABEL }, // APELLIDOS
          { v: "", t: "s", s: STYLES.TOTAL_LABEL }, // DNI
          { v: "", t: "s", s: STYLES.TOTAL_LABEL }, // BCO
          { v: "", t: "s", s: STYLES.TOTAL_LABEL }, // CUENTA BCO
          { v: sumBruto, t: "n", s: STYLES.TOTAL_VALUE },
          { v: sumAsigFam, t: "n", s: STYLES.TOTAL_VALUE },
          { v: sumOnpAfp, t: "n", s: STYLES.TOTAL_VALUE },
          { v: sumDescuentos, t: "n", s: STYLES.TOTAL_VALUE },
          {
            v: sumTotalPagar,
            t: "n",
            s: { ...STYLES.TOTAL_VALUE, fill: { fgColor: { rgb: "FEF3C7" } } },
          }, // Destacado
          { v: sumAdicionales, t: "n", s: STYLES.TOTAL_VALUE },
          { v: "", t: "s", s: STYLES.TOTAL_EMPTY }, // DESTINO vacío
        ]);

        // Crear hoja y asignar datos
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        const rowTotalesIndex = wsData.length - 1;

        // Merges de Título, Subtítulo y la fila de Totales
        ws["!merges"] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }, // Título ocupa de A a M
          { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } }, // Subtítulo ocupa de A a M
          { s: { r: rowTotalesIndex, c: 0 }, e: { r: rowTotalesIndex, c: 5 } }, // Texto "TOTALES GENERALES" ocupa columnas A hasta F
        ];

        // Ajustar anchos de columnas
        ws["!cols"] = [
          { wch: 18 }, // REGIMEN
          { wch: 18 }, // GRUPO
          { wch: 40 }, // APELLIDOS Y NOMBRES
          { wch: 12 }, // DNI
          { wch: 15 }, // BCO
          { wch: 22 }, // Nº CUENTA BCO
          { wch: 15 }, // BRUTO
          { wch: 15 }, // ASIG. FAM
          { wch: 15 }, // ONP - AFP
          { wch: 15 }, // DESCUENTOS
          { wch: 18 }, // TOTAL POR PAGAR
          { wch: 15 }, // ADICIONALES
          { wch: 15 }, // Nº DESTINO
        ];

        // Nombre de la hoja (Excel tiene un límite de 31 caracteres para los nombres de las pestañas)
        let sheetName = `${empresa.substring(0, 15)}_${regimen.substring(0, 10)}`;
        sheetName = sheetName.replace(/[^a-zA-Z0-9_]/g, "");

        // Añadir hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });
    });

    // --- 3. DESCARGA DEL ARCHIVO ---
    const nombreDescarga = dataSemana?.numero_semana
      ? `Resumen_Planilla_Sem_XLSX_${dataSemana.numero_semana}.xlsx`
      : "Resumen_Planilla.xlsx";

    XLSX.writeFile(wb, nombreDescarga);
    return true;
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    throw error;
  }
};
