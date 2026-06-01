import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import formatDate from "../../hooks/FormatDate";

// Carga el logo PNG y retorna { bytes: Uint8Array, width, height }
const cargarLogoPng = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);
        const alturaTarget = 50;
        const ratio = img.naturalWidth / img.naturalHeight;
        const anchoTarget = Math.round(alturaTarget * ratio);
        resolve({ bytes, width: anchoTarget, height: alturaTarget });
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = url;
  });

const buildDrawingXml = (widthPt, heightPt) => {
  const cx = Math.round(widthPt * 12700);
  const cy = Math.round(heightPt * 12700);
  return `<w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
      <wp:extent cx="${cx}" cy="${cy}"/>
      <wp:effectExtent l="0" t="0" r="0" b="0"/>
      <wp:docPr id="100" name="logo"/>
      <wp:cNvGraphicFramePr>
        <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
      </wp:cNvGraphicFramePr>
      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:nvPicPr>
              <pic:cNvPr id="101" name="logo"/>
              <pic:cNvPicPr/>
            </pic:nvPicPr>
            <pic:blipFill>
              <a:blip r:embed="rId10" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
              <a:stretch><a:fillRect/></a:stretch>
            </pic:blipFill>
            <pic:spPr>
              <a:xfrm>
                <a:off x="0" y="0"/>
                <a:ext cx="${cx}" cy="${cy}"/>
              </a:xfrm>
              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            </pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing>`;
};

const buildHeaderRels = () =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId10" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo_header.png"/>
</Relationships>`;

// =========================================================================
// NUEVA LÓGICA INFALIBLE: CÁLCULO PROPORCIONAL Y DESCUENTO HISTÓRICO
// =========================================================================
const calcularSaldosPorPeriodo = (
  fechaInicioStr,
  vacacionesArr,
  idVacacionActual,
) => {
  if (!fechaInicioStr) return [];

  // Evitamos problemas de zona horaria forzando la hora a las 00:00:00
  const inicio = new Date(fechaInicioStr + "T00:00:00");
  const hoy = new Date();

  let periodos = [];
  let currentYear = inicio.getFullYear();
  let endYear = hoy.getFullYear();

  // 1. Calculamos los días ganados por año calendario (Ej. 2024, 2025, 2026)
  for (let year = currentYear; year <= endYear; year++) {
    let startOfPeriod = new Date(year, 0, 1); // 1 de enero
    if (year === currentYear) {
      startOfPeriod = new Date(inicio); // Si es el año inicial, empieza en la fecha de contrato
    }

    let endOfPeriod = new Date(year, 11, 31); // 31 de diciembre
    if (year === endYear) {
      endOfPeriod = new Date(hoy); // Si es el año actual, corta el día de hoy
    }

    // Diferencia en días
    const diffTime = endOfPeriod.getTime() - startOfPeriod.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para ser inclusivo

    // Regla de 3 simple: Si por 365 días tocan 15, por diffDays tocan X
    let diasGanados = Math.round((diffDays / 365) * 15);

    if (diasGanados > 0) {
      periodos.push({
        label: year.toString(),
        disponible: diasGanados,
      });
    }
  }

  // 2. Ordenar TODAS las vacaciones de la más antigua a la más reciente
  let historialOrdenado = [];
  if (vacacionesArr && Array.isArray(vacacionesArr)) {
    historialOrdenado = [...vacacionesArr].sort((a, b) => {
      return (
        new Date(a.fecha_inicio + "T00:00:00") -
        new Date(b.fecha_inicio + "T00:00:00")
      );
    });
  }

  // 3. Descontar los días usados en el pasado ANTES de la vacación actual
  for (const vac of historialOrdenado) {
    // Si llegamos a la vacación que queremos imprimir AHORA, nos detenemos.
    if (String(vac.id) === String(idVacacionActual)) {
      break;
    }

    let diasADescontar = Number(vac.dias_totales) || 0;

    // Repartir la resta desde el año más antiguo
    for (let p of periodos) {
      if (diasADescontar <= 0) break;
      if (p.disponible > 0) {
        if (diasADescontar >= p.disponible) {
          diasADescontar -= p.disponible;
          p.disponible = 0; // Se agotaron los días de este año
        } else {
          p.disponible -= diasADescontar;
          diasADescontar = 0;
        }
      }
    }
  }

  // 4. Retornamos solo los periodos que aún conservan días libres (disponible > 0)
  return periodos.filter((p) => p.disponible > 0);
};
// =========================================================================

export const generarDocumentoWordVacaciones = async (
  tipo_solicitud,
  selectColaborador,
  selectVacacion,
) => {
  try {
    const response = await fetch("/plantilla_vacaciones.docx");
    if (!response.ok) {
      throw new Error(
        "No se encontró la plantilla en /public/plantilla_vacaciones.docx",
      );
    }
    const templateBytes = new Uint8Array(await response.arrayBuffer());

    let logoPngBytes = null;
    let logoWidth = 150;
    let logoHeight = 50;
    try {
      const url =
        selectColaborador.empresa === "Granjas Peruanas"
          ? "/logo.png"
          : selectColaborador.empresa === "Multinacional Services"
            ? "/logoM.png"
            : "/logoDiego.png";
      if (url) {
        const resultado = await cargarLogoPng(url);
        logoPngBytes = resultado.bytes;
        logoWidth = resultado.width;
        logoHeight = resultado.height;
      }
    } catch (e) {
      console.warn("⚠️ No se pudo cargar el logo:", e.message);
    }

    const zip = new PizZip(templateBytes);

    if (logoPngBytes) {
      zip.file("word/media/logo_header.png", logoPngBytes, { binary: true });
      zip.file("word/_rels/header1.xml.rels", buildHeaderRels());

      const headerXml = zip.file("word/header1.xml").asText();
      const drawingXml = buildDrawingXml(logoWidth, logoHeight);
      const headerModificado = headerXml.replace(
        /<w:t[^>]*>\{%logo\}<\/w:t>/,
        drawingXml,
      );

      if (headerModificado !== headerXml) {
        zip.file("word/header1.xml", headerModificado);
      }

      const contentTypesXml = zip.file("[Content_Types].xml").asText();
      if (!contentTypesXml.includes('Extension="png"')) {
        zip.file(
          "[Content_Types].xml",
          contentTypesXml.replace(
            "</Types>",
            '  <Default Extension="png" ContentType="image/png"/>\n</Types>',
          ),
        );
      }
    } else {
      const headerXml = zip.file("word/header1.xml").asText();
      zip.file(
        "word/header1.xml",
        headerXml.replace(/<w:t[^>]*>\{%logo\}<\/w:t>/, "<w:t/>"),
      );
    }

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const primerContrato = selectColaborador.contratos?.[0];
    const fechaIngreso = primerContrato?.fecha_inicio
      ? formatDate(primerContrato.fecha_inicio)
      : "Sin registrar";

    const fechaHoy = new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // EJECUCIÓN DEL CÁLCULO
    const periodosConSaldo = calcularSaldosPorPeriodo(
      primerContrato?.fecha_inicio,
      selectColaborador.vacaciones,
      selectVacacion.id,
    );

    // Extraemos los dos primeros periodos con días libres
    const p1 =
      periodosConSaldo.length > 0
        ? periodosConSaldo[0]
        : { label: "", disponible: "" };
    const p2 =
      periodosConSaldo.length > 1
        ? periodosConSaldo[1]
        : { label: "", disponible: "" };

    doc.render({
      nombre: selectColaborador.nombre_colaborador || "",
      empresa:
        selectColaborador.empresa === "Granjas Peruanas"
          ? "GRANJAS PERUANAS S.A.C."
          : selectColaborador.empresa === "Multinacional Services"
            ? "MULTINACIONAL SERVICES S.A.C."
            : selectColaborador.empresa || "",
      cargo:
        selectColaborador.cargo_laboral?.cargo || "Área/Gerencia no asignada",
      fecha_ingreso: fechaIngreso,
      fecha_solicitud: selectVacacion.fecha_solicitud
        ? formatDate(selectVacacion.fecha_solicitud)
        : "",
      correlativo: selectVacacion.id
        ? `  ${selectVacacion.id}-${new Date().getFullYear()}`
        : "",
      fecha_hoy: fechaHoy,

      // === IMPRESIÓN DINÁMICA DE LOS PERIODOS ===
      periodo_1: p1.label,
      dias_1: p1.disponible,

      periodo_2: p2.label,
      dias_2: p2.disponible,
      // ==========================================

      uso_efectivo: tipo_solicitud === "PROGRAMADAS" ? "X" : " ",
      compensacion: tipo_solicitud === "COMPRA" ? "X" : " ",

      periodo: selectVacacion.year_vacaciones || "",
      dias: selectVacacion.dias_totales || "",
      fecha_inicio: selectVacacion.fecha_inicio || "",
      fecha_final: selectVacacion.fecha_final || "",
      compras_periodo:
        selectVacacion.tipo_solicitud === "COMPRA"
          ? selectVacacion.year_vacaciones
          : " ",
      compras_dia:
        selectVacacion.tipo_solicitud === "COMPRA" ? selectVacacion.dias : " ",
    });

    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(
      out,
      `Formato_${tipo_solicitud}_Vacaciones_${selectColaborador.nombre_colaborador}.docx`,
    );

    return true;
  } catch (error) {
    console.error("Error crítico al generar Word:", error);
    throw error;
  }
};
