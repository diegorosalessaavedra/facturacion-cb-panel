import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import formatDate from "../../hooks/FormatDate";

// =========================================================================
// CARGA DE LOGO PNG
// =========================================================================
const cargarLogoPng = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar la imagen desde: ${url}`);

  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const alturaTarget = 50;
      const ratio = img.naturalWidth / img.naturalHeight;
      const anchoTarget = Math.round(alturaTarget * ratio);
      resolve({ bytes, width: anchoTarget, height: alturaTarget });
    };
    img.onerror = () =>
      reject(new Error("Error al procesar las dimensiones de la imagen."));
    const blob = new Blob([buf], { type: "image/png" });
    img.src = URL.createObjectURL(blob);
  });
};

// =========================================================================
// XML DEL DIBUJO INLINE
// =========================================================================
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
              <a:blip r:embed="rIdLogo100" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
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

// =========================================================================
// LÓGICA DE SALDOS DE VACACIONES
// =========================================================================
const calcularSaldosPorPeriodo = (
  fechaInicioStr,
  vacacionesArr,
  idVacacionActual,
) => {
  if (!fechaInicioStr) return [];

  const inicio = new Date(fechaInicioStr + "T00:00:00");
  const hoy = new Date();

  let periodos = [];
  let currentYear = inicio.getFullYear();
  let endYear = hoy.getFullYear();

  for (let year = currentYear; year <= endYear; year++) {
    let startOfPeriod = new Date(year, 0, 1);
    if (year === currentYear) {
      startOfPeriod = new Date(inicio);
    }

    let endOfPeriod = new Date(year, 11, 31);
    if (year === endYear) {
      endOfPeriod = new Date(hoy);
    }

    const diffTime = endOfPeriod.getTime() - startOfPeriod.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let diasGanados = Math.round((diffDays / 365) * 15);

    if (diasGanados > 0) {
      periodos.push({
        label: year.toString(),
        disponible: diasGanados,
      });
    }
  }

  let historialOrdenado = [];
  if (vacacionesArr && Array.isArray(vacacionesArr)) {
    historialOrdenado = [...vacacionesArr].sort((a, b) => {
      return (
        new Date(a.fecha_inicio + "T00:00:00") -
        new Date(b.fecha_inicio + "T00:00:00")
      );
    });
  }

  for (const vac of historialOrdenado) {
    if (String(vac.id) === String(idVacacionActual)) {
      break;
    }

    let diasADescontar = Number(vac.dias_totales) || 0;

    for (let p of periodos) {
      if (diasADescontar <= 0) break;
      if (p.disponible > 0) {
        if (diasADescontar >= p.disponible) {
          diasADescontar -= p.disponible;
          p.disponible = 0;
        } else {
          p.disponible -= diasADescontar;
          diasADescontar = 0;
        }
      }
    }
  }

  return periodos.filter((p) => p.disponible > 0);
};

export const generarDocumentoWordVacaciones = async (
  tipo_solicitud,
  selectColaborador,
  selectVacacion,
) => {
  try {
    // -----------------------------------------------------------------------
    // IMPORTANTE: Usar la plantilla corregida (plantilla_vacaciones_fixed.docx)
    // que tiene {logo}, {uso_efectivo} y {compensacion} en runs unificados.
    // -----------------------------------------------------------------------
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
      // 1. Guardar la imagen en word/media/
      zip.file("word/media/logo_body.png", logoPngBytes, { binary: true });

      // 2. Agregar la relación en document.xml.rels
      const relsPath = "word/_rels/document.xml.rels";
      let relsXml = zip.file(relsPath)?.asText() || "";
      if (relsXml && !relsXml.includes('Target="media/logo_body.png"')) {
        const relacionLogo = `  <Relationship Id="rIdLogo100" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo_body.png"/>\n</Relationships>`;
        relsXml = relsXml.replace("</Relationships>", relacionLogo);
        zip.file(relsPath, relsXml);
      }

      // 3. Reemplazar {logo} por el XML del dibujo ANTES de que docxtemplater lo procese.
      //    La plantilla ahora usa {logo} (sin %) para que no sea interpretado como loop.
      //    Hacemos el reemplazo a nivel de XML crudo.
      let documentXml = zip.file("word/document.xml")?.asText() || "";
      const drawingXml = buildDrawingXml(logoWidth, logoHeight);
      if (documentXml) {
        // FIX: Cerramos temporalmente <w:t>, insertamos el dibujo (que quedará dentro de <w:r>),
        // y volvemos a abrir <w:t> para mantener la validez del XML.
        documentXml = documentXml.replace(
          /\{logo\}/g,
          `</w:t>${drawingXml}<w:t>`,
        );
        zip.file("word/document.xml", documentXml);
      }

      // 4. Registrar extensión PNG en Content_Types si no existe
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
      // Si no hay logo, limpiar la etiqueta {logo} del XML para que no aparezca impresa
      let documentXml = zip.file("word/document.xml")?.asText() || "";
      if (documentXml) {
        documentXml = documentXml.replace(/\{logo\}/g, "");
        zip.file("word/document.xml", documentXml);
      }
    }

    // -----------------------------------------------------------------------
    // Renderizar con docxtemplater
    // El logo ya fue procesado arriba; pasamos logo: "" solo como seguridad.
    // uso_efectivo y compensacion ahora están en runs limpios en la plantilla
    // y se renderizan correctamente con "X" o " ".
    // -----------------------------------------------------------------------
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

    const periodosConSaldo = calcularSaldosPorPeriodo(
      primerContrato?.fecha_inicio,
      selectColaborador.vacaciones,
      selectVacacion.id,
    );

    const p1 =
      periodosConSaldo.length > 0
        ? periodosConSaldo[0]
        : { label: "", disponible: "" };
    const p2 =
      periodosConSaldo.length > 1
        ? periodosConSaldo[1]
        : { label: "", disponible: "" };
    console.log(tipo_solicitud === "PROGRAMADAS");

    doc.render({
      logo: "", // La etiqueta ya fue eliminada del XML arriba; este valor no se usa

      nombre: selectColaborador.nombre_colaborador || "",
      empresa:
        selectColaborador.empresa === "Granjas Peruanas"
          ? "GRANJAS PERUANAS CHICKENBABY S.A.C. - 20614310694"
          : selectColaborador.empresa === "Multinacional Services"
            ? "MULTINACIONAL SERVICE CORP S.A.C. - 20606198826"
            : "DIEGO ALONSO ROSALES SAAVEDRA - 10436760693",
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

      periodo_1: p1.label,
      dias_1: p1.disponible,
      periodo_2: p2.label,
      dias_2: p2.disponible,

      // FIX: uso_efectivo y compensacion ahora están en runs unificados en la
      // plantilla corregida, por lo que docxtemplater los reemplaza correctamente.
      uso_efectivo: selectVacacion.tipo_vaciones === "PROGRAMADAS" ? "X" : " ",
      compensacion: selectVacacion.tipo_vaciones === "COMPRA" ? "X" : " ",

      periodo: selectVacacion.year_vacaciones || "",
      dias: selectVacacion.dias_totales || "",
      fecha_inicio: formatDate(selectVacacion.fecha_inicio) || "",
      fecha_final: formatDate(selectVacacion.fecha_final) || "",
      compras_periodo:
        selectVacacion.tipo_vaciones === "COMPRA"
          ? selectVacacion.year_vacaciones
          : " ",
      compras_dia:
        selectVacacion.tipo_vaciones === "COMPRA" ? selectVacacion.dias : " ",
    });

    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(
      out,
      `Formato_${selectVacacion.tipo_vaciones}_Vacaciones_${selectColaborador.nombre_colaborador}.docx`,
    );

    return true;
  } catch (error) {
    console.error("Error crítico al generar Word:", error);
    throw error;
  }
};
