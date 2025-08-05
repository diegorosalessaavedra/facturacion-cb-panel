import jsPDF from "jspdf";
import "jspdf-autotable";

// --- Configuración de iconos ---
const iconsPath = {
  user: "/icons/user.svg",
  dni: "/icons/dni.svg",
  email: "/icons/email.svg",
  phone: "/icons/phone.svg",
  map: "/icons/map.svg",
  point: "/icons/point.svg",
  cake: "/icons/cake.svg",
  briefcase: "/icons/briefcase.svg",
};

const iconCache = {};

/**
 * Carga un icono SVG con manejo de errores mejorado
 */
const loadIcon = async (url, size = 32) => {
  if (iconCache[url]) {
    return iconCache[url];
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`No se pudo cargar el icono: ${url}`);
      return null;
    }

    const svgText = await response.text();
    const img = new Image();
    const svgBlob = new Blob([svgText], {
      type: "image/svg+xml;charset=utf-8",
    });
    const domUrl = window.URL.createObjectURL(svgBlob);

    const pngDataUrl = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Timeout loading icon"));
      }, 5000);

      img.onload = () => {
        clearTimeout(timeoutId);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        window.URL.revokeObjectURL(domUrl);
        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = (err) => {
        clearTimeout(timeoutId);
        window.URL.revokeObjectURL(domUrl);
        reject(err);
      };

      img.src = domUrl;
    });

    iconCache[url] = pngDataUrl;
    return pngDataUrl;
  } catch (error) {
    console.error(`Error loading icon from ${url}:`, error);
    return null;
  }
};

/**
 * Función corregida para dibujar filas de información
 */
const drawInfoRow = (
  pdf,
  { icon, label, text, x, y, iconSize, textOffset }
) => {
  const lineHeight = 5;
  if (!text || text.trim() === "") return y;

  // Dibujar icono si está disponible
  if (icon) {
    try {
      pdf.addImage(icon, "PNG", x, y - iconSize * 0.75, iconSize, iconSize);
    } catch (error) {
      console.warn("Error al añadir icono:", error);
    }
  }

  // Preparar texto
  const labelPart = label ? `${label}: ` : "";
  const valuePart = text || "";

  // Configurar fuente para etiqueta
  if (label) {
    pdf.setFont("helvetica", "bold").setFontSize(9);
    const labelWidth = pdf.getTextWidth(labelPart);
    pdf.text(labelPart, x + textOffset, y);

    // Configurar fuente para valor
    pdf.setFont("helvetica", "normal");
    pdf.text(valuePart, x + textOffset + labelWidth, y);
  } else {
    pdf.setFont("helvetica", "normal").setFontSize(9);
    pdf.text(valuePart, x + textOffset, y);
  }

  return y + lineHeight + 1;
};

/**
 * Función principal mejorada
 */
const generateColaboradorPdf = async (data, laravelUrl) => {
  if (!data) {
    console.error("No se proporcionaron datos del colaborador.");
    return;
  }

  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 20;

    // Mostrar indicador de carga
    console.log("Generando PDF del colaborador...");

    // --- Cargar iconos con manejo de errores ---
    const iconPromises = Object.entries(iconsPath).map(async ([key, path]) => {
      const icon = await loadIcon(path);
      return [key, icon];
    });

    const iconResults = await Promise.allSettled(iconPromises);
    const icons = {};

    iconResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const [key, icon] = result.value;
        icons[key] = icon;
      }
    });

    const iconPdfSize = 4;
    const textOffset = iconPdfSize + 2;

    // ======================================================
    // CABECERA
    // ======================================================
    const photoSize = 32;
    const infoX = margin + photoSize + 10;

    // Título
    pdf.setFont("helvetica", "bold").setFontSize(16);
    const fullName = `${data.nombre_colaborador || ""} ${
      data.apellidos_colaborador || ""
    }`.trim();
    pdf.text(fullName || "Sin nombre", infoX, yPos);

    // Foto con manejo de errores mejorado
    if (data.foto_colaborador) {
      try {
        const fotoUrl = `${laravelUrl}/api/colaboradores/${data.foto_colaborador}`;
        const response = await fetch(fotoUrl);

        if (response.ok) {
          const blob = await response.blob();
          const imageDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            const timeoutId = setTimeout(() => {
              reject(new Error("Timeout reading image"));
            }, 5000);

            reader.onloadend = () => {
              clearTimeout(timeoutId);
              resolve(reader.result);
            };
            reader.onerror = (err) => {
              clearTimeout(timeoutId);
              reject(err);
            };
            reader.readAsDataURL(blob);
          });

          pdf.addImage(
            imageDataUrl,
            "JPEG",
            margin,
            yPos,
            photoSize,
            photoSize,
            undefined,
            "FAST"
          );
        } else {
          throw new Error("No se pudo cargar la imagen");
        }
      } catch (e) {
        console.error("Error al cargar la foto:", e);
        // Dibujar placeholder
        pdf.setDrawColor(200);
        pdf.rect(margin, yPos, photoSize, photoSize);
        pdf.setFont("helvetica", "normal").setFontSize(8);
        pdf.text("Sin foto", margin + photoSize / 2, yPos + photoSize / 2, {
          align: "center",
        });
      }
    }

    // Chip de estado
    if (data.estado) {
      const isActivo = data.estado === "ACTIVO";
      const chipColor = isActivo ? [26, 179, 148] : [237, 85, 101];
      const chipY = yPos + photoSize + 3;

      pdf.setFillColor(...chipColor);
      pdf.roundedRect(margin, chipY, photoSize, 7, 3, 3, "F");
      pdf
        .setFont("helvetica", "bold")
        .setFontSize(9)
        .setTextColor(255, 255, 255);
      pdf.text(data.estado, margin + photoSize / 2, chipY + 4.5, {
        align: "center",
      });
      pdf.setTextColor(0, 0, 0);
    }

    // Datos personales
    let personalInfoY = yPos + 8;
    pdf.setFont("helvetica", "bold").setFontSize(11).setTextColor(0, 0, 0);
    pdf.text("Datos Personales", infoX, personalInfoY);
    personalInfoY += 6;

    // Información personal con validación
    if (data.dni_colaborador) {
      personalInfoY = drawInfoRow(pdf, {
        icon: icons.dni,
        label: "DNI",
        text: data.dni_colaborador,
        x: infoX,
        y: personalInfoY,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    if (data.correo_colaborador) {
      personalInfoY = drawInfoRow(pdf, {
        icon: icons.email,
        label: "Correo",
        text: data.correo_colaborador,
        x: infoX,
        y: personalInfoY,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    if (data.telefono_colaborador) {
      personalInfoY = drawInfoRow(pdf, {
        icon: icons.phone,
        label: "Teléfono",
        text: data.telefono_colaborador,
        x: infoX,
        y: personalInfoY,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    if (data.direccion_colaborador) {
      personalInfoY = drawInfoRow(pdf, {
        icon: icons.map,
        label: "Dirección",
        text: data.direccion_colaborador,
        x: infoX,
        y: personalInfoY,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    // Lugar de nacimiento
    const lugarNacimiento = [
      data.departamento_colaborador,
      data.provincia_colaborador,
      data.distrito_colaborador,
    ]
      .filter(Boolean)
      .join(" - ");

    if (lugarNacimiento) {
      personalInfoY = drawInfoRow(pdf, {
        icon: icons.point,
        label: "Lugar de Nacimiento",
        text: lugarNacimiento,
        x: infoX,
        y: personalInfoY,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    // Fecha de nacimiento
    if (data.fecha_nacimiento_colaborador) {
      const fechaNacimiento = new Date(
        data.fecha_nacimiento_colaborador
      ).toLocaleDateString("es-ES");
      personalInfoY = drawInfoRow(pdf, {
        icon: icons.cake,
        label: "Fecha de Nacimiento",
        text: fechaNacimiento,
        x: infoX,
        y: personalInfoY,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    yPos = Math.max(yPos + photoSize + 15, personalInfoY) + 5;

    // Divisor
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // ======================================================
    // DATOS LABORALES
    // ======================================================
    pdf.setFont("helvetica", "bold").setFontSize(11);
    pdf.text("Datos Laborales", margin, yPos);
    yPos += 6;

    if (data.cargo_laboral?.cargo) {
      yPos = drawInfoRow(pdf, {
        icon: icons.briefcase,
        label: "Cargo",
        text: data.cargo_laboral.cargo,
        x: margin,
        y: yPos,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    if (data.tipo_empleo_colaborador) {
      yPos = drawInfoRow(pdf, {
        icon: icons.briefcase,
        label: "Tipo de Empleo",
        text: data.tipo_empleo_colaborador,
        x: margin,
        y: yPos,
        iconSize: iconPdfSize,
        textOffset,
      });
    }

    yPos += 5;

    // Divisor
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // ======================================================
    // CONTACTOS DE EMERGENCIA
    // ======================================================
    pdf.setFont("helvetica", "bold").setFontSize(11);
    pdf.text("Contactos de Emergencia", margin, yPos);
    yPos += 6;

    const colWidth = (pageWidth - margin * 2 - 10) / 2;
    const col2X = margin + colWidth + 10;
    let yCol1 = yPos;
    let yCol2 = yPos;

    // Contacto 1
    if (data.nombre_contacto_emergencia || data.telefono_contacto_emergencia) {
      pdf.setFont("helvetica", "bold").setFontSize(10);
      pdf.text("Contacto 1", margin, yCol1);
      yCol1 += 5;

      const nombreCompleto1 = `${data.nombre_contacto_emergencia || ""} ${
        data.apellidos_contacto_emergencia || ""
      }`.trim();
      if (nombreCompleto1) {
        yCol1 = drawInfoRow(pdf, {
          icon: icons.user,
          label: "Nombre",
          text: nombreCompleto1,
          x: margin,
          y: yCol1,
          iconSize: iconPdfSize,
          textOffset,
        });
      }

      if (data.vinculo_contacto_emergencia) {
        yCol1 = drawInfoRow(pdf, {
          icon: icons.vcard,
          label: "Vínculo",
          text: data.vinculo_contacto_emergencia,
          x: margin,
          y: yCol1,
          iconSize: iconPdfSize,
          textOffset,
        });
      }

      if (data.telefono_contacto_emergencia) {
        yCol1 = drawInfoRow(pdf, {
          icon: icons.phone,
          label: "Teléfono",
          text: data.telefono_contacto_emergencia,
          x: margin,
          y: yCol1,
          iconSize: iconPdfSize,
          textOffset,
        });
      }
    }

    // Contacto 2
    if (
      data.nombre_contacto_emergencia2 ||
      data.telefono_contacto_emergencia2
    ) {
      pdf.setFont("helvetica", "bold").setFontSize(10);
      pdf.text("Contacto 2", col2X, yCol2);
      yCol2 += 5;

      const nombreCompleto2 = `${data.nombre_contacto_emergencia2 || ""} ${
        data.apellidos_contacto_emergencia2 || ""
      }`.trim();
      if (nombreCompleto2) {
        yCol2 = drawInfoRow(pdf, {
          icon: icons.user,
          label: "Nombre",
          text: nombreCompleto2,
          x: col2X,
          y: yCol2,
          iconSize: iconPdfSize,
          textOffset,
        });
      }

      if (data.vinculo_contacto_emergencia2) {
        yCol2 = drawInfoRow(pdf, {
          icon: icons.vcard,
          label: "Vínculo",
          text: data.vinculo_contacto_emergencia2,
          x: col2X,
          y: yCol2,
          iconSize: iconPdfSize,
          textOffset,
        });
      }

      if (data.telefono_contacto_emergencia2) {
        yCol2 = drawInfoRow(pdf, {
          icon: icons.phone,
          label: "Teléfono",
          text: data.telefono_contacto_emergencia2,
          x: col2X,
          y: yCol2,
          iconSize: iconPdfSize,
          textOffset,
        });
      }
    }

    yPos = Math.max(yCol1, yCol2) + 5;

    // Divisor
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // ======================================================
    // DOCUMENTOS
    // ======================================================
    pdf.setFont("helvetica", "bold").setFontSize(11);
    pdf.text("Documentos", margin, yPos);
    yPos += 6;

    pdf.setFont("helvetica", "normal").setFontSize(10);
    let hasDocuments = false;

    if (data.cv_colaborador) {
      const cvUrl = `${laravelUrl}/colaboradores/${data.cv_colaborador}`;
      pdf.setTextColor(43, 108, 176);
      pdf.textWithLink(" Descargar CV", margin, yPos, { url: cvUrl });
      pdf.setTextColor(0, 0, 0);
      yPos += 6;
      hasDocuments = true;
    }

    if (data.documentos_complementarios?.length > 0) {
      data.documentos_complementarios.forEach((doc) => {
        const docUrl = `${laravelUrl}/colaboradores/${doc.link_doc_complementario}`;
        pdf.setTextColor(43, 108, 176);
        pdf.textWithLink(` ${doc.nombre_doc_complementario}`, margin, yPos, {
          url: docUrl,
        });
        pdf.setTextColor(0, 0, 0);
        yPos += 6;
        hasDocuments = true;
      });
    }

    if (!hasDocuments) {
      pdf
        .setFont("helvetica", "italic")
        .setFontSize(9)
        .setTextColor(150, 150, 150);
      pdf.text("No hay documentos registrados.", margin, yPos);
      pdf.setTextColor(0, 0, 0);
      yPos += 6;
    }

    yPos += 2;

    // Divisor
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // ======================================================
    // CONTRATOS Y MEMOS
    // ======================================================
    let yColContratos = yPos;
    let yColMemos = yPos;

    // Contratos
    pdf.setFont("helvetica", "bold").setFontSize(11);
    pdf.text("Contratos", margin, yColContratos);
    yColContratos += 6;

    pdf.setFont("helvetica", "normal").setFontSize(9);
    if (data.contratos?.length > 0) {
      data.contratos.forEach((c) => {
        pdf.text(`• ${c.nombre_contrato}`, margin, yColContratos);
        yColContratos += 5;
      });
    } else {
      pdf.setFont("helvetica", "italic").setTextColor(150, 150, 150);
      pdf.text("No hay contratos registrados.", margin, yColContratos);
      pdf.setTextColor(0, 0, 0);
      yColContratos += 5;
    }

    // Memos
    pdf.setFont("helvetica", "bold").setFontSize(11);
    pdf.text("Memos", col2X, yColMemos);
    yColMemos += 6;

    pdf.setFont("helvetica", "normal").setFontSize(9);
    if (data.memos?.length > 0) {
      data.memos.forEach((m) => {
        pdf.text(`• ${m.motivo_memo}`, col2X, yColMemos);
        yColMemos += 5;
      });
    } else {
      pdf.setFont("helvetica", "italic").setTextColor(150, 150, 150);
      pdf.text("No hay memos registrados.", col2X, yColMemos);
      pdf.setTextColor(0, 0, 0);
      yColMemos += 5;
    }

    // Guardar PDF
    const filename = `Colaborador_${
      data.apellidos_colaborador || "SinApellido"
    }_${data.nombre_colaborador || "SinNombre"}.pdf`;
    pdf.save(filename);

    console.log("PDF generado exitosamente:", filename);
  } catch (error) {
    console.error("Error al generar el PDF:", error);

    // Generar PDF básico sin iconos ni imágenes como fallback
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFont("helvetica", "bold").setFontSize(16);
      pdf.text("Error al generar PDF completo", 20, 30);
      pdf.setFont("helvetica", "normal").setFontSize(12);
      pdf.text(
        "Se ha producido un error al generar el PDF con todos los elementos.",
        20,
        50
      );
      pdf.text("Por favor, contacte al administrador del sistema.", 20, 60);
      pdf.save("Error_PDF_Colaborador.pdf");
    } catch (fallbackError) {
      console.error("Error en PDF de fallback:", fallbackError);
      alert(
        "Error crítico al generar el PDF. Por favor, recargue la página e intente nuevamente."
      );
    }
  }
};

export default generateColaboradorPdf;
