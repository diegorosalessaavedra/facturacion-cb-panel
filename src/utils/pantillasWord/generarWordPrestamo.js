import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import formatDate from "../../hooks/FormatDate";
import { numeroALetras } from "../../assets/numeroLetras";

// Función auxiliar simple para convertir números a letras (Soles)

export const generarDocumentoWordPrestamo = async (prestamo) => {
  try {
    const response = await fetch("/plantilla_prestamo.docx");
    if (!response.ok) {
      throw new Error("No se encontró la plantilla en /public/plantilla_prestamo.docx");
    }
    const templateBytes = new Uint8Array(await response.arrayBuffer());
    const zip = new PizZip(templateBytes);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 1. Calcular el importe total sumando las cuotas del cronograma
    const importeTotal = prestamo.cronograma
      .reduce((acc, cuota) => acc + Number(cuota.importe_cuota), 0)
      .toFixed(2);

    // 2. Extraer fecha de solicitud para la cabecera (Lima, {dia} de {mes} del {year})
    const fechaSol = new Date(prestamo.fecha_solicitud + "T00:00:00");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // 3. Formatear el cronograma para docxtemplater
    const cronogramaFormateado = prestamo.cronograma.map((cuota) => ({
      numero_cuota: cuota.numero_cuota,
      importe_cuota: Number(cuota.importe_cuota).toFixed(2),
      fecha_descuento: formatDate(cuota.fecha_descuento), // Usando tu hook
    }));

    // 4. Mapear datos a las etiquetas del Word
    doc.render({
      dia: String(fechaSol.getDate()).padStart(2, "0"),
      mes: meses[fechaSol.getMonth()],
      year: fechaSol.getFullYear(),

      empresa: prestamo.colaborador.empresa,
      ruc: prestamo.colaborador.empresa === "Multinacional Services" 
             ? "20606198826" // Reemplaza con los reales según la lógica de tu empresa
             : "RUC_AQUI", 

      nombre_colaborador: `${prestamo.colaborador.apellidos_colaborador} ${prestamo.colaborador.nombre_colaborador}`,
      dni_colaborador: prestamo.colaborador.dni_colaborador,

      importe_total: importeTotal,
      importe_letras: numeroALetras(importeTotal),
      fecha_desembolso: formatDate(prestamo.fecha_desembolso),

      cronograma: cronogramaFormateado,
    });

    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(out, `Formato_Prestamo_${prestamo.colaborador.apellidos_colaborador}.docx`);

    return true;
  } catch (error) {
    console.error("Error al generar Word de Préstamo:", error);
    throw error;
  }
};