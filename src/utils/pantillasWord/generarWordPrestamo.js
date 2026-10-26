import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import formatDate from "../../hooks/FormatDate";
import { numeroALetras } from "../../assets/numeroLetras";

export const generarDocumentoWordPrestamo = async (prestamo) => {
  try {
    const tipoPrestamo = prestamo.tipo_prestamo || "PRESTAMOS";
    const nombrePlantilla = tipoPrestamo === "SINIESTROS" ? "plantilla_siniestro.docx" : "plantilla_prestamo.docx";
    
    const response = await fetch(`/${nombrePlantilla}`);
    
    if (!response.ok) {
      throw new Error(`No se encontró la plantilla en /public/${nombrePlantilla}`);
    }
    
    const templateBytes = new Uint8Array(await response.arrayBuffer());
    const zip = new PizZip(templateBytes);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 1. Aseguramos que cronograma sea un array para evitar crashes
    const cuotas = prestamo.cronograma || [];

    // 2. Calcular el importe total
    const importeTotal = cuotas
      .reduce((acc, cuota) => acc + Number(cuota.importe_cuota || 0), 0)
      .toFixed(2);

    // 3. Manejo seguro de fechas (Fallback a la fecha actual si viene vacía)
    const fechaSol = prestamo.fecha_solicitud 
      ? new Date(prestamo.fecha_solicitud + "T00:00:00") 
      : new Date();
      
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // 4. Formatear el cronograma
    const cronogramaFormateado = cuotas.map((cuota) => ({
      numero_cuota: cuota.numero_cuota,
      importe_cuota: Number(cuota.importe_cuota).toFixed(2),
      fecha_descuento: cuota.fecha_descuento ? formatDate(cuota.fecha_descuento) : "-", 
    }));

    // 5. Mapear datos a las etiquetas del Word
    doc.render({
      dia: String(fechaSol.getDate()).padStart(2, "0"),
      mes: meses[fechaSol.getMonth()],
      year: fechaSol.getFullYear(),

      empresa: prestamo.colaborador?.empresa || "",
      ruc: prestamo.colaborador?.empresa === "Multinacional Services" 
             ? "20606198826" 
             : prestamo.colaborador?.empresa === "Granjas Peruanas" 
                ? "20614310694" // <-- Reemplaza con tus datos reales
                : "10436760693", 

      nombre_colaborador: `${prestamo.colaborador?.apellidos_colaborador || ""} ${prestamo.colaborador?.nombre_colaborador || ""}`,
      dni_colaborador: prestamo.colaborador?.dni_colaborador || "",

      importe_total: importeTotal,
      importe_letras: numeroALetras(importeTotal),
      fecha_desembolso: prestamo.fecha_desembolso ? formatDate(prestamo.fecha_desembolso) : "-",

      cronograma: cronogramaFormateado,
    });

    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Formatear el nombre del archivo final
    const prefijo = tipoPrestamo === "SINIESTROS" ? "Siniestro" : "Prestamo";
    const apellidoStr = prestamo.colaborador?.apellidos_colaborador ? `_${prestamo.colaborador.apellidos_colaborador}` : "";
    
    saveAs(out, `Formato_${prefijo}${apellidoStr}.docx`);

    return true;
  } catch (error) {
    console.error("Error al generar Word de Préstamo:", error);
    throw error;
  }
};