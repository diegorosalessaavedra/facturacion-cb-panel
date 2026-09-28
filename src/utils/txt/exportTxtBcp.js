// --- FUNCIONES AUXILIARES PARA ESPACIADO BCP ---
const padRight = (str, length) => {
  if (!str) return " ".repeat(length);
  return String(str).substring(0, length).padEnd(length, " ");
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

      const nombreCompleto = padRight(
        `${colaborador.apellidos_colaborador || ""} ${colaborador.nombre_colaborador || ""}`
          .trim()
          .toUpperCase(),
        75,
      );

      const refBeneficiario = padRight(glosa.toUpperCase(), 40);
      const glosaCorta = glosa
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
    subtipo + // <--- Subtipo dinámico (reemplazó a la X)
    "C" + // <--- C fija
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
