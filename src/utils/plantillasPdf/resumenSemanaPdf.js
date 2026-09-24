import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { numberPeru } from "../../assets/onInputs"; // Verifica que la ruta sea correcta

export const generarPDFResumenPlanilla = (colaboradores, dataSemana) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const margin = 2;
  const pageWidth = doc.internal.pageSize.width;

  // --- HELPERS PARA DATOS ---
  const formatMoney = (val) => {
    const num = Number(val);
    if (num > 0) return `S/    ${numberPeru(num)}`;
    return `S/    -`;
  };

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

    // Inicializar estructura si no existe
    if (!grupos[empresa]) grupos[empresa] = {};
    if (!grupos[empresa][regimen]) grupos[empresa][regimen] = [];

    // Llenar el grupo correspondiente
    grupos[empresa][regimen].push(colab);
  });

  // --- 2. ITERAR SOBRE LOS GRUPOS PARA CREAR LAS HOJAS ---
  let isFirstPage = true;

  Object.keys(grupos).forEach((empresa) => {
    Object.keys(grupos[empresa]).forEach((regimen) => {
      const colabsGrupo = grupos[empresa][regimen];

      // Si el grupo está vacío, pasamos al siguiente
      if (colabsGrupo.length === 0) return;

      // Si NO es la primera hoja, agregamos una nueva página
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;

      let currentY = 10;

      // --- LOGO CENTRADO ---
      try {
        const logoUrl = import.meta.env.VITE_LOGO;
        const logoWidth = 30;
        const logoHeight = 27;
        const xCentered = pageWidth / 2 - logoWidth / 2;
        if (logoUrl) {
          doc.addImage(
            logoUrl,
            "JPEG",
            xCentered,
            currentY,
            logoWidth,
            logoHeight,
          );
        }
      } catch (error) {
        console.warn("No se pudo cargar el logo", error);
      }

      currentY += 28;

      // --- CABECERA ---
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, currentY, pageWidth - margin * 2, 10, "F");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);

      const textoSemana = dataSemana
        ? `SEMANA ${dataSemana.numero_semana || ""} - ${dataSemana.mes_planilla?.mes || ""} ${dataSemana.year_planilla?.year || ""}`
        : "";

      // Mostramos Empresa y Régimen en el título para saber de qué hoja se trata
      doc.text(
        `RESUMEN DE PLANILLA - ${empresa.toUpperCase()} (${regimen}) | ${textoSemana}`,
        pageWidth / 2,
        currentY + 6.5,
        { align: "center" },
      );

      // Fecha de impresión
      currentY += 14;
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        pageWidth - margin,
        currentY,
        { align: "right" },
      );

      currentY += 4;

      // --- PREPARAR FILAS DE ESTE GRUPO ---
      const tableRows = colabsGrupo.map((colab) => {
        const totales =
          colab.totales_asistencia_administrativas?.length > 0
            ? colab.totales_asistencia_administrativas[0]
            : null;

        const salarioBruto = Number(totales?.salario_total || 0);

        // --- CÁLCULO ASIGNACIÓN FAMILIAR DIVIDIDA ---
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

        return [
          regimen,
          grupo,
          nombreCompleto,
          colab.dni_colaborador || "-",
          colab.bco || "SIN BANCO",
          colab.nro_cuenta || "SIN CUENTA",
          formatMoney(salarioBruto),
          formatMoney(asigFam),
          formatMoney(montoPension),
          formatMoney(descuentos),
          formatMoney(totalPagar),
          "", // Spacer column
          formatMoney(adicionales),
          numeroDestino,
        ];
      });

      // --- DIBUJAR TABLA PARA ESTA HOJA ---
      doc.autoTable({
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [
          [
            "REGIMEN",
            "GRUPO",
            "APELLIDOS Y NOMBRES",
            "DNI",
            "BCO",
            "Nº CUENTA BCO",
            "BRUTO",
            "ASIG. FAM",
            "ONP - AFP",
            "DESCUENTOS",
            "TOTAL POR PAGAR",
            "", // Spacer column
            "ADICIONALES",
            "Nº DESTINO",
          ],
        ],
        body: tableRows,
        theme: "plain",
        headStyles: {
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 6.5,
          halign: "center",
          valign: "middle",
        },
        styles: {
          fontSize: 6,
          cellPadding: { top: 2.5, right: 1, bottom: 2.5, left: 1 },
          valign: "middle",
          halign: "center",
          textColor: [71, 85, 105],
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 20 }, // REGIMEN (Un poco más chico)
          1: { cellWidth: 18 }, // GRUPO (Un poco más chico)
          2: { halign: "left", cellWidth: "auto" }, // NOMBRES ocupará todo el espacio restante automáticamente
          3: { cellWidth: 15 }, // DNI
          4: { cellWidth: 15 }, // BCO
          5: { cellWidth: 18 }, // N CUENTA
          6: { halign: "right", cellWidth: "wrap" }, // BRUTO - "wrap" forzará a que no se corte
          7: { halign: "right", cellWidth: "wrap" }, // ASIG. FAM
          8: { halign: "right", cellWidth: "wrap" }, // ONP - AFP
          9: { halign: "right", cellWidth: "wrap" }, // DESCUENTOS
          10: { halign: "right", fontStyle: "bold", cellWidth: "wrap" }, // TOTAL
          11: { cellWidth: 3 }, // Spacer
          12: { halign: "right", cellWidth: "wrap" }, // ADICIONALES
          13: { cellWidth: 15 }, // N DESTINO
        },
        didParseCell: (data) => {
          if (data.section === "head") {
            data.cell.styles.lineWidth = 0;
            if (data.column.index >= 0 && data.column.index <= 5) {
              data.cell.styles.fillColor = [30, 41, 59]; // Gris oscuro vibrante
            } else if (data.column.index >= 6 && data.column.index <= 9) {
              data.cell.styles.fillColor = [34, 197, 94]; // Verde vibrante
            } else if (data.column.index === 10) {
              data.cell.styles.fillColor = [245, 158, 11]; // Naranja vibrante
            } else if (data.column.index === 11) {
              data.cell.styles.fillColor = [255, 255, 255]; // Espaciador visual transparente
            } else if (data.column.index >= 12) {
              data.cell.styles.fillColor = [30, 41, 59]; // Gris oscuro vibrante
            }
          }

          if (data.section === "body") {
            // Aplicar línea de borde inferior a todas menos al spacer
            if (data.column.index !== 11) {
              data.cell.styles.lineWidth = { bottom: 0.1 };
              data.cell.styles.lineColor = [203, 213, 225];
            }

            if (data.column.index === 1) {
              if (data.cell.raw === "ADMINISTRATIVOS") {
                data.cell.styles.textColor = [147, 51, 234]; // Morado intenso
                data.cell.styles.fontStyle = "bold";
              } else if (data.cell.raw === "OPERATIVOS") {
                data.cell.styles.textColor = [234, 88, 12]; // Naranja intenso
                data.cell.styles.fontStyle = "bold";
              }
            }

            // Opacar campos nulos
            if (
              data.cell.raw === "S/    -" ||
              data.cell.raw === "-" ||
              data.cell.raw === "SIN BANCO" ||
              data.cell.raw === "SIN CUENTA" ||
              data.cell.raw === "Sin número"
            ) {
              data.cell.styles.textColor = [156, 163, 175];
            }

            // Resaltar Total general
            if (data.column.index === 10 && data.cell.raw !== "S/    -") {
              data.cell.styles.textColor = [15, 23, 42];
            }
          }
        },
      });
    });
  });

  // --- PIE DE PÁGINA (Paginación final) ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.height - 8,
      { align: "right" },
    );
  }

  // --- DESCARGA ---
  const nombreDescarga = dataSemana?.numero_semana
    ? `Resumen_Planilla_Semana_${dataSemana.numero_semana}.pdf`
    : "Resumen_Planilla.pdf";

  doc.save(nombreDescarga);
};
