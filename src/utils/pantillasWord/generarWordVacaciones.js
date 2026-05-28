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
        // Altura fija 50pt, ancho proporcional
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

// XML del <w:drawing> con dimensiones dinámicas en EMUs (1pt = 12700 EMUs)
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

// Relaciones del header apuntando a la imagen
const buildHeaderRels = () =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId10" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo_header.png"/>
</Relationships>`;

export const generarDocumentoWordVacaciones = async (
  tipo_solicitud,
  selectColaborador,
  selectVacacion,
) => {
  try {
    // 1. Cargar plantilla
    const response = await fetch("/plantilla_vacaciones.docx");
    if (!response.ok) {
      throw new Error(
        "No se encontró la plantilla en /public/plantilla_vacaciones.docx",
      );
    }
    const templateBytes = new Uint8Array(await response.arrayBuffer());

    // 2. Cargar logo PNG directamente (ya debe ser PNG)
    let logoPngBytes = null;
    let logoWidth = 150;
    let logoHeight = 50;
    try {
      const url = import.meta.env.VITE_LOGO;
      if (url) {
        const resultado = await cargarLogoPng(url);
        logoPngBytes = resultado.bytes;
        logoWidth = resultado.width;
        logoHeight = resultado.height;
        console.log(`✅ Logo cargado: ${logoWidth}x${logoHeight}pt`);
      }
    } catch (e) {
      console.warn("⚠️ No se pudo cargar el logo:", e.message);
    }

    // 3. Abrir ZIP
    const zip = new PizZip(templateBytes);

    // 4. Inyectar logo directamente en el ZIP
    if (logoPngBytes) {
      // 4a. Imagen PNG en word/media/
      zip.file("word/media/logo_header.png", logoPngBytes, { binary: true });

      // 4b. Relaciones del header
      zip.file("word/_rels/header1.xml.rels", buildHeaderRels());

      // 4c. Reemplazar {%logo} en header1.xml con <w:drawing> real
      const headerXml = zip.file("word/header1.xml").asText();
      const drawingXml = buildDrawingXml(logoWidth, logoHeight);
      const headerModificado = headerXml.replace(
        /<w:t[^>]*>\{%logo\}<\/w:t>/,
        drawingXml,
      );

      if (headerModificado === headerXml) {
        console.warn("⚠️ No se encontró {%logo} en header1.xml");
      } else {
        zip.file("word/header1.xml", headerModificado);
        console.log("✅ Logo inyectado en header");
      }

      // 4d. Registrar tipo PNG en [Content_Types].xml
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
      // Sin logo: limpiar el tag para no dejar texto suelto
      const headerXml = zip.file("word/header1.xml").asText();
      zip.file(
        "word/header1.xml",
        headerXml.replace(/<w:t[^>]*>\{%logo\}<\/w:t>/, "<w:t/>"),
      );
    }

    // 5. Docxtemplater solo para tags de texto
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 6. Preparar datos
    const primerContrato = selectColaborador.contratos?.[0];
    const fechaIngreso = primerContrato?.fecha_inicio
      ? formatDate(primerContrato.fecha_inicio)
      : "Sin registrar";

    const fechaHoy = new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // 7. Render
    doc.render({
      nombre: selectColaborador.nombre_colaborador || "",
      cargo:
        selectColaborador.cargo_laboral?.cargo || "Área/Gerencia no asignada",
      fecha_ingreso: fechaIngreso,
      correlativo: selectVacacion.id
        ? `  ${selectVacacion.id}-${new Date().getFullYear()}`
        : "",
      fecha_hoy: fechaHoy,
      uso_efectivo: tipo_solicitud === "SOLICITUD" ? "X" : " ",
      compensacion: tipo_solicitud === "COMPRA" ? "X" : " ",
      periodo: selectVacacion.year_vacaciones || "",
      dias: selectVacacion.dias_totales || "",
      fecha_inicio: selectVacacion.fecha_inicio || "",
      fecha_final: selectVacacion.fecha_final || "",
    });

    // 8. Descargar
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
