// --- FUNCIONES AUXILIARES PARA ESPACIADO BCP ---
const padRight = (str, length) => {
  if (!str) return " ".repeat(length);
  return String(str).substring(0, length).padEnd(length, " ");
};

const padLeftZeros = (num, length) => {
  if (!num && num !== 0) return "0".repeat(length);
  return String(num).padStart(length, "0");
};

// Da formato al monto eliminando el punto y rellenando con ceros (Ej. 100.00 -> 00000000000100.00)
const formatMontoStr = (monto) => {
  const numFixed = Number(monto).toFixed(2);
  return padLeftZeros(numFixed, 17);
};

const getFechaActual = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`; // Retorna siempre AAAAMMDD
};

export const generarTxtBcp = (selectDatosText, dataSemana, glosa) => {
  const lineasDetalle = [];
  let sumaImportes = 0;
  let cantidadAbonos = 0;

  // Usamos BigInt porque la suma de cuentas superará el límite seguro de los números normales en JS
  let sumaChecksum = BigInt(0);

  // Cuenta cargo (empleador) base
  const cuentaCargoOriginal = "1937211891082";

  // 1. Filtrar y procesar colaboradores
  selectDatosText.forEach((item) => {
    const { colaborador, dataValidacionTxt } = item;

    // Tomamos el monto validado directamente de la BD
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

      // --- CÁLCULO DE CHECKSUM DEL COLABORADOR ---
      let cuentaRecortada = "0";
      if (tipoCuenta === "B") {
        // Interbancaria: Eliminar los 10 primeros dígitos
        cuentaRecortada = nroCuentaLimpio.substring(10);
      } else {
        // BCP: Eliminar los 3 primeros dígitos
        cuentaRecortada = nroCuentaLimpio.substring(3);
      }

      // Sumamos al total acumulado del checksum
      sumaChecksum += BigInt(cuentaRecortada || 0);

      // --- CONSTRUCCIÓN DEL DETALLE ---
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
        "2" + // Tipo de registro
        tipoCuenta + // Subtipo planilla (A/B)
        padRight(nroCuentaLimpio, 20) + // Numero de cuenta trabajador
        tipoDni + // Tipo Doc
        dni + // DNI
        nombreCompleto + // Nombres (75 espacios)
        refBeneficiario + // Ref Beneficiario (40 espacios)
        refEmpresa + // Ref Empresa (20 espacios)
        "0001" + // Constante
        formatMontoStr(totalPagar) + // Monto (17 espacios)
        "S"; // Finalizador

      lineasDetalle.push(fila);
    }
  });

  if (cantidadAbonos === 0) {
    throw new Error(
      "No hay registros válidos con cuenta y monto para generar el TXT.",
    );
  }

  // --- CÁLCULO DE CHECKSUM FINAL (INCLUYENDO LA CUENTA DEL EMPLEADOR) ---
  // Para la cuenta de cargo: Eliminar los 3 primeros dígitos
  const cargoRecortado = cuentaCargoOriginal.substring(3);
  sumaChecksum += BigInt(cargoRecortado || 0);

  // Convertimos a string y rellenamos con 0s a la izquierda hasta tener 15 caracteres
  const checksumFinal = padLeftZeros(sumaChecksum.toString(), 15);

  // 2. Construir la Cabecera (Header)
  const cuentaCargoStr = padRight(cuentaCargoOriginal, 20);

  const cabecera =
    "1" + // Tipo Registro
    padLeftZeros(cantidadAbonos, 6) + // Cantidad Abonos
    getFechaActual() + // Fecha
    "X" + // Tipo
    "C" + // Fijo C
    "0001" + // Fijo 0001
    cuentaCargoStr + // Cuenta Cargo Origen
    formatMontoStr(sumaImportes) + // Suma Importes
    padRight(glosa.toUpperCase(), 40) + // Glosa Cabecera
    checksumFinal; // Checksum dinámico

  // 3. Unir todo
  const contenidoTxt = [cabecera, ...lineasDetalle].join("\r\n");

  // 4. Descargar el archivo
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
