import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import formatDate from "../../hooks/FormatDate";
import { numeroALetras } from "../../assets/numeroLetras";

// --- FUNCIÓN AUXILIAR PARA NORMALIZAR TEXTOS (Quitar tildes y cambiar ñ por n) ---
const quitarTildesYenie = (str) => {
  if (!str) return "";
  return String(str)
    .normalize("NFD")                  // Separa los caracteres de sus tildes
    .replace(/[\u0300-\u036f]/g, "")    // Elimina las marcas de tildes
    .replace(/ñ/g, "n")                // Reemplaza ñ minúscula
    .replace(/Ñ/g, "N");               // Reemplaza Ñ mayúscula
};

// --- FUNCIONES AUXILIARES PARA ESPACIADO BCP ---
const padRight = (str, length) => {
  const textoLimpio = quitarTildesYenie(str);
  if (!textoLimpio) return " ".repeat(length);
  return textoLimpio.substring(0, length).padEnd(length, " ");
};

const padLeftZeros = (num, length) => {
  if (!num && num !== 0) return "0".repeat(length);
  return String(num).padStart(length, "0");
};

const formatMontoStr = (monto) => {
  const numFixed = Number(monto).toFixed(2);
  return padLeftZeros(numFixed, 17);
};

const getFechaActual = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

export const generarTxtBcp = (selectDatosText, glosa, subtipo) => {
  const lineasDetalle = [];
  let sumaImportes = 0;
  let cantidadAbonos = 0;
  let sumaChecksum = BigInt(0);

  const cuentaCargoOriginal = "1937211891082";

  selectDatosText.forEach((item) => {
    const { colaborador, dataValidacionTxt } = item;
    const totalPagar = Number(dataValidacionTxt?.monto || 0);

    if (
      totalPagar > 0 &&
      colaborador.nro_cuenta &&
      colaborador.nro_cuenta !== "SIN CUENTA"
    ) {
      sumaImportes += totalPagar;
      cantidadAbonos++;

      const nroCuentaLimpio = String(colaborador.nro_cuenta).replace(
        /[^0-9]/g,
        "",
      );
      const tipoCuenta = nroCuentaLimpio.length > 15 ? "B" : "A";

      let cuentaRecortada = "0";
      if (tipoCuenta === "B") {
        cuentaRecortada = nroCuentaLimpio.substring(10);
      } else {
        cuentaRecortada = nroCuentaLimpio.substring(3);
      }

      sumaChecksum += BigInt(cuentaRecortada || 0);

      const tipoDni = "1";
      const dni = padRight(
        String(colaborador.dni_colaborador || "").trim(),
        15,
      );

      // Se aplicará automáticamente la limpieza de tildes y 'ñ' gracias al padRight actualizado
      const nombreCompleto = padRight(
        `${colaborador.apellidos_colaborador || ""} ${colaborador.nombre_colaborador || ""}`
          .trim()
          .toUpperCase(),
        75,
      );

      const refBeneficiario = padRight(glosa.toUpperCase(), 40);
      
      const glosaLimpia = quitarTildesYenie(glosa);
      const glosaCorta = glosaLimpia
        .replace(/[^A-Z0-9]/gi, "")
        .substring(0, 20)
        .toUpperCase();
      const refEmpresa = padRight(glosaCorta, 20);

      const fila =
        "2" +
        tipoCuenta +
        padRight(nroCuentaLimpio, 20) +
        tipoDni +
        dni +
        nombreCompleto +
        refBeneficiario +
        refEmpresa +
        "0001" +
        formatMontoStr(totalPagar) +
        "S";

      lineasDetalle.push(fila);
    }
  });

  if (cantidadAbonos === 0) {
    throw new Error(
      "No hay registros válidos con cuenta y monto para generar el TXT.",
    );
  }

  const cargoRecortado = cuentaCargoOriginal.substring(3);
  sumaChecksum += BigInt(cargoRecortado || 0);

  const checksumFinal = padLeftZeros(sumaChecksum.toString(), 15);
  const cuentaCargoStr = padRight(cuentaCargoOriginal, 20);

  // CABECERA CORREGIDA
  const cabecera =
    "1" +
    padLeftZeros(cantidadAbonos, 6) +
    getFechaActual() +
    subtipo + 
    "C" + 
    "0001" +
    cuentaCargoStr +
    formatMontoStr(sumaImportes) +
    padRight(glosa.toUpperCase(), 40) +
    checksumFinal;

  const contenidoTxt = [cabecera, ...lineasDetalle].join("\r\n");

  const blob = new Blob([contenidoTxt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Planilla_BCP_${getFechaActual()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};